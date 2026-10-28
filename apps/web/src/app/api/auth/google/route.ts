import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig, isGoogleConfigured } from "@/config/auth";
import { safeNext } from "@/lib/auth/session";
import { OAUTH_COOKIE } from "@/lib/auth/oauth";

/** Starts "Sign in with Google": redirects to Google's consent screen. */
export function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const next = safeNext(req.nextUrl.searchParams.get("next"));
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(new URL(`/login?error=google&next=${encodeURIComponent(next)}`, origin));
  }

  const state = randomBytes(24).toString("base64url");
  const params = new URLSearchParams({
    client_id: authConfig.googleClientId,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  const res = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  // The state cookie protects the callback against forged requests (CSRF).
  res.cookies.set(OAUTH_COOKIE, JSON.stringify({ state, next }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/google",
    maxAge: 10 * 60,
  });
  return res;
}
