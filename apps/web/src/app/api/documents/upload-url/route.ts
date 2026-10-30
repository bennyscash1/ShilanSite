import { headers } from "next/headers";
import { z } from "zod";
import { documentsCopy as t } from "@/content/documents";
import { isCustomerKind, MAX_DOCUMENT_BYTES } from "@/lib/documents/files";
import { fromDocumentError, isUser, jsonError, jsonOk, requireApiUser } from "@/lib/documents/http";
import { prepareUpload } from "@/lib/documents/store";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  contentType: z.string().trim().min(1).max(120),
  size: z.number().int().positive().max(MAX_DOCUMENT_BYTES),
  customerType: z.enum(["private", "osek", "corporation"]).optional(),
  docType: z
    .string()
    .trim()
    .regex(/^[a-z0-9_-]{1,40}$/)
    .optional(),
});

export async function POST(request: Request) {
  const user = await requireApiUser();
  if (!isUser(user)) return user;

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`upload:${user.uid}:${ip}`, 30, 10 * 60 * 1000))
    return jsonError(t.rateLimited, 429);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return jsonError(t.failed, 400);
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    const size =
      typeof (json as { size?: unknown })?.size === "number" ? (json as { size: number }).size : 0;
    if (size > MAX_DOCUMENT_BYTES) return jsonError(t.tooBig, 400);
    return jsonError(t.badType, 400);
  }

  try {
    const prepared = await prepareUpload({
      uid: user.uid,
      name: parsed.data.name,
      contentType: parsed.data.contentType,
      size: parsed.data.size,
      customerType: isCustomerKind(parsed.data.customerType) ? parsed.data.customerType : undefined,
      docType: parsed.data.docType,
    });
    return jsonOk(prepared);
  } catch (error) {
    return fromDocumentError(error);
  }
}
