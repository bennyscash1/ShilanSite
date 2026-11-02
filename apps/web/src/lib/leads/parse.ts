import { z } from "zod";
import { safePageUrl } from "@/lib/mail/template";

export const audienceLabel = {
  importer: "יבואן",
  exporter: "יצואן",
  company: "חברה",
  private: "לקוח פרטי",
} as const;

export type Audience = keyof typeof audienceLabel;

const audiences = ["importer", "exporter", "company", "private"] as const;

/** Israeli landline (9 digits) or mobile (10 digits), after stripping separators and +972. */
export function normalizeIsraeliPhone(value: string): string | null {
  const compact = value.trim().replace(/[\s().-]/g, "");
  if (!/^\+?\d+$/.test(compact)) return null;
  let local = compact;
  if (local.startsWith("+972")) local = `0${local.slice(4)}`;
  else if (local.startsWith("972")) local = `0${local.slice(3)}`;
  if (!/^0\d{8,9}$/.test(local)) return null;
  return local;
}

export function signupKindLabel(next: string): string {
  if (next.startsWith("/signup/private")) return "פרטי";
  if (next.startsWith("/signup/osek")) return "עסקי";
  if (next.startsWith("/signup/corporation")) return "תאגיד";
  return "הרשמה";
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "יש להזין שם מלא").max(80, "השם ארוך מדי"),
  phone: z.string().trim().min(1, "יש להזין טלפון").max(40, "מספר הטלפון ארוך מדי"),
  message: z.string().trim().min(2, "יש לכתוב איך אפשר לעזור").max(2000, "ההודעה ארוכה מדי"),
  audience: z.enum(audiences, { error: "יש לבחור סוג לקוח" }),
  consent: z.literal(true, { error: "יש לאשר את מדיניות הפרטיות" }),
  pageUrl: z.string().max(2000).optional(),
  company: z.string().optional(),
});

export type ContactData = {
  name: string;
  phone: string;
  message: string;
  audience: Audience;
  pageUrl: string;
};

export type ParsedContact =
  | { ok: true; honeypot: true }
  | { ok: true; honeypot: false; data: ContactData }
  | { ok: false; message: string };

export function parseContact(input: unknown): ParsedContact {
  if (input && typeof input === "object" && "company" in input) {
    const company = (input as { company?: unknown }).company;
    if (typeof company === "string" && company.trim()) return { ok: true, honeypot: true };
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "הטופס לא תקין." };
  }
  const phone = normalizeIsraeliPhone(parsed.data.phone);
  if (!phone) return { ok: false, message: "מספר טלפון לא תקין" };
  return {
    ok: true,
    honeypot: false,
    data: {
      name: parsed.data.name,
      phone,
      message: parsed.data.message,
      audience: parsed.data.audience,
      pageUrl: safePageUrl(parsed.data.pageUrl),
    },
  };
}
