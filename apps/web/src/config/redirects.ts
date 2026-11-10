/**
 * 301 redirects from the old WordPress site (shilan.co.il) to the new routes.
 * Next matches the percent-encoded request path, and strips a trailing slash
 * before these rules run, so `from` is encoded and has no trailing slash.
 */
export type LegacyRedirect = { from: string; to: string };

/** Encode a WordPress path like "יצירת-קשר" or "דף-נחיתה/המרת-מטח-2". */
export function wpPath(path: string): string {
  return `/${path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

export const legacyRedirects: LegacyRedirect[] = [
  { from: wpPath("הקמת-לקוח"), to: "/signup" },
  { from: wpPath("לקוח-פרטי"), to: "/signup/private" },
  { from: wpPath("לקוח-עסקי-עוסק-מורשה"), to: "/signup/osek" },
  { from: wpPath("לקוח-עיסקי-תאגיד"), to: "/signup/corporation" },
  { from: wpPath("אודותינו"), to: "/about" },
  { from: wpPath("מדיניות-פרטיות"), to: "/privacy" },
  { from: wpPath("הצהרת-נגישות"), to: "/accessibility" },
  // Google still indexes the old contact URL (hyphen and space variants).
  { from: wpPath("יצירת-קשר"), to: "/#contact" },
  { from: wpPath("יצירת קשר"), to: "/#contact" },
  { from: wpPath("המרת-מטח"), to: "/services/fx-exchange" },
  { from: wpPath("העברת-מטח"), to: "/services/international-transfers" },
  { from: wpPath("מכירת-מטח"), to: "/services/fx-credit" },
  { from: wpPath("ניכיון-שיקים"), to: "/services/check-discounting" },
  { from: wpPath("ניכיון-שיקים-ללקוחות-עסקיים"), to: "/services/check-discounting" },
  // No dedicated new page for the old ATM / digital-machines page.
  { from: wpPath("שילן-דיגיטל"), to: "/" },
  // Specific landing pages first; unmatched /דף-נחיתה/* go to the homepage.
  { from: wpPath("דף-נחיתה/המרת-מטח-2"), to: "/services/fx-exchange" },
  { from: wpPath("דף-נחיתה/מכירת-מטח-בכרטיס-אשראי"), to: "/services/fx-credit" },
  { from: `${wpPath("דף-נחיתה")}/:slug*`, to: "/" },
];
