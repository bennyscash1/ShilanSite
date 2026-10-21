import type { CurrencyCode } from "./currency";

/** Where a rate came from. Admin overrides (phase 2) are layered on top of a source. */
export type RateSource = "mock" | "bank-of-israel" | "admin-override";

/**
 * The value of one unit of `currency` in ILS, as a decimal string (e.g. USD "3.0991").
 * Strings keep the provider's exact value; math happens on scaled bigints.
 */
export interface IlsRate {
  currency: CurrencyCode;
  ilsPerUnit: string;
  /** Optional spread in basis points applied by the business (admin, phase 2). */
  spreadBps?: number;
}

export interface RatesSnapshot {
  source: RateSource;
  /** ISO-8601 timestamp of the rates' effective time. */
  asOf: string;
  rates: Partial<Record<CurrencyCode, IlsRate>>;
}

export interface RatesProvider {
  readonly id: RateSource;
  getSnapshot(): Promise<RatesSnapshot>;
}
