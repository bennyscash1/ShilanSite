import { NextResponse } from "next/server";
import { adminAuth, adminBucket, adminDb } from "@shilan/firebase/admin";
import { COLLECTIONS } from "@shilan/firebase/collections";
import { getSession } from "@/lib/admin/session";
import { isUserId } from "@/lib/documents/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cors = [
  {
    origin: ["https://shilan-site.vercel.app", "https://shilan.co.il", "https://www.shilan.co.il", "http://localhost:3000"],
    method: ["GET", "HEAD", "PUT", "OPTIONS"],
    responseHeader: ["Content-Type", "x-goog-content-length-range"],
    maxAgeSeconds: 3600,
  },
];

async function requireAdminResponse() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  return null;
}

export async function POST() {
  const denied = await requireAdminResponse();
  if (denied) return denied;
  try {
    const bucket = await adminBucket();
    const [exists] = await bucket.exists();
    await bucket.setCorsConfiguration(cors);
    return NextResponse.json({ ok: true, exists });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    console.error("[documents] cors setup", error);
    return NextResponse.json({ ok: false, message: message.slice(0, 400) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const denied = await requireAdminResponse();
  if (denied) return denied;
  const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase();
  if (!email || !email.endsWith("@example.com")) {
    return NextResponse.json({ message: "refused" }, { status: 400 });
  }
  try {
    const auth = await adminAuth();
    const user = await auth.getUserByEmail(email);
    if (!isUserId(user.uid)) return NextResponse.json({ message: "bad uid" }, { status: 400 });
    const db = await adminDb();
    const profile = await db.collection(COLLECTIONS.users).doc(user.uid).get();
    const username = profile.data()?.username;
    const docs = await db.collection(COLLECTIONS.users).doc(user.uid).collection("documents").get();
    const bucket = await adminBucket();
    for (const doc of docs.docs) {
      const path = doc.get("path");
      if (typeof path === "string") await bucket.file(path).delete({ ignoreNotFound: true }).catch(() => {});
      await doc.ref.delete();
    }
    if (typeof username === "string" && username) await db.collection(COLLECTIONS.usernames).doc(username).delete();
    await db.collection(COLLECTIONS.users).doc(user.uid).delete();
    await auth.deleteUser(user.uid);
    return NextResponse.json({ ok: true, removed: docs.size });
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed";
    console.error("[documents] test user cleanup", error);
    return NextResponse.json({ ok: false, message: message.slice(0, 400) }, { status: 500 });
  }
}
