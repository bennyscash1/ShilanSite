import { MOCK_SNAPSHOT, type CurrencyCode, type IlsRate, type RatesSnapshot } from "@shilan/core";

export const RATES_CACHE_TAG = "exchange-rates";
export const LATEST_RATES_DOC = "latest";

export const FX_CODES = Object.keys(MOCK_SNAPSHOT.rates) as CurrencyCode[];

export function isRatesSnapshot(value: unknown): value is RatesSnapshot {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  if (typeof row.asOf !== "string" || !row.asOf || typeof row.rates !== "object" || !row.rates) {
    return false;
  }
  const rates = row.rates as Record<string, unknown>;
  return FX_CODES.some((code) => {
    const item = rates[code];
    return (
      item &&
      typeof item === "object" &&
      typeof (item as IlsRate).ilsPerUnit === "string" &&
      (item as IlsRate).ilsPerUnit.length > 0
    );
  });
}

/** Keep every widget currency available if a stored snapshot is only partial. */
export function withMockFallback(snapshot: RatesSnapshot): RatesSnapshot {
  const rates: Partial<Record<CurrencyCode, IlsRate>> = {
    ...MOCK_SNAPSHOT.rates,
    ...snapshot.rates,
  };
  return { ...snapshot, rates };
}

export function isCronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}
