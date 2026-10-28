// Server-only: Firebase Identity Toolkit REST API (password sign-in, Google sign-in, password reset).
// Using REST from the server keeps the Firebase client SDK out of the browser bundle.
import { authConfig } from "@/config/auth";

function baseUrl(): string {
  const emulator = process.env.FIREBASE_AUTH_EMULATOR_HOST;
  return emulator
    ? `http://${emulator}/identitytoolkit.googleapis.com/v1`
    : "https://identitytoolkit.googleapis.com/v1";
}

/** A Firebase error code such as INVALID_LOGIN_CREDENTIALS or TOO_MANY_ATTEMPTS_TRY_LATER. */
export class IdentityError extends Error {
  constructor(public readonly code: string) {
    super(code);
  }
}

async function call<T>(method: string, body: Record<string, unknown>): Promise<T> {
  if (!authConfig.firebaseApiKey) throw new IdentityError("CONFIGURATION_NOT_FOUND");
  const res = await fetch(`${baseUrl()}/${method}?key=${encodeURIComponent(authConfig.firebaseApiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as { error?: { message?: string } } & T;
  if (!res.ok) {
    // Messages look like "TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account..." -> keep the code.
    throw new IdentityError((json.error?.message ?? `HTTP_${res.status}`).split(" ")[0] ?? "UNKNOWN");
  }
  return json;
}

type SignInResult = { idToken: string; localId: string; email: string; displayName?: string };

export function signInWithPassword(email: string, password: string): Promise<SignInResult> {
  return call<SignInResult>("accounts:signInWithPassword", { email, password, returnSecureToken: true });
}

type IdpResult = SignInResult & { isNewUser?: boolean; fullName?: string };

/** Exchanges a Google ID token (from our own OAuth flow) for a Firebase session. */
export function signInWithGoogleIdToken(googleIdToken: string, requestUri: string): Promise<IdpResult> {
  return call<IdpResult>("accounts:signInWithIdp", {
    postBody: `id_token=${encodeURIComponent(googleIdToken)}&providerId=google.com`,
    requestUri,
    returnSecureToken: true,
    returnIdpCredential: true,
  });
}

/** Checks a password-reset code; returns the account email. */
export async function verifyResetCode(oobCode: string): Promise<string> {
  const { email } = await call<{ email: string }>("accounts:resetPassword", { oobCode });
  return email;
}

export async function confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
  await call("accounts:resetPassword", { oobCode, newPassword });
}
