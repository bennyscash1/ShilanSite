import { describe, expect, it } from "vitest";
import { MOCK_SNAPSHOT } from "@shilan/core";
import { isCronAuthorized, withMockFallback } from "./rates-utils";

describe("isCronAuthorized", () => {
  it("allows any request when CRON_SECRET is unset", () => {
    const previous = process.env.CRON_SECRET;
    delete process.env.CRON_SECRET;
    try {
      expect(isCronAuthorized(new Request("https://shilan.co.il/api/cron/rates"))).toBe(true);
    } finally {
      if (previous === undefined) delete process.env.CRON_SECRET;
      else process.env.CRON_SECRET = previous;
    }
  });

  it("requires the bearer token when CRON_SECRET is set", () => {
    const previous = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "test-secret";
    try {
      expect(isCronAuthorized(new Request("https://shilan.co.il/api/cron/rates"))).toBe(false);
      const allowed = new Request("https://shilan.co.il/api/cron/rates", {
        headers: { authorization: "Bearer test-secret" },
      });
      expect(isCronAuthorized(allowed)).toBe(true);
    } finally {
      if (previous === undefined) delete process.env.CRON_SECRET;
      else process.env.CRON_SECRET = previous;
    }
  });
});

describe("withMockFallback", () => {
  it("fills missing currencies from the static snapshot", () => {
    const mixed = withMockFallback({
      source: "bank-of-israel",
      asOf: "2026-11-10T04:00:00.000Z",
      rates: { USD: { currency: "USD", ilsPerUnit: "3.16100000" } },
    });
    expect(mixed.rates.USD?.ilsPerUnit).toBe("3.16100000");
    expect(mixed.rates.EUR?.ilsPerUnit).toBe(MOCK_SNAPSHOT.rates.EUR?.ilsPerUnit);
  });
});
