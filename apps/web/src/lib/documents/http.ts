import { NextResponse } from "next/server";
import { getCurrentUser, type CurrentUser } from "@/lib/auth/session";
import { documentsCopy as t } from "@/content/documents";
import { DocumentError } from "./store";

const noStore = { "Cache-Control": "no-store" };

export function jsonError(message: string, status: number) {
  return NextResponse.json({ message }, { status, headers: noStore });
}

export function jsonOk(body: unknown) {
  return NextResponse.json(body, { headers: noStore });
}

export async function requireApiUser(): Promise<CurrentUser | NextResponse> {
  const user = await getCurrentUser();
  if (!user) return jsonError(t.login, 401);
  return user;
}

export function isUser(value: CurrentUser | NextResponse): value is CurrentUser {
  return !(value instanceof NextResponse);
}

export function fromDocumentError(error: unknown) {
  if (error instanceof DocumentError) return jsonError(error.message, error.status);
  console.error("[documents]", error);
  return jsonError(t.failed, 500);
}

export function hebrewPage(message: string, status: number) {
  const safe = message.replace(
    /[&<>]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char] ?? char,
  );
  return new NextResponse(
    `<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><title>${safe}</title><body style="font-family:Heebo,sans-serif;padding:2rem;background:#f4f1e8;color:#084616"><p>${safe}</p></body></html>`,
    {
      status,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
    },
  );
}

const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UID_RE = /^[A-Za-z0-9_-]{6,128}$/;

export function isDocumentId(value: string): boolean {
  return ID_RE.test(value);
}

export function isUserId(value: string): boolean {
  return UID_RE.test(value);
}
