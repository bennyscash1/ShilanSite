// Server-only: transactional email through the Resend HTTP API (no SDK dependency).
import { authConfig, isEmailConfigured } from "@/config/auth";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

function resetEmailHtml(name: string, link: string): string {
  return `<!doctype html><html lang="he" dir="rtl"><body style="margin:0;background:#fff8e9;font-family:Arial,sans-serif;color:#084616">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e6dcc3" cellpadding="0" cellspacing="0">
<tr><td style="background:#084616;color:#ffffff;padding:20px 28px;border-radius:16px 16px 0 0;font-size:20px;font-weight:bold;text-align:right">שילן שירותי המרה</td></tr>
<tr><td style="padding:28px;text-align:right;font-size:16px;line-height:1.6">
<p style="margin:0 0 12px">שלום ${escapeHtml(name)},</p>
<p style="margin:0 0 20px">קיבלנו בקשה לאיפוס הסיסמה לחשבון שלך באתר שילן. לחצו על הכפתור כדי לבחור סיסמה חדשה:</p>
<p style="margin:0 0 24px;text-align:center"><a href="${link}" style="display:inline-block;background:#a17510;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:bold">איפוס סיסמה</a></p>
<p style="margin:0 0 8px;font-size:14px;color:#4d5156">הקישור תקף לשעה אחת. אם לא ביקשתם לאפס את הסיסמה, אפשר להתעלם מהודעה זו.</p>
</td></tr></table></td></tr></table></body></html>`;
}

/** Sends the reset email. Without RESEND_API_KEY in development, the link is printed to the server log. */
export async function sendPasswordResetEmail(to: string, name: string, link: string): Promise<void> {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[auth] RESEND_API_KEY not set. Password reset link for ${to}: ${link}`);
      return;
    }
    throw new Error("RESEND_API_KEY is not configured");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${authConfig.resendApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: authConfig.emailFrom,
      to: [to],
      subject: "איפוס סיסמה | שילן שירותי המרה",
      html: resetEmailHtml(name, link),
      text: `שלום ${name},\n\nלאיפוס הסיסמה באתר שילן היכנסו לקישור:\n${link}\n\nהקישור תקף לשעה אחת. אם לא ביקשתם לאפס את הסיסמה, אפשר להתעלם מהודעה זו.`,
    }),
  });
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text().catch(() => "")}`);
}
