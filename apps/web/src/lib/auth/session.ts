// Server-only: customer session (Firebase session cookie, verified with the Admin SDK).
import { adminAuth, adminDb, isFirebaseAdminConfigured } from "@shilan/firebase/admin";
import { COLLECTIONS, type UserProfile } from "@shilan/firebase/collections";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { authConfig } from "@/config/auth";

export type CurrentUser = { uid: string; email: string; displayName: string; username: string | null };

const maxAgeSeconds = authConfig.sessionDays * 24 * 60 * 60;

export function isAuthConfigured(): boolean {
  return isFirebaseAdminConfigured() && Boolean(authConfig.firebaseApiKey);
}

/** Turns a fresh Firebase ID token into the long-lived httpOnly session cookie. */
export async function startSession(idToken: string, displayName: string): Promise<void> {
  const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn: maxAgeSeconds * 1000 });
  const store = await cookies();
  const base = { secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: maxAgeSeconds };
  store.set(authConfig.sessionCookie, sessionCookie, { ...base, httpOnly: true });
  // UI hint only (shows "האזור האישי" on static pages); never trusted for access control.
  store.set(authConfig.displayCookie, encodeURIComponent(displayName || "לקוח"), { ...base, httpOnly: false });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(authConfig.sessionCookie)?.value;
  store.delete(authConfig.sessionCookie);
  store.delete(authConfig.displayCookie);
  if (token && isAuthConfigured()) {
    // Sign out everywhere this session was copied to.
    const decoded = await adminAuth().verifySessionCookie(token).catch(() => null);
    if (decoded) await adminAuth().revokeRefreshTokens(decoded.uid).catch(() => {});
  }
}

/** The signed-in customer, or null. Memoized per request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (!isAuthConfigured()) return null;
  const token = (await cookies()).get(authConfig.sessionCookie)?.value;
  if (!token) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(token, true);
    const snap = await adminDb().collection(COLLECTIONS.users).doc(decoded.uid).get();
    const profile = snap.data() as UserProfile | undefined;
    return {
      uid: decoded.uid,
      email: decoded.email ?? profile?.email ?? "",
      displayName: profile?.displayName ?? (decoded.name as string | undefined) ?? "",
      username: profile?.username ?? null,
    };
  } catch {
    return null;
  }
});

/** Only allows site-relative redirect targets (blocks //evil.com and absolute URLs). */
export function safeNext(next: string | null | undefined, fallback = "/account"): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}

/** Use at the top of every customer-only page. Sends signed-out visitors to login and back. */
export async function requireUser(returnTo: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  return user;
}
