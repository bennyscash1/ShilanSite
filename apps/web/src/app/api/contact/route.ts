import { NextResponse } from "next/server";
import { audienceLabel, parseContact } from "@/lib/leads/parse";
import { notifyInquiry } from "@/lib/mail/notify";
import { MailError } from "@/lib/mail/send";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

function json(body: { ok: boolean; message?: string }, status = 200) {
  return NextResponse.json(body, { status, headers: noStore });
}

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: "הטופס לא תקין." }, 400);
  }

  const parsed = parseContact(payload);
  if (parsed.ok && parsed.honeypot) return json({ ok: true });
  if (!parsed.ok) return json({ ok: false, message: parsed.message }, 400);

  if (!rateLimit(`contact:${clientIp(request)}`, 8, 15 * 60 * 1000)) {
    return json({ ok: false, message: "יותר מדי פניות. נסו שוב בעוד כמה דקות." }, 429);
  }

  try {
    await notifyInquiry({
      name: parsed.data.name,
      phone: parsed.data.phone,
      customerType: audienceLabel[parsed.data.audience],
      message: parsed.data.message,
      pageUrl: parsed.data.pageUrl,
    });
  } catch (error) {
    console.error("[contact] email failed", error);
    const message =
      error instanceof MailError ? error.message : "לא הצלחנו לשלוח את הפנייה. נסו שוב בעוד רגע.";
    return json({ ok: false, message }, 502);
  }

  return json({ ok: true });
}
