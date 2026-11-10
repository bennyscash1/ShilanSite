import { CURRENCY_CODES, type CurrencyCode } from "./currency";
import { divRound, parseScaled, RATE_DECIMALS, toDecimalString } from "./decimal";
import type { IlsRate, RatesProvider, RatesSnapshot } from "./rate";

/** Official Bank of Israel representative exchange rates. No API key. */
export const BOI_EXCHANGE_RATES_URL = "https://www.boi.org.il/PublicApi/GetExchangeRates";

const FX_CODES = CURRENCY_CODES.filter(
  (code): code is Exclude<CurrencyCode, "ILS"> => code !== "ILS",
);

type BoiRate = {
  key: string;
  currentExchangeRate: number;
  unit: number;
};

function isBoiRate(value: unknown): value is BoiRate {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.key === "string" &&
    typeof row.currentExchangeRate === "number" &&
    Number.isFinite(row.currentExchangeRate) &&
    typeof row.unit === "number" &&
    Number.isFinite(row.unit) &&
    row.unit > 0
  );
}

/**
 * Bank of Israel quotes ILS per `unit` of the currency (JPY is per 100).
 * Returns a plain decimal string, or null if the quote cannot be used.
 */
export function ilsPerUnitFromBoi(rate: number, unit: number): string | null {
  if (!Number.isFinite(rate) || rate <= 0 || !Number.isFinite(unit) || unit <= 0) return null;
  const scaled = parseScaled(String(rate), RATE_DECIMALS);
  if (scaled === null) return null;
  return toDecimalString(divRound(scaled, BigInt(Math.round(unit))), RATE_DECIMALS);
}

export function parseBoiExchangeRates(payload: unknown, fetchedAt: string): RatesSnapshot {
  const rows = (payload as { exchangeRates?: unknown })?.exchangeRates;
  if (!Array.isArray(rows)) {
    throw new Error("Bank of Israel response is missing exchangeRates.");
  }

  const rates: Partial<Record<CurrencyCode, IlsRate>> = {};
  for (const row of rows) {
    if (!isBoiRate(row)) continue;
    if (!FX_CODES.includes(row.key as (typeof FX_CODES)[number])) continue;
    const ilsPerUnit = ilsPerUnitFromBoi(row.currentExchangeRate, row.unit);
    if (!ilsPerUnit) continue;
    const currency = row.key as CurrencyCode;
    rates[currency] = { currency, ilsPerUnit };
  }

  const missing = FX_CODES.filter((code) => rates[code] === undefined);
  if (missing.length > 0) {
    throw new Error(`Bank of Israel response is missing currencies: ${missing.join(", ")}.`);
  }

  return { source: "bank-of-israel", asOf: fetchedAt, rates };
}

export class BankOfIsraelRatesProvider implements RatesProvider {
  readonly id = "bank-of-israel" as const;

  constructor(
    private readonly url: string = BOI_EXCHANGE_RATES_URL,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async getSnapshot(): Promise<RatesSnapshot> {
    const fetchedAt = new Date().toISOString();
    const response = await this.fetchImpl(this.url, {
      headers: { accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      throw new Error(`Bank of Israel HTTP ${response.status}`);
    }
    return parseBoiExchangeRates(await response.json(), fetchedAt);
  }
}
