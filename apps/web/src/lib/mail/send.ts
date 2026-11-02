import nodemailer from "nodemailer";
import { Resend } from "resend";
import { mailFrom } from "./config";

export class MailError extends Error {
  constructor(message = "לא הצלחנו לשלוח את המייל. נסו שוב בעוד רגע.") {
    super(message);
    this.name = "MailError";
  }
}

export type OutboundMail = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

/** Gmail SMTP when both vars are set; otherwise Resend. One helper for every site email. */
export function gmailAuth(): { user: string; pass: string } | null {
  const user = process.env.GMAIL_USER?.trim() ?? "";
  const pass = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, "");
  const hasUser = Boolean(user);
  const hasPass = Boolean(pass);
  if (hasUser !== hasPass) {
    console.error("[mail] Gmail SMTP is only partly configured; using Resend");
    return null;
  }
  if (!hasUser || !hasPass) return null;
  if (/[\r\n<>"]/.test(user) || !user.includes("@")) {
    console.error("[mail] GMAIL_USER is not a usable address");
    throw new MailError();
  }
  return { user, pass };
}

export function gmailFrom(user: string): string {
  return `"אתר שילן" <${user}>`;
}

function logFailure(scope: string, error: unknown) {
  const err = error as { code?: string; responseCode?: number; message?: string };
  console.error(scope, {
    code: err?.code,
    responseCode: err?.responseCode,
    message: err?.message ?? (error instanceof Error ? error.message : "unknown"),
  });
}

async function sendViaGmail(auth: { user: string; pass: string }, input: OutboundMail): Promise<void> {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth,
  });
  try {
    await transport.sendMail({
      from: gmailFrom(auth.user),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    });
  } catch (error) {
    logFailure("[mail] Gmail SMTP failed", error);
    throw new MailError();
  }
}

async function sendViaResend(input: OutboundMail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("[mail] Neither Gmail SMTP nor RESEND_API_KEY is configured");
    throw new MailError("שליחת המייל עדיין לא זמינה.");
  }

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: mailFrom(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    });
    if (error) {
      console.error("[mail] Resend error", {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
      });
      throw new MailError();
    }
  } catch (error) {
    if (error instanceof MailError) throw error;
    logFailure("[mail] Resend request failed", error);
    throw new MailError();
  }
}

export async function sendMail(input: OutboundMail): Promise<void> {
  const gmail = gmailAuth();
  if (gmail) {
    await sendViaGmail(gmail, input);
    return;
  }
  await sendViaResend(input);
}
