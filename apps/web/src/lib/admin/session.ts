// Server-only: admin session cookie (HMAC-signed, httpOnly). Imported by Server Components and Actions.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { adminConfig, isAdminConfigured } from "@/config/admin";

type SessionPayload = { sub: string; exp: number };

function signingKey(): Buffer {
  const secret = adminConfig.sessionSecret || `shilan-admin:${adminConfig.email}:${adminConfig.password}`;
  return createHash("sha256").update(secret).digest();
}

function sign(data: string): string {
  return createHmac("sha256", signingKey()).update(data).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  // Hash first so inputs of different length compare in constant time too.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function credentialsMatch(email: string, password: string): boolean {
  if (!isAdminConfigured()) return false;
  const emailOk = safeEqual(email.trim().toLowerCase(), adminConfig.email.trim().toLowerCase());
  const passwordOk = safeEqual(password, adminConfig.password);
  return emailOk && passwordOk;
}

function encode(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature || !safeEqual(signature, sign(body))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch {
    return null;
  }
}

export async function createSession(): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + adminConfig.sessionMaxAgeSeconds;
  const store = await cookies();
  store.set(adminConfig.sessionCookie, encode({ sub: adminConfig.email, exp }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: adminConfig.sessionMaxAgeSeconds,
  });
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(adminConfig.sessionCookie);
}

/** Current admin session, or null. Memoized per request. */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  if (!isAdminConfigured()) return null;
  return decode((await cookies()).get(adminConfig.sessionCookie)?.value);
});

/** Use at the top of every admin page and Server Action. Redirects to the login page when signed out. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

// Best-effort brute-force protection. In-memory, so it resets per server instance
// (and on every hot reload of this module in development).
const failures = new Map<string, { count: number; until: number }>();
const LOCKOUT_MS = 15 * 60 * 1000;

export function isLockedOut(ip: string): boolean {
  const entry = failures.get(ip);
  return Boolean(entry && entry.count >= adminConfig.maxFailedLogins && entry.until > Date.now());
}

export function recordFailure(ip: string): void {
  const entry = failures.get(ip);
  const fresh = !entry || entry.until < Date.now();
  failures.set(ip, { count: fresh ? 1 : entry.count + 1, until: Date.now() + LOCKOUT_MS });
}

export function clearFailures(ip: string): void {
  failures.delete(ip);
}
