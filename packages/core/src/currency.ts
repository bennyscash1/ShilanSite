/** ISO 4217 codes supported by the site. Order = order shown in currency selectors. */
export const CURRENCY_CODES = [
  "ILS",
  "USD",
  "EUR",
  "GBP",
  "CHF",
  "CAD",
  "AUD",
  "JPY",
] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export interface Currency {
  code: CurrencyCode;
  /** Hebrew display name. */
  name: string;
  symbol: string;
  /** Number of minor-unit digits (ISO 4217 exponent). */
  minorUnits: number;
}

// TODO_COPY: only "שקל ישראלי" and "דולר אמריקאי" appear in the design. The rest follow
// Bank of Israel naming; the business must confirm which currencies it actually offers.
export const CURRENCIES: Record<CurrencyCode, Currency> = {
  ILS: { code: "ILS", name: "שקל ישראלי", symbol: "₪", minorUnits: 2 },
  USD: { code: "USD", name: "דולר אמריקאי", symbol: "$", minorUnits: 2 },
  EUR: { code: "EUR", name: "אירו", symbol: "€", minorUnits: 2 },
  GBP: { code: "GBP", name: "לירה שטרלינג", symbol: "£", minorUnits: 2 },
  CHF: { code: "CHF", name: "פרנק שוויצרי", symbol: "CHF", minorUnits: 2 },
  CAD: { code: "CAD", name: "דולר קנדי", symbol: "C$", minorUnits: 2 },
  AUD: { code: "AUD", name: "דולר אוסטרלי", symbol: "A$", minorUnits: 2 },
  JPY: { code: "JPY", name: "ין יפני", symbol: "¥", minorUnits: 0 },
};

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && (CURRENCY_CODES as readonly string[]).includes(value);
}

export function getCurrency(code: CurrencyCode): Currency {
  return CURRENCIES[code];
}
