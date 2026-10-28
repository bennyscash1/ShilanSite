import { NextResponse, type NextRequest } from "next/server";
import { authConfig, isGoogleConfigured } from "@/config/auth";
import { signInWithGoogleIdToken } from "@/lib/auth/identity";
import { isAuthConfigured, safeNext, startSession } from "@/lib/auth/session";
import { ensureGoogleProfile } from "@/lib/auth/users";
import { OAUTH_COOKIE } from "@/lib/auth/oauth";

/** Google redirects here after consent: code -> Google ID token -> Firebase user -> session cookie. */
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;
  let stored: { state?: string; next?: string } = {};
  try {
    stored = JSON.parse(req.cookies.get(OAUTH_COOKIE)?.value ?? "{}");
  } catch {
    // Treated as a missing state below.
  }
  const next = safeNext(stored.next);
  const fail = (reason: string) => {
    const res = NextResponse.redirect(new URL(`/login?error=${reason}&next=${encodeURIComponent(next)}`, origin));
    res.cookies.delete({ name: OAUTH_COOKIE, path: "/api/auth/google" });
    return res;
  };

  const { searchParams } = req.nextUrl;
  if (searchParams.get("error")) return fail("google-cancelled");
  const code = searchParams.get("code");
  if (!code || !stored.state || stored.state !== searchParams.get("state")) return fail("google");
  if (!isGoogleConfigured() || !isAuthConfigured()) return fail("google");

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: authConfig.googleClientId,
        client_secret: authConfig.googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });
    const tokens = (await tokenRes.json()) as { id_token?: string; error?: string };
    if (!tokenRes.ok || !tokens.id_token) throw new Error(`Google token exchange failed: ${tokens.error}`);

    const result = await signInWithGoogleIdToken(tokens.id_token, redirectUri);
    const name = await ensureGoogleProfile(
      result.localId,
      result.email,
      result.displayName || result.fullName || result.email.split("@")[0] || "",
    );
    await startSession(result.idToken, name);
  } catch (error) {
    console.error("[auth] Google sign-in failed", error);
    return fail("google");
  }

  const res = NextResponse.redirect(new URL(next, origin));
  res.cookies.delete({ name: OAUTH_COOKIE, path: "/api/auth/google" });
  return res;
}
