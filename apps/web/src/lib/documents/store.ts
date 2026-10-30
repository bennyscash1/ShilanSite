// Server-only. Files stay private; the browser never receives a storage credential.
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { adminBucket, adminDb, isFirebaseAdminConfigured } from "@shilan/firebase/admin";
import {
  COLLECTIONS,
  SUBCOLLECTIONS,
  type CustomerDocumentRecord,
  type CustomerKind,
  type UserProfile,
} from "@shilan/firebase/collections";
import { documentsCopy as t } from "@/content/documents";
import {
  documentStoragePath,
  isAllowedContentType,
  isAllowedSize,
  isCustomerKind,
  isStorageSetupError,
  isVisibleDocumentStatus,
  MAX_DOCUMENT_BYTES,
  normalizeContentType,
  pathBelongsToUser,
  sanitizeFileName,
} from "./files";

export class DocumentError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export type UploadIntent = {
  v: 1;
  uid: string;
  id: string;
  path: string;
  name: string;
  contentType: string;
  size: number;
  customerType?: CustomerKind;
  docType?: string;
  exp: number;
};

export type PreparedUpload = {
  id: string;
  uploadUrl: string;
  token: string;
  contentType: string;
  lengthRange: string;
};

export type ListedDocument = CustomerDocumentRecord & { id: string };

export type CustomerRow = {
  uid: string;
  displayName: string;
  email: string;
  phone: string | null;
  username: string | null;
  customerType: CustomerKind | null;
  createdAt: string;
  fileCount: number;
};

const UPLOAD_TTL_MS = 15 * 60 * 1000;
const READ_TTL_MS = 5 * 60 * 1000;

let bucketReadyUntil = 0;

function signingKey(): Buffer {
  const material =
    process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PROJECT_ID || "shilan-documents";
  return createHash("sha256").update(`documents:${material}`).digest();
}

function sign(body: string): string {
  return createHmac("sha256", signingKey()).update(body).digest("base64url");
}

