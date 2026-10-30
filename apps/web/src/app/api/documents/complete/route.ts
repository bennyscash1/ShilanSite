import { z } from "zod";
import { documentsCopy as t } from "@/content/documents";
import { fromDocumentError, isUser, jsonError, jsonOk, requireApiUser } from "@/lib/documents/http";
import { completeUpload } from "@/lib/documents/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({ token: z.string().min(20).max(8000) });

export async function POST(request: Request) {
  const user = await requireApiUser();
  if (!isUser(user)) return user;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return jsonError(t.failed, 400);
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return jsonError(t.failed, 400);

  try {
    const document = await completeUpload(user.uid, parsed.data.token);
    return jsonOk({
      id: document.id,
      name: document.name,
      size: document.size,
      uploadedAt: document.uploadedAt,
      status: document.status,
    });
  } catch (error) {
    return fromDocumentError(error);
  }
}
