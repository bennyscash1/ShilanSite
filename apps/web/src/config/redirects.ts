/**
 * 301 redirects from the old WordPress site (shilan.co.il) to the new routes.
 * Fill in `from` with the old WordPress path (no domain). `:slug*` style params are supported.
 * Example: { from: "/services/currency-exchange/", to: "/services/fx-exchange" }
 */
export type LegacyRedirect = { from: string; to: string };

export const legacyRedirects: LegacyRedirect[] = [
  // WordPress paths. Next matches the percent-encoded request path, and strips
  // a trailing slash before these rules run.
  { from: "/%D7%94%D7%A7%D7%9E%D7%AA-%D7%9C%D7%A7%D7%95%D7%97", to: "/signup" },
  { from: "/%D7%9C%D7%A7%D7%95%D7%97-%D7%A4%D7%A8%D7%98%D7%99", to: "/signup/private" },
  {
    from: "/%D7%9C%D7%A7%D7%95%D7%97-%D7%A2%D7%A1%D7%A7%D7%99-%D7%A2%D7%95%D7%A1%D7%A7-%D7%9E%D7%95%D7%A8%D7%A9%D7%94",
    to: "/signup/osek",
  },
  {
    from: "/%D7%9C%D7%A7%D7%95%D7%97-%D7%A2%D7%99%D7%A1%D7%A7%D7%99-%D7%AA%D7%90%D7%92%D7%99%D7%93",
    to: "/signup/corporation",
  },
  { from: "/%D7%90%D7%95%D7%93%D7%95%D7%AA%D7%99%D7%A0%D7%95", to: "/about" },
  { from: "/%D7%9E%D7%93%D7%99%D7%A0%D7%99%D7%95%D7%AA-%D7%A4%D7%A8%D7%98%D7%99%D7%95%D7%AA", to: "/privacy" },
  { from: "/%D7%94%D7%A6%D7%94%D7%A8%D7%AA-%D7%A0%D7%92%D7%99%D7%A9%D7%95%D7%AA", to: "/accessibility" },
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
