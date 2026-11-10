import { describe, expect, it } from "vitest";
import { legacyRedirects, wpPath } from "./redirects";

const knownDestinations = new Set([
  "/",
  "/#contact",
  "/about",
  "/privacy",
  "/accessibility",
  "/signup",
  "/signup/private",
  "/signup/osek",
  "/signup/corporation",
  "/services/fx-exchange",
  "/services/international-transfers",
  "/services/fx-credit",
  "/services/check-discounting",
  "/services/prepaid-card",
  "/business",
  "/blog",
]);

describe("legacy WordPress redirects", () => {
  it("maps the indexed contact URL to the homepage contact section", () => {
    expect(legacyRedirects).toContainEqual({ from: wpPath("יצירת-קשר"), to: "/#contact" });
    expect(legacyRedirects).toContainEqual({ from: wpPath("יצירת קשר"), to: "/#contact" });
  });

  it("uses unique encoded sources and known destinations", () => {
    const sources = legacyRedirects.map((rule) => rule.from);
    expect(sources).toEqual([...new Set(sources)]);
    for (const rule of legacyRedirects) {
      expect(knownDestinations.has(rule.to)).toBe(true);
      expect(rule.from.startsWith("/")).toBe(true);
      expect(rule.from.endsWith("/")).toBe(false);
    }
  });

  it("keeps specific landing-page rules ahead of the /דף-נחיתה catch-all", () => {
    const landingPrefix = wpPath("דף-נחיתה");
    const landingRules = legacyRedirects.filter((rule) =>
      rule.from.startsWith(`${landingPrefix}/`),
    );
    expect(landingRules.at(-1)).toEqual({ from: `${landingPrefix}/:slug*`, to: "/" });
    expect(landingRules.length).toBeGreaterThan(1);
  });
});
