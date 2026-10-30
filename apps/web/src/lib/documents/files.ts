import type { CustomerKind, DocumentStatus } from "@shilan/firebase/collections";

export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
export const MAX_FILES_PER_BATCH = 20;
export const VISIBLE_DOCUMENT_STATUSES = [
  "uploaded",
  "pending_signature",
  "signed",
] as const satisfies readonly DocumentStatus[];

export const customerKindLabel: Record<CustomerKind, string> = {
  private: "פרטי",
  osek: "עסקי",
  corporation: "תאגיד",
};

export const documentStatusLabel: Record<DocumentStatus, string> = {
  uploaded: "הועלה",
  pending_signature: "ממתין לחתימה",
  signed: "נחתם",
};

const CUSTOMER_KINDS = new Set<string>(["private", "osek", "corporation"]);
const VISIBLE = new Set<string>(VISIBLE_DOCUMENT_STATUSES);

export function isCustomerKind(value: unknown): value is CustomerKind {
  return typeof value === "string" && CUSTOMER_KINDS.has(value);
}

export function isDocumentStatus(value: unknown): value is DocumentStatus {
  return value === "uploaded" || value === "pending_signature" || value === "signed";
}

export function isVisibleDocumentStatus(value: unknown): value is DocumentStatus {
  return typeof value === "string" && VISIBLE.has(value);
}

/** image/* or PDF. Parameters such as ";charset" are ignored. */
export function normalizeContentType(value: string): string {
  return value.toLowerCase().split(";")[0]?.trim() ?? "";
}

export function isAllowedContentType(value: string): boolean {
  const type = normalizeContentType(value);
  if (!type || /[\s\r\n]/.test(type)) return false;
  return type === "application/pdf" || type.startsWith("image/");
}

export function isAllowedSize(size: number): boolean {
  return Number.isInteger(size) && size > 0 && size <= MAX_DOCUMENT_BYTES;
}

/** Drop directories and characters that do not belong in an object name. */
export function sanitizeFileName(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "";
  const cleaned = base
    .replace(/[^\p{L}\p{N}._-]+/gu, "_")
    .replace(/_+/g, "_")
    .replace(/^[._]+/, "")
    .slice(0, 80);
  return cleaned || "file";
}

export function documentStoragePath(uid: string, fileId: string, name: string): string {
  return `customers/${uid}/${fileId}-${sanitizeFileName(name)}`;
}

export function pathBelongsToUser(path: string, uid: string): boolean {
  return path.startsWith(`customers/${uid}/`) && !path.split("/").includes("..");
}

export function isStorageSetupError(error: unknown): boolean {
  const err = error as {
    code?: number | string;
    message?: string;
    errors?: { reason?: string; message?: string }[];
  };
  const code = err?.code;
  const reason = (err?.errors?.[0]?.reason ?? "").toLowerCase();
  const message = `${err?.message ?? ""} ${err?.errors?.[0]?.message ?? ""}`.toLowerCase();
  if (code === 404 || code === "404" || reason === "notfound" || reason === "accessnotconfigured")
    return true;
  if (typeof code === "string" && /bucket-not-found|not-found/.test(code)) return true;
  if (
    /bucket does not exist|specified bucket|not been set up|storage has not|firebase storage|billing account|access not configured/.test(
      message,
    )
  ) {
    return true;
  }
  if ((code === 403 || code === "403") && /storage|bucket|billing|permission/.test(message))
    return true;
  return false;
}

export function formatDocumentSize(size: number): string {
  if (!Number.isFinite(size) || size < 0) return "";
  if (size < 1024) return `${Math.round(size)} בייט`;
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} ק״ב`;
  const mb = size / (1024 * 1024);
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} מ״ב`;
}

export function formatDocumentDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("he-IL", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
