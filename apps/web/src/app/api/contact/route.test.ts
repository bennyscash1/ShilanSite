import { beforeEach, describe, expect, it, vi } from "vitest";

const resendSend = vi.hoisted(() => vi.fn());
const smtpSend = vi.hoisted(() => vi.fn());
const createTransport = vi.hoisted(() => vi.fn(() => ({ sendMail: smtpSend })));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: resendSend };
  },
}));

vi.mock("nodemailer", () => ({
  default: { createTransport },
  createTransport,
}));

import { POST } from "./route";

const payload = {
  name: "בדיקה - בני שור",
  phone: "0500000000",
  message: "בדיקת טופס",
  audience: "private",
  consent: true,
  pageUrl: "https://shilan-site.vercel.app/",
};

function request(body: unknown) {
  return new Request("https://shilan-site.vercel.app/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    resendSend.mockReset();
    smtpSend.mockReset();
    createTransport.mockClear();
    delete process.env.GMAIL_USER;
    delete process.env.GMAIL_APP_PASSWORD;
    process.env.RESEND_API_KEY = "re_test";
    process.env.MAIL_FROM = "Shilan <noreply@shilan.co.il>";
    process.env.CONTACT_TO_EMAIL = "nissimlevy10@gmail.com";
  });

  it("emails the office and does not pretend success when Resend rejects the message", async () => {
    resendSend.mockResolvedValueOnce({ data: { id: "email_1" }, error: null, headers: {} });
    const ok = await POST(request(payload));
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({ ok: true });
    expect(resendSend).toHaveBeenCalledOnce();
    expect(smtpSend).not.toHaveBeenCalled();
    const message = resendSend.mock.calls[0]?.[0];
    expect(message.to).toEqual(["nissimlevy10@gmail.com"]);
    expect(message.subject).toBe("פנייה חדשה מהאתר – בדיקה - בני שור (לקוח פרטי)");
    expect(message.replyTo).toBeUndefined();
    expect(message.html).toContain("0500000000");
    expect(message.html).toContain("לקוח פרטי");
    expect(message.html).not.toContain("<script>");

    resendSend.mockResolvedValueOnce({
      data: null,
      error: { message: "The domain is not verified", name: "validation_error", statusCode: 403 },
      headers: {},
    });
    const failed = await POST(request(payload));
    expect(failed.status).toBe(502);
    expect(await failed.json()).toEqual({
      ok: false,
      message: "לא הצלחנו לשלוח את המייל. נסו שוב בעוד רגע.",
    });
  });

  it("returns an error when neither Gmail nor Resend is configured", async () => {
    delete process.env.RESEND_API_KEY;
    const response = await POST(request(payload));
    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ ok: false });
    expect(resendSend).not.toHaveBeenCalled();
    expect(smtpSend).not.toHaveBeenCalled();
  });

  it("sends through Gmail SMTP when the app password is set", async () => {
    process.env.GMAIL_USER = "site@gmail.com";
    process.env.GMAIL_APP_PASSWORD = "abcd efgh ijkl mnop";
    smtpSend.mockResolvedValueOnce({ messageId: "1" });
    const ok = await POST(request(payload));
    expect(ok.status).toBe(200);
    expect(resendSend).not.toHaveBeenCalled();
    expect(createTransport).toHaveBeenCalledWith({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: "site@gmail.com", pass: "abcdefghijklmnop" },
    });
    expect(smtpSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: '"אתר שילן" <site@gmail.com>',
        to: ["nissimlevy10@gmail.com"],
        subject: "פנייה חדשה מהאתר – בדיקה - בני שור (לקוח פרטי)",
      }),
    );
    expect(smtpSend.mock.calls[0]?.[0].replyTo).toBeUndefined();
  });
});
