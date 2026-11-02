export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char;
  });
}

/** One line, so a name cannot break the subject or inject a header. */
export function oneLine(value: string, max = 80): string {
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

export function inquirySubject(name: string, customerType: string): string {
  return `פנייה חדשה מהאתר – ${oneLine(name)} (${oneLine(customerType, 40)})`;
}

export function formatJerusalem(date: Date): string {
  return new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function safePageUrl(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 2000 || /[\r\n]/.test(trimmed)) return "";
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function replyAddress(email: string | undefined): string | undefined {
  const value = email?.trim() ?? "";
  if (!value || /[\r\n]/.test(value) || value.length > 120 || !emailPattern.test(value)) return undefined;
  return value;
}

export type MailRow = { label: string; value: string; href?: string };

export function renderStaffEmail(input: { intro: string; rows: MailRow[] }): { html: string; text: string } {
  const rows = input.rows
    .map((row) => {
      const safeHref = row.href ? safePageUrl(row.href) : "";
      const text = escapeHtml(row.value).replace(/\n/g, "<br>");
      const value = safeHref
        ? `<a href="${escapeHtml(safeHref)}" style="color:#084616">${text}</a>`
        : text;
      return `<tr><td style="padding:8px 0;font-weight:bold;vertical-align:top">${escapeHtml(row.label)}</td><td style="padding:8px 12px;vertical-align:top">${value}</td></tr>`;
    })
    .join("");

  const html = `<!doctype html><html lang="he" dir="rtl"><body style="margin:0;background:#fff8e9;font-family:Arial,Helvetica,sans-serif;color:#084616">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e6dcc3" cellpadding="0" cellspacing="0">
<tr><td style="background:#084616;color:#ffffff;padding:20px 28px;border-radius:16px 16px 0 0;font-size:20px;font-weight:bold;text-align:right">שילן שירותי המרה</td></tr>
<tr><td style="padding:28px;text-align:right;font-size:16px;line-height:1.6">
<p style="margin:0 0 16px">${escapeHtml(input.intro)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
</td></tr></table></td></tr></table></body></html>`;

  const text = [input.intro, "", ...input.rows.map((row) => `${row.label}: ${row.value}`)].join("\n");
  return { html, text };
}

export function resetEmailHtml(name: string, link: string): string {
  const href = safePageUrl(link);
  return `<!doctype html><html lang="he" dir="rtl"><body style="margin:0;background:#fff8e9;font-family:Arial,sans-serif;color:#084616">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e6dcc3" cellpadding="0" cellspacing="0">
<tr><td style="background:#084616;color:#ffffff;padding:20px 28px;border-radius:16px 16px 0 0;font-size:20px;font-weight:bold;text-align:right">שילן שירותי המרה</td></tr>
<tr><td style="padding:28px;text-align:right;font-size:16px;line-height:1.6">
<p style="margin:0 0 12px">שלום ${escapeHtml(name)},</p>
<p style="margin:0 0 20px">קיבלנו בקשה לאיפוס הסיסמה לחשבון שלך באתר שילן. לחצו על הכפתור כדי לבחור סיסמה חדשה:</p>
<p style="margin:0 0 24px;text-align:center"><a href="${escapeHtml(href)}" style="display:inline-block;background:#a17510;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:bold">איפוס סיסמה</a></p>
<p style="margin:0 0 8px;font-size:14px;color:#4d5156">הקישור תקף לשעה אחת. אם לא ביקשתם לאפס את הסיסמה, אפשר להתעלם מהודעה זו.</p>
</td></tr></table></td></tr></table></body></html>`;
}
