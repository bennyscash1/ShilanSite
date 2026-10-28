/**
 * Admin panel configuration (single site-owner account).
 *
 * The credentials are read from environment variables instead of being written here, because
 * this repository is public: a password committed to it would let anyone publish to the site.
 *   - Local development: apps/web/.env.local (git-ignored)
 *   - Production: Vercel > Project > Settings > Environment Variables
 */
export const adminConfig = {
  /** Login email (case-insensitive). */
  email: process.env.ADMIN_EMAIL ?? "",
  password: process.env.ADMIN_PASSWORD ?? "",
  /**
   * Signs the session cookie. Optional: when unset, a key is derived from the password,
   * so changing the password also signs everyone out.
   */
  sessionSecret: process.env.ADMIN_SESSION_SECRET ?? "",
  sessionCookie: "shilan_admin",
  sessionMaxAgeSeconds: 60 * 60 * 12,
  /** Failed logins allowed per IP before a 15-minute lockout. */
  maxFailedLogins: 5,
} as const;

export function isAdminConfigured(): boolean {
  return adminConfig.email.length > 0 && adminConfig.password.length > 0;
}
