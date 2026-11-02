/** Server-only mail settings. Defaults keep production working before the env vars are saved. */

export const DEFAULT_MAIL_FROM = "Shilan <noreply@shilan.co.il>";
export const DEFAULT_CONTACT_TO = "nissimlevy10@gmail.com";

export function mailFrom(): string {
  return process.env.MAIL_FROM?.trim() || process.env.EMAIL_FROM?.trim() || DEFAULT_MAIL_FROM;
}

export function contactRecipients(): string[] {
  const raw = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_CONTACT_TO;
  const list = raw
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length > 0 ? list : [DEFAULT_CONTACT_TO];
}
