import { headers } from "next/headers";
import { z } from "zod";
import { siteUrl } from "@/config/site";
import { documentsCopy as t } from "@/content/documents";
import { customerKindLabel } from "@/lib/documents/files";
import { fromDocumentError, isUser, jsonError, jsonOk, requireApiUser } from "@/lib/documents/http";
import { completeUpload, getCustomer } from "@/lib/documents/store";
import { notifyDocumentUpload } from "@/lib/mail/notify";

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
    try {
      const customer = await getCustomer(user.uid);
      const kind = customer?.profile.customerType ?? document.customerType;
      const h = await headers();
      const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
      const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
      const origin = host && !/[\s/]/.test(host) ? `${proto}://${host}` : siteUrl;
      await notifyDocumentUpload({
        name: customer?.profile.displayName || user.displayName,
        email: customer?.profile.email || user.email,
        customerType: kind ? customerKindLabel[kind] : "לא צוין",
        fileName: document.name,
        fileCount: customer?.documents.length ?? 1,
        adminUrl: `${origin}/admin/customers/${user.uid}`,
      });
    } catch (error) {
      console.error("[mail] document notice failed", error);
    }
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
