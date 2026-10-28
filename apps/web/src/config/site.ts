/** Canonical site origin, used for metadata, sitemap and JSON-LD. No trailing slash. */
export const siteUrl = (process.env.SITE_URL ?? "https://shilan.co.il").replace(/\/+$/, "");

export const siteName = "שילן שירותי המרה";
