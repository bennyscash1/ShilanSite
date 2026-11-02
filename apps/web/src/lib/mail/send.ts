import { Resend } from "resend";
import { mailFrom } from "./config";

export class MailError extends Error {
  constructor(message = "לא הצלחנו לשלוח את המייל. נסו שוב בעוד רגע.") {
    super(message);
    this.name = "MailError";
  }
}

export async function sendMail(input: {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("[mail] RESEND_API_KEY is not configured");
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
    console.error("[mail] Resend request failed", error);
    throw new MailError();
  }
}
