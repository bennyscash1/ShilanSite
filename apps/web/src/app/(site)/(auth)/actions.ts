"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authConfig } from "@/config/auth";
import { sendPasswordResetEmail } from "@/lib/auth/email";
import { IdentityError, confirmPasswordReset, signInWithPassword } from "@/lib/auth/identity";
import { endSession, isAuthConfigured, safeNext, startSession } from "@/lib/auth/session";
import {
  AccountError,
  USERNAME_RE,
  createPasswordAccount,
  createPasswordResetCode,
  normalizeUsername,
  resolveLoginEmail,
} from "@/lib/auth/users";
import { rateLimit } from "@/lib/rate-limit";

const NOT_CONFIGURED = "מערכת ההתחברות עדיין לא הוגדרה. נסו שוב מאוחר יותר.";
const GENERIC = "משהו השתבש. נסו שוב בעוד רגע.";

async function requestInfo() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return { ip, origin: `${proto}://${host}` };
}

function identityMessage(error: unknown): string {
  const code = error instanceof IdentityError ? error.code : "";
  switch (code) {
    case "INVALID_LOGIN_CREDENTIALS":
    case "INVALID_PASSWORD":
    case "EMAIL_NOT_FOUND":
      return "שם המשתמש או הסיסמה שגויים.";
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      return "יותר מדי ניסיונות כושלים. נסו שוב בעוד כמה דקות.";
    case "USER_DISABLED":
      return "החשבון הושבת. לבירור צרו קשר עם שילן.";
    case "EXPIRED_OOB_CODE":
    case "INVALID_OOB_CODE":
      return "הקישור לאיפוס הסיסמה פג תוקף או כבר נוצל. בקשו קישור חדש.";
    case "WEAK_PASSWORD":
      return "הסיסמה חלשה מדי.";
    default:
      console.error("[auth]", error);
      return GENERIC;
  }
}

/* ---------------- Login ---------------- */

export type LoginState = { error?: string; identifier?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));
  if (!isAuthConfigured()) return { error: NOT_CONFIGURED, identifier };
  if (!identifier || !password) return { error: "יש למלא שם משתמש וסיסמה.", identifier };

  const { ip } = await requestInfo();
  if (!rateLimit(`login:${ip}`, 10, 10 * 60 * 1000)) {
    return { error: "יותר מדי ניסיונות. נסו שוב בעוד כמה דקות.", identifier };
  }

  try {
    const email = await resolveLoginEmail(identifier);
    if (!email) throw new IdentityError("INVALID_LOGIN_CREDENTIALS");
    const result = await signInWithPassword(email, password);
    await startSession(result.idToken, result.displayName ?? "");
  } catch (error) {
    return { error: identityMessage(error), identifier };
  }
  redirect(next);
}

/* ---------------- Register ---------------- */

const registerSchema = z
  .object({
    displayName: z.string().trim().min(2, "יש להזין שם מלא").max(80, "השם ארוך מדי"),
    username: z
      .string()
      .transform(normalizeUsername)
      .refine((v) => USERNAME_RE.test(v), "3–30 תווים: אותיות, ספרות, נקודה, קו תחתון או מקף"),
    email: z.email("כתובת אימייל לא תקינה").transform((v) => v.toLowerCase()),
    password: z
      .string()
      .min(authConfig.minPasswordLength, `לפחות ${authConfig.minPasswordLength} תווים`)
      .max(128, "הסיסמה ארוכה מדי"),
    confirmPassword: z.string(),
    consent: z.literal("on", { error: "יש לאשר את מדיניות הפרטיות" }),
  });

export type RegisterState = {
  error?: string;
  errors?: Partial<Record<string, string>>;
  values?: { displayName?: string; username?: string; email?: string };
};

export async function registerAction(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { displayName: raw.displayName, username: raw.username, email: raw.email };
  const next = safeNext(raw.next);
  if (!isAuthConfigured()) return { error: NOT_CONFIGURED, values };

  const parsed = registerSchema.safeParse(raw);
  // Checked separately so it is reported together with the other field errors.
  const mismatch = raw.password !== raw.confirmPassword;
  if (!parsed.success || mismatch) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error?.issues ?? []) errors[String(issue.path[0] ?? "form")] ??= issue.message;
    if (mismatch) errors.confirmPassword ??= "הסיסמאות אינן תואמות";
    return { errors, values };
  }

  const { ip } = await requestInfo();
  if (!rateLimit(`register:${ip}`, 5, 60 * 60 * 1000)) {
    return { error: "יותר מדי הרשמות מהרשת הזו. נסו שוב מאוחר יותר.", values };
  }

  const data = parsed.data;
  try {
    await createPasswordAccount(data);
    const result = await signInWithPassword(data.email, data.password);
    await startSession(result.idToken, data.displayName);
  } catch (error) {
    if (error instanceof AccountError) {
      return error.code === "USERNAME_TAKEN"
        ? { errors: { username: "שם המשתמש תפוס. בחרו שם אחר." }, values }
        : { errors: { email: "כתובת האימייל כבר רשומה. אפשר להתחבר או לאפס סיסמה." }, values };
    }
    return { error: identityMessage(error), values };
  }
  redirect(next);
}

/* ---------------- Forgot / reset password ---------------- */

export type ForgotState = { sent?: boolean; error?: string; identifier?: string };

export async function forgotPasswordAction(_prev: ForgotState, formData: FormData): Promise<ForgotState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  if (!isAuthConfigured()) return { error: NOT_CONFIGURED, identifier };
  if (!identifier) return { error: "יש להזין שם משתמש או אימייל.", identifier };

  const { ip, origin } = await requestInfo();
  if (!rateLimit(`forgot:${ip}`, 5, 15 * 60 * 1000)) {
    return { error: "יותר מדי בקשות. נסו שוב בעוד כמה דקות.", identifier };
  }

  try {
    const email = await resolveLoginEmail(identifier);
    const reset = email ? await createPasswordResetCode(email) : null;
    if (email && reset) {
      await sendPasswordResetEmail(
        email,
        reset.displayName || "לקוח יקר",
        `${origin}/reset-password?oobCode=${encodeURIComponent(reset.code)}`,
      );
    }
  } catch (error) {
    console.error("[auth] Password reset email failed", error);
    return { error: GENERIC, identifier };
  }
  // Same answer whether or not the account exists (no account enumeration).
  return { sent: true };
}

export type ResetState = { error?: string; done?: boolean };

export async function resetPasswordAction(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const oobCode = String(formData.get("oobCode") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");
  if (password.length < authConfig.minPasswordLength) {
    return { error: `הסיסמה צריכה לכלול לפחות ${authConfig.minPasswordLength} תווים.` };
  }
  if (password !== confirm) return { error: "הסיסמאות אינן תואמות." };
  try {
    await confirmPasswordReset(oobCode, password);
  } catch (error) {
    return { error: identityMessage(error) };
  }
  return { done: true };
}

/* ---------------- Logout ---------------- */

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/");
}
