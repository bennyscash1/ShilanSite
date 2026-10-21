/**
 * 301 redirects from the old WordPress site (shilan.co.il) to the new routes.
 * Fill in `from` with the old WordPress path (no domain). `:slug*` style params are supported.
 * Example: { from: "/services/currency-exchange/", to: "/services/fx-exchange" }
 */
export type LegacyRedirect = { from: string; to: string };

export const legacyRedirects: LegacyRedirect[] = [
  // | Old WordPress URL                  | New URL                              |
  // |------------------------------------|--------------------------------------|
  // { from: "/TODO-old-about-page/",        to: "/about" },
  // { from: "/TODO-old-contact-page/",      to: "/contact" },
  // { from: "/TODO-old-fx-exchange/",       to: "/services/fx-exchange" },
  // { from: "/TODO-old-transfers/",         to: "/services/international-transfers" },
  // { from: "/TODO-old-fx-credit/",         to: "/services/fx-credit" },
  // { from: "/TODO-old-prepaid-card/",      to: "/services/prepaid-card" },
  // { from: "/TODO-old-check-discounting/", to: "/services/check-discounting" },
  // { from: "/TODO-old-privacy/",           to: "/privacy" },
  // { from: "/TODO-old-accessibility/",     to: "/accessibility" },
];
