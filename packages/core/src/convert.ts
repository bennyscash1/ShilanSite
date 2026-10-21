import { getCurrency, type CurrencyCode } from "./currency";
import { divRound, parseScaled, pow10, RATE_DECIMALS, RATE_SCALE, toDecimalString } from "./decimal";
import type { RatesSnapshot } from "./rate";

export interface ConversionResult {
  from: CurrencyCode;
  to: CurrencyCode;
  /** Input amount, minor units of `from`. */
  amountMinor: bigint;
  /** Output amount, minor units of `to`. */
  resultMinor: bigint;
  /** Units of `to` per 1 unit of `from`, scaled by 10^RATE_DECIMALS. */
  rateScaled: bigint;
  asOf: string;
}

/** ILS per 1 unit of `code`, scaled. ILS itself is always 1. */
function ilsPerUnitScaled(snapshot: RatesSnapshot, code: CurrencyCode): bigint {
  if (code === "ILS") return RATE_SCALE;
  const rate = snapshot.rates[code];
  const scaled = rate ? parseScaled(rate.ilsPerUnit, RATE_DECIMALS) : null;
  if (scaled === null || scaled <= 0n) throw new RangeError(`No rate for ${code}`);
  return scaled;
}

export function hasRate(snapshot: RatesSnapshot, code: CurrencyCode): boolean {
  return code === "ILS" || snapshot.rates[code] !== undefined;
}

/** Units of `to` per 1 unit of `from`, scaled by 10^RATE_DECIMALS. */
export function crossRate(snapshot: RatesSnapshot, from: CurrencyCode, to: CurrencyCode): bigint {
  if (from === to) return RATE_SCALE;
  return divRound(ilsPerUnitScaled(snapshot, from) * RATE_SCALE, ilsPerUnitScaled(snapshot, to));
}

export function convert(
  snapshot: RatesSnapshot,
  amountMinor: bigint,
  from: CurrencyCode,
  to: CurrencyCode,
): ConversionResult {
  const rateScaled = crossRate(snapshot, from, to);
  const fromDigits = getCurrency(from).minorUnits;
  const toDigits = getCurrency(to).minorUnits;
  const resultMinor = divRound(
    amountMinor * rateScaled * pow10(toDigits),
    pow10(fromDigits) * RATE_SCALE,
  );
  return { from, to, amountMinor, resultMinor, rateScaled, asOf: snapshot.asOf };
}

/** Human rate string with exactly `decimals` digits, e.g. "3.0991". */
export function formatRate(rateScaled: bigint, decimals = 4): string {
  const rounded = divRound(rateScaled, pow10(RATE_DECIMALS - decimals));
  return toDecimalString(rounded, decimals);
}
