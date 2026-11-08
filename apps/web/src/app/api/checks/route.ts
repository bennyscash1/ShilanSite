import { NextResponse } from "next/server";
import { notifyInquiry } from "@/lib/mail/notify";
import { MailError } from "@/lib/mail/send";
import { normalizeIsraeliPhone } from "@/lib/leads/parse";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };
const MAX_FILES = 10;
const MAX_BYTES = 8 * 1024 * 1024;

function json(body: { ok: boolean; message?: string }, status = 200) {
  return NextResponse.json(body, { status, headers: noStore });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`checks:${ip}`, 5, 15 * 60 * 1000)) {
    return json({ ok: false, message: "יותר מדי פניות. נסו שוב בעוד כמה דקות." }, 429);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, message: "הטופס לא תקין." }, 400);
  }

  const name = String(form.get("name") ?? "").trim();
  const phone = normalizeIsraeliPhone(String(form.get("phone") ?? ""));
  const email = String(form.get("email") ?? "").trim();
  const notes = String(form.get("notes") ?? "").trim();
  if (name.length < 2) return json({ ok: false, message: "יש להזין שם מלא" }, 400);
  if (!phone) return json({ ok: false, message: "מספר טלפון לא תקין" }, 400);
  if (form.get("consent") !== "on") return json({ ok: false, message: "יש לאשר את מדיניות הפרטיות" }, 400);

  const photos = form.getAll("photos").filter((item): item is File => item instanceof File && item.size > 0);
  if (photos.length > MAX_FILES) return json({ ok: false, message: "ניתן לצרף עד 10 שיקים." }, 400);
  if (photos.some((file) => !file.type.startsWith("image/"))) {
    return json({ ok: false, message: "אפשר לצרף תמונות בלבד." }, 400);
  }
  const total = photos.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_BYTES) return json({ ok: false, message: "הקבצים גדולים מדי. נסו תמונות קטנות יותר." }, 400);

  const attachments = await Promise.all(
    photos.map(async (file) => ({
      filename: file.name.replace(/[^\p{L}\p{N}._-]+/gu, "_").slice(0, 80) || "check",
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type,
    })),
  );

  try {
    await notifyInquiry({
      name,
      email,
      phone,
      customerType: "נכיון שיקים",
      message: notes || "בקשה לבדיקת שיקים.",
      pageUrl: `${request.headers.get("x-forwarded-proto") ?? "https"}://${request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "shilan-site.vercel.app"}/services/check-discounting`,
      attachments,
    });
  } catch (error) {
    console.error("[checks] email failed", error);
    const message = error instanceof MailError ? error.message : "לא הצלחנו לשלוח את הבקשה. נסו שוב בעוד רגע.";
    return json({ ok: false, message }, 502);
  }
  return json({ ok: true });
}
