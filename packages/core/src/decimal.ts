/**
 * Exact fixed-point helpers on bigint. Money never touches floating point:
 * amounts are integer minor units, rates are integers scaled by 10^RATE_DECIMALS.
 */

export const RATE_DECIMALS = 8;
export const RATE_SCALE = 10n ** BigInt(RATE_DECIMALS);

const DECIMAL_RE = /^(-)?(\d+)(?:\.(\d+))?$/;

/** Parses a plain decimal string ("3.0991") into an integer scaled by 10^decimals. Rounds half away from zero. */
export function parseScaled(value: string, decimals: number): bigint | null {
  const match = DECIMAL_RE.exec(value.trim());
  if (!match) return null;
  const [, sign, intPart = "0", fracRaw = ""] = match;
  const frac = fracRaw.padEnd(decimals + 1, "0");
  let result = BigInt(intPart + frac.slice(0, decimals));
  if (Number(frac[decimals]) >= 5) result += 1n;
  return sign ? -result : result;
}

/** Formats a scaled integer back to a plain decimal string with exactly `decimals` digits. */
export function toDecimalString(value: bigint, decimals: number): string {
  const negative = value < 0n;
  const digits = (negative ? -value : value).toString().padStart(decimals + 1, "0");
  const intPart = digits.slice(0, digits.length - decimals);
  const fracPart = decimals > 0 ? `.${digits.slice(-decimals)}` : "";
  return `${negative ? "-" : ""}${intPart}${fracPart}`;
}

/** Integer division rounding half away from zero. */
export function divRound(numerator: bigint, denominator: bigint): bigint {
  if (denominator === 0n) throw new RangeError("Division by zero");
  const negative = numerator < 0n !== denominator < 0n;
  const n = numerator < 0n ? -numerator : numerator;
  const d = denominator < 0n ? -denominator : denominator;
  const q = (n * 2n + d) / (d * 2n);
  return negative ? -q : q;
}

export function pow10(exponent: number): bigint {
  return 10n ** BigInt(exponent);
}
