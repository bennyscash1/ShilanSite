/**
 * Customer accounts (Firebase Auth). All values come from environment variables
 * (apps/web/.env.local locally, Vercel > Settings > Environment Variables in production).
 */
export const authConfig = {
  /** Firebase web API key (Project settings > General). Used server-side for the Identity Toolkit REST API. */
  firebaseApiKey: process.env.FIREBASE_API_KEY ?? "",
  /** Google OAuth client (Google Cloud console > APIs & Services > Credentials). */
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  /** Resend (resend.com) for password-reset emails. */
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  emailFrom: process.env.EMAIL_FROM ?? "שילן שירותי המרה <no-reply@shilan.co.il>",

  sessionCookie: "__session",
  /** Readable (non-httpOnly) cookie with the display name, for showing "האזור האישי" in static pages. */
  displayCookie: "shilan_user",
  sessionDays: 7,
  minPasswordLength: 8,
} as const;

export const isGoogleConfigured = () => Boolean(authConfig.googleClientId && authConfig.googleClientSecret);
export const isEmailConfigured = () => Boolean(authConfig.resendApiKey);
