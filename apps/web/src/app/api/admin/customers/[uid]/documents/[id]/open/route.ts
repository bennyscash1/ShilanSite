import { NextResponse } from "next/server";
import { documentsCopy as t } from "@/content/documents";
import { hebrewPage, isDocumentId, isUserId } from "@/lib/documents/http";
import { DocumentError, signedReadUrl } from "@/lib/documents/store";
import { getSession } from "@/lib/admin/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uid: string; id: string }> },
) {
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/admin/login", request.url));
  const { uid, id } = await params;
  if (!isUserId(uid) || !isDocumentId(id)) return hebrewPage(t.notFound, 404);
  const download = new URL(request.url).searchParams.get("download") === "1";
  try {
    const url = await signedReadUrl(uid, id, download);
    return NextResponse.redirect(url);
  } catch (error) {
    if (error instanceof DocumentError) return hebrewPage(error.message, error.status);
    console.error("[documents] admin open", error);
    return hebrewPage(t.failed, 500);
  }
}
