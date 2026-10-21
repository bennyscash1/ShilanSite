import type { RatesProvider, RatesSnapshot } from "./rate";

/** Static development rates. USD matches the value shown in the Figma design. */
export const MOCK_SNAPSHOT: RatesSnapshot = {
  source: "mock",
  asOf: "2026-01-01T12:00:00.000Z",
  rates: {
    USD: { currency: "USD", ilsPerUnit: "3.0991" },
    EUR: { currency: "EUR", ilsPerUnit: "3.6142" },
    GBP: { currency: "GBP", ilsPerUnit: "4.1873" },
    CHF: { currency: "CHF", ilsPerUnit: "3.882" },
    CAD: { currency: "CAD", ilsPerUnit: "2.2541" },
    AUD: { currency: "AUD", ilsPerUnit: "2.0367" },
    JPY: { currency: "JPY", ilsPerUnit: "0.021034" },
  },
};

export class MockRatesProvider implements RatesProvider {
  readonly id = "mock" as const;

  constructor(private readonly snapshot: RatesSnapshot = MOCK_SNAPSHOT) {}

  async getSnapshot(): Promise<RatesSnapshot> {
    return this.snapshot;
  }
}