function signaturesMatch(a: string, b: string): boolean {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

function seal(intent: UploadIntent): string {
  const body = Buffer.from(JSON.stringify(intent)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function openUploadIntent(token: string): UploadIntent | null {
  const [body, signature] = token.split(".");
  if (!body || !signature || !signaturesMatch(signature, sign(body))) return null;
  try {
    const intent = JSON.parse(Buffer.from(body, "base64url").toString()) as UploadIntent;
    if (intent.v !== 1 || intent.exp < Date.now() / 1000) return null;
    if (intent.path !== documentStoragePath(intent.uid, intent.id, intent.name)) return null;
    if (!pathBelongsToUser(intent.path, intent.uid)) return null;
    return intent;
  } catch {
    return null;
  }
}

function asSetupError(error: unknown): DocumentError | null {
  if (isStorageSetupError(error) || !isFirebaseAdminConfigured()) {
    return new DocumentError(503, t.unavailable);
  }
  return null;
}

export async function isStorageBucketReady(): Promise<boolean> {
  if (!isFirebaseAdminConfigured()) return false;
  if (Date.now() < bucketReadyUntil) return true;
  try {
    const [exists] = await (await adminBucket()).exists();
    if (exists) bucketReadyUntil = Date.now() + 5 * 60 * 1000;
    return exists;
  } catch (error) {
    console.error("[documents] storage probe failed", error);
    return false;
  }
}

async function assertStorageReady(): Promise<void> {
  if (!(await isStorageBucketReady())) throw new DocumentError(503, t.unavailable);
}

export async function prepareUpload(input: {
  uid: string;
  name: string;
  contentType: string;
  size: number;
  customerType?: CustomerKind;
  docType?: string;
}): Promise<PreparedUpload> {
  await assertStorageReady();
  if (!isAllowedContentType(input.contentType)) throw new DocumentError(400, t.badType);
  if (input.size <= 0) throw new DocumentError(400, t.emptyFile);
  if (!isAllowedSize(input.size)) throw new DocumentError(400, t.tooBig);

  const id = randomUUID();
  const name = sanitizeFileName(input.name);
  const contentType = normalizeContentType(input.contentType);
  const path = documentStoragePath(input.uid, id, name);
  const lengthRange = `1,${MAX_DOCUMENT_BYTES}`;
  const intent: UploadIntent = {
    v: 1,
    uid: input.uid,
    id,
    path,
    name,
    contentType,
    size: input.size,
    exp: Math.floor((Date.now() + UPLOAD_TTL_MS) / 1000),
    ...(input.customerType ? { customerType: input.customerType } : {}),
    ...(input.docType ? { docType: input.docType } : {}),
  };

  try {
    const file = (await adminBucket()).file(path);
    const [uploadUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + UPLOAD_TTL_MS,
      contentType,
      extensionHeaders: { "x-goog-content-length-range": lengthRange },
    });
    return { id, uploadUrl, token: seal(intent), contentType, lengthRange };
  } catch (error) {
    const setup = asSetupError(error);
    if (setup) throw setup;
    console.error("[documents] could not sign upload", error);
    throw new DocumentError(503, t.unavailable);
  }
}

export async function completeUpload(uid: string, token: string): Promise<ListedDocument> {
  const intent = openUploadIntent(token);
  if (!intent || intent.uid !== uid) throw new DocumentError(400, t.failed);
  await assertStorageReady();

  const bucket = await adminBucket();
  const file = bucket.file(intent.path);
  let size = 0;
  let contentType = "";
  try {
    const [metadata] = await file.getMetadata();
    size = Number(metadata.size ?? 0);
    contentType = normalizeContentType(String(metadata.contentType ?? ""));
  } catch (error) {
    const setup = asSetupError(error);
    if (setup) throw setup;
    console.error("[documents] uploaded object missing", error);
    throw new DocumentError(400, t.failed);
  }

  if (!isAllowedContentType(contentType) || !isAllowedSize(size)) {
    await file.delete({ ignoreNotFound: true }).catch(() => {});
    throw new DocumentError(400, !isAllowedContentType(contentType) ? t.badType : t.tooBig);
  }

  const record: CustomerDocumentRecord = {
    name: intent.name,
    contentType,
    size,
    path: intent.path,
    uploadedAt: new Date().toISOString(),
    status: "uploaded",
    ...(intent.customerType ? { customerType: intent.customerType } : {}),
    ...(intent.docType ? { docType: intent.docType } : {}),
  };

  const db = await adminDb();
  const userRef = db.collection(COLLECTIONS.users).doc(uid);
  const docRef = userRef.collection(SUBCOLLECTIONS.documents).doc(intent.id);
  const existing = await docRef.get();
  if (!existing.exists) {
    const batch = db.batch();
    batch.create(docRef, record);
    if (intent.customerType)
      batch.set(userRef, { customerType: intent.customerType }, { merge: true });
    await batch.commit();
  }
  return { id: intent.id, ...record };
}

function toListed(id: string, data: Record<string, unknown>): ListedDocument | null {
  if (!isVisibleDocumentStatus(data.status)) return null;
  if (typeof data.name !== "string" || typeof data.path !== "string") return null;
  return {
    id,
    name: data.name,
    contentType:
      typeof data.contentType === "string" ? data.contentType : "application/octet-stream",
    size: typeof data.size === "number" ? data.size : 0,
    path: data.path,
    uploadedAt: typeof data.uploadedAt === "string" ? data.uploadedAt : "",
    status: data.status,
    ...(typeof data.docType === "string" ? { docType: data.docType } : {}),
    ...(isCustomerKind(data.customerType) ? { customerType: data.customerType } : {}),
  };
}

export async function listDocuments(uid: string): Promise<ListedDocument[]> {
  const db = await adminDb();
  const snap = await db
    .collection(COLLECTIONS.users)
    .doc(uid)
    .collection(SUBCOLLECTIONS.documents)
    .get();
  return snap.docs
    .map((doc) => toListed(doc.id, doc.data() as Record<string, unknown>))
    .filter((doc): doc is ListedDocument => doc !== null)
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

async function ownedDocument(uid: string, id: string): Promise<ListedDocument> {
  const db = await adminDb();
  const snap = await db
    .collection(COLLECTIONS.users)
    .doc(uid)
    .collection(SUBCOLLECTIONS.documents)
    .doc(id)
    .get();
  const doc = snap.exists
    ? toListed(snap.id, (snap.data() ?? {}) as Record<string, unknown>)
    : null;
  if (!doc || !pathBelongsToUser(doc.path, uid)) throw new DocumentError(404, t.notFound);
  return doc;
}

export async function signedReadUrl(uid: string, id: string, download: boolean): Promise<string> {
  const doc = await ownedDocument(uid, id);
  await assertStorageReady();
  const disposition = download ? "attachment" : "inline";
  const filename = encodeURIComponent(doc.name);
  try {
    const [url] = await (await adminBucket()).file(doc.path).getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + READ_TTL_MS,
      responseDisposition: `${disposition}; filename*=UTF-8''${filename}`,
    });
    return url;
  } catch (error) {
    const setup = asSetupError(error);
    if (setup) throw setup;
    console.error("[documents] could not sign read", error);
    throw new DocumentError(503, t.unavailable);
  }
}

export async function deleteDocument(uid: string, id: string): Promise<void> {
  const doc = await ownedDocument(uid, id);
  try {
    if (await isStorageBucketReady()) {
      await (await adminBucket()).file(doc.path).delete({ ignoreNotFound: true });
    }
  } catch (error) {
    const setup = asSetupError(error);
    if (setup) throw setup;
    const code = (error as { code?: number }).code;
    if (code !== 404) {
      console.error("[documents] could not delete object", error);
      throw new DocumentError(500, t.removeFailed);
    }
  }
  const db = await adminDb();
  await db
    .collection(COLLECTIONS.users)
    .doc(uid)
    .collection(SUBCOLLECTIONS.documents)
    .doc(id)
    .delete();
}

async function fileCount(uid: string): Promise<number> {
  const db = await adminDb();
  const snap = await db
    .collection(COLLECTIONS.users)
    .doc(uid)
    .collection(SUBCOLLECTIONS.documents)
    .select("status")
    .get();
  return snap.docs.filter((doc) => isVisibleDocumentStatus(doc.get("status"))).length;
}

export async function listCustomers(): Promise<CustomerRow[]> {
  const db = await adminDb();
  const snap = await db.collection(COLLECTIONS.users).orderBy("createdAt", "desc").limit(500).get();
  return Promise.all(
    snap.docs.map(async (doc) => {
      const data = doc.data() as UserProfile;
      let count = 0;
      try {
        count = await fileCount(doc.id);
      } catch (error) {
        console.error("[documents] file count failed", doc.id, error);
      }
      return {
        uid: doc.id,
        displayName: data.displayName || "",
        email: data.email || "",
        phone: data.phone?.trim() || null,
        username: data.username,
        customerType: isCustomerKind(data.customerType) ? data.customerType : null,
        createdAt: data.createdAt || "",
        fileCount: count,
      };
    }),
  );
}

export async function getCustomer(
  uid: string,
): Promise<{ profile: UserProfile; documents: ListedDocument[] } | null> {
  const db = await adminDb();
  const snap = await db.collection(COLLECTIONS.users).doc(uid).get();
  if (!snap.exists) return null;
  const data = snap.data() as UserProfile;
  return {
    profile: {
      ...data,
      uid: data.uid || uid,
      customerType: isCustomerKind(data.customerType) ? data.customerType : undefined,
    },
    documents: await listDocuments(uid),
  };
}
