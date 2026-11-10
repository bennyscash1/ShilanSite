import { describe, expect, it } from "vitest";
import { ilsPerUnitFromBoi, parseBoiExchangeRates } from "./bank-of-israel-rates";

const sample = {
  exchangeRates: [
    { key: "USD", currentExchangeRate: 3.161, unit: 1, lastUpdate: "2026-11-10T13:20:05.7356861Z" },
    { key: "EUR", currentExchangeRate: 3.5464, unit: 1 },
    { key: "GBP", currentExchangeRate: 4.2441, unit: 1 },
    { key: "CHF", currentExchangeRate: 3.8512, unit: 1 },
    { key: "CAD", currentExchangeRate: 2.2376, unit: 1 },
    { key: "AUD", currentExchangeRate: 2.185, unit: 1 },
    { key: "JPY", currentExchangeRate: 1.9984, unit: 100 },
    { key: "DKK", currentExchangeRate: 0.4744, unit: 1 },
  ],
};

describe("ilsPerUnitFromBoi", () => {
  it("keeps quotes already expressed per one unit", () => {
    expect(ilsPerUnitFromBoi(3.161, 1)).toBe("3.16100000");
  });

  it("divides quotes that Bank of Israel publishes per 100 units (JPY)", () => {
    expect(ilsPerUnitFromBoi(1.9984, 100)).toBe("0.01998400");
  });

  it("rejects non-positive values", () => {
    expect(ilsPerUnitFromBoi(0, 1)).toBeNull();
    expect(ilsPerUnitFromBoi(3, 0)).toBeNull();
  });
});

describe("parseBoiExchangeRates", () => {
  it("maps every widget currency and records the fetch time", () => {
    const snapshot = parseBoiExchangeRates(sample, "2026-11-10T04:00:00.000Z");
    expect(snapshot.source).toBe("bank-of-israel");
    expect(snapshot.asOf).toBe("2026-11-10T04:00:00.000Z");
    expect(snapshot.rates.USD?.ilsPerUnit).toBe("3.16100000");
    expect(snapshot.rates.JPY?.ilsPerUnit).toBe("0.01998400");
    expect(Object.keys(snapshot.rates).sort()).toEqual([
      "AUD",
      "CAD",
      "CHF",
      "EUR",
      "GBP",
      "JPY",
      "USD",
    ]);
  });

  it("throws when a widget currency is missing", () => {
    const { exchangeRates } = sample;
    expect(() =>
      parseBoiExchangeRates(
        { exchangeRates: exchangeRates.filter((row) => row.key !== "USD") },
        "2026-11-10T04:00:00.000Z",
      ),
    ).toThrow(/USD/);
  });
});
