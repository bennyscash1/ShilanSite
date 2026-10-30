import { documentsCopy as t } from "@/content/documents";
import {
  fromDocumentError,
  isDocumentId,
  isUser,
  jsonError,
  jsonOk,
  requireApiUser,
} from "@/lib/documents/http";
import { deleteDocument } from "@/lib/documents/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireApiUser();
  if (!isUser(user)) return user;
  const { id } = await params;
  if (!isDocumentId(id)) return jsonError(t.notFound, 404);
  try {
    await deleteDocument(user.uid, id);
    return jsonOk({ ok: true });
  } catch (error) {
    return fromDocumentError(error);
  }
}
