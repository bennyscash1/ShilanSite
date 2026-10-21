import { getCurrency, type CurrencyCode } from "./currency";
import { parseScaled, toDecimalString } from "./decimal";

export interface Money {
  currency: CurrencyCode;
  /** Integer amount in minor units (e.g. agorot, cents). */
  minor: bigint;
}

/**
 * Parses user input ("1,234.5", "1234") into minor units.
 * Returns null for empty or invalid input. Extra fraction digits are rounded.
 */
export function parseAmount(input: string, currency: CurrencyCode): bigint | null {
  // \s also covers the non-breaking space that Intl inserts in some locales.
  const cleaned = input.replace(/[,\s]/g, "");
  if (cleaned === "" || cleaned === ".") return null;
  const normalized = cleaned.startsWith(".") ? `0${cleaned}` : cleaned.replace(/\.$/, "");
  return parseScaled(normalized, getCurrency(currency).minorUnits);
}

/** Plain decimal string ("1234.50") for a minor-unit amount. */
export function toAmountString(minor: bigint, currency: CurrencyCode): string {
  return toDecimalString(minor, getCurrency(currency).minorUnits);
}

const formatters = new Map<string, Intl.NumberFormat>();

/**
 * Locale-formatted amount ("1,234.5"). Uses Intl's exact decimal-string input,
 * so no float conversion happens. Trailing fraction zeros are trimmed unless `fixed`.
 */
export function formatAmount(
  minor: bigint,
  currency: CurrencyCode,
  { fixed = false }: { fixed?: boolean } = {},
): string {
  const digits = getCurrency(currency).minorUnits;
  const key = `${digits}:${fixed}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: fixed ? digits : 0,
      maximumFractionDigits: digits,
    });
    formatters.set(key, formatter);
  }
  // Intl formats decimal strings exactly at runtime; the lib typings only declare number | bigint.
  return formatter.format(toDecimalString(minor, digits) as unknown as number);
}
