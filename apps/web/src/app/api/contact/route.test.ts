import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.hoisted(() => vi.fn());

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
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
    send.mockReset();
    process.env.RESEND_API_KEY = "re_test";
    process.env.MAIL_FROM = "Shilan <noreply@shilan.co.il>";
    process.env.CONTACT_TO_EMAIL = "nissimlevy10@gmail.com";
  });

  it("emails the office and does not pretend success when Resend rejects the message", async () => {
    send.mockResolvedValueOnce({ data: { id: "email_1" }, error: null, headers: {} });
    const ok = await POST(request(payload));
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({ ok: true });
    expect(send).toHaveBeenCalledOnce();
    const message = send.mock.calls[0]?.[0];
    expect(message.to).toEqual(["nissimlevy10@gmail.com"]);
    expect(message.subject).toBe("פנייה חדשה מהאתר – בדיקה - בני שור (לקוח פרטי)");
    expect(message.replyTo).toBeUndefined();
    expect(message.html).toContain("0500000000");
    expect(message.html).toContain("לקוח פרטי");
    expect(message.html).not.toContain("<script>");

    send.mockResolvedValueOnce({
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

  it("returns an error when the API key is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const response = await POST(request(payload));
    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ ok: false });
    expect(send).not.toHaveBeenCalled();
  });
});
