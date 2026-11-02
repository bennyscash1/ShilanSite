import { describe, expect, it } from "vitest";
import { parseContact, signupKindLabel } from "../leads/parse";
import { DEFAULT_CONTACT_TO, DEFAULT_MAIL_FROM, contactRecipients, mailFrom } from "./config";
import { escapeHtml, formatJerusalem, inquirySubject, renderStaffEmail, safePageUrl } from "./template";

describe("staff email", () => {
  it("escapes user text and keeps the Hebrew subject", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
    expect(inquirySubject("בדיקה - בני שור\nBcc: a@b.c", "לקוח פרטי")).toBe(
      "פנייה חדשה מהאתר – בדיקה - בני שור Bcc: a@b.c (לקוח פרטי)",
    );
    const { html, text } = renderStaffEmail({
      intro: "התקבלה פנייה חדשה מהאתר.",
      rows: [{ label: "שם", value: "<בני>" }, { label: "עמוד", value: "https://shilan.co.il/", href: "https://shilan.co.il/" }],
    });
    expect(html).toContain('lang="he" dir="rtl"');
    expect(html).toContain("&lt;בני&gt;");
    expect(html).not.toContain("<בני>");
    expect(html).toContain('href="https://shilan.co.il/"');
    expect(text).toContain("שם: <בני>");
  });

  it("drops unsafe page links and formats Jerusalem time", () => {
    expect(safePageUrl("javascript:alert(1)")).toBe("");
    expect(safePageUrl("https://shilan-site.vercel.app/#contact")).toBe(
      "https://shilan-site.vercel.app/#contact",
    );
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jerusalem",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(new Date("2026-01-15T10:00:00.000Z"));
    expect(parts).toBe("12:00");
    expect(formatJerusalem(new Date("2026-01-15T10:00:00.000Z"))).toMatch(/2026/);
  });

  it("uses the office defaults unless env overrides them", () => {
    const previousFrom = process.env.MAIL_FROM;
    const previousLegacy = process.env.EMAIL_FROM;
    const previousTo = process.env.CONTACT_TO_EMAIL;
    delete process.env.MAIL_FROM;
    delete process.env.EMAIL_FROM;
    delete process.env.CONTACT_TO_EMAIL;
    expect(mailFrom()).toBe(DEFAULT_MAIL_FROM);
    expect(contactRecipients()).toEqual([DEFAULT_CONTACT_TO]);
    process.env.EMAIL_FROM = "Legacy <legacy@shilan.co.il>";
    expect(mailFrom()).toBe("Legacy <legacy@shilan.co.il>");
    process.env.MAIL_FROM = "Shilan <noreply@shilan.co.il>";
    process.env.CONTACT_TO_EMAIL = "a@shilan.co.il, b@shilan.co.il";
    expect(mailFrom()).toBe("Shilan <noreply@shilan.co.il>");
    expect(contactRecipients()).toEqual(["a@shilan.co.il", "b@shilan.co.il"]);
    if (previousFrom === undefined) delete process.env.MAIL_FROM;
    else process.env.MAIL_FROM = previousFrom;
    if (previousLegacy === undefined) delete process.env.EMAIL_FROM;
    else process.env.EMAIL_FROM = previousLegacy;
    if (previousTo === undefined) delete process.env.CONTACT_TO_EMAIL;
    else process.env.CONTACT_TO_EMAIL = previousTo;
  });
});

describe("contact form payload", () => {
  it("accepts the homepage fields and normalizes the phone", () => {
    const parsed = parseContact({
      name: "בדיקה - בני שור",
      phone: "050-000-0000",
      message: "בדיקה",
      audience: "private",
      consent: true,
      pageUrl: "https://shilan-site.vercel.app/",
      company: "",
    });
    expect(parsed).toMatchObject({
      ok: true,
      honeypot: false,
      data: {
        name: "בדיקה - בני שור",
        phone: "0500000000",
        audience: "private",
        pageUrl: "https://shilan-site.vercel.app/",
      },
    });
  });

  it("rejects a missing audience and a filled honeypot", () => {
    expect(parseContact({ name: "בני שור", phone: "0500000000", message: "היי", consent: true }).ok).toBe(
      false,
    );
    expect(parseContact({ company: "spam", name: "x" })).toEqual({ ok: true, honeypot: true });
    expect(signupKindLabel("/signup/osek")).toBe("עסקי");
    expect(signupKindLabel("/account")).toBe("הרשמה");
  });
});
