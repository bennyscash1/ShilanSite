import { NextResponse } from "next/server";
import { documentsCopy as t } from "@/content/documents";
import { hebrewPage, isDocumentId } from "@/lib/documents/http";
import { DocumentError, signedReadUrl } from "@/lib/documents/store";
import { getCurrentUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;
  if (!user) {
    const next = `/account`;
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, request.url));
  }
  if (!isDocumentId(id)) return hebrewPage(t.notFound, 404);
  const download = new URL(request.url).searchParams.get("download") === "1";
  try {
    const url = await signedReadUrl(user.uid, id, download);
    return NextResponse.redirect(url);
  } catch (error) {
    if (error instanceof DocumentError) return hebrewPage(error.message, error.status);
    console.error("[documents] open", error);
    return hebrewPage(t.failed, 500);
  }
}
