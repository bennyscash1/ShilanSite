import { describe, expect, it } from "vitest";
import { convert, crossRate, formatRate } from "./convert";
import { divRound, parseScaled, toDecimalString } from "./decimal";
import { MOCK_SNAPSHOT } from "./mock-rates-provider";
import { formatAmount, parseAmount } from "./money";

describe("decimal", () => {
  it("parses and rounds half away from zero", () => {
    expect(parseScaled("3.0991", 4)).toBe(30991n);
    expect(parseScaled("1.005", 2)).toBe(101n);
    expect(parseScaled("-1.005", 2)).toBe(-101n);
    expect(parseScaled("abc", 2)).toBeNull();
  });

  it("formats scaled integers", () => {
    expect(toDecimalString(5n, 2)).toBe("0.05");
    expect(toDecimalString(-123456n, 2)).toBe("-1234.56");
    expect(toDecimalString(7n, 0)).toBe("7");
  });

  it("divides with rounding", () => {
    expect(divRound(5n, 2n)).toBe(3n);
    expect(divRound(-5n, 2n)).toBe(-3n);
    expect(divRound(4n, 3n)).toBe(1n);
  });
});

describe("money", () => {
  it("parses user input into minor units", () => {
    expect(parseAmount("1,234.5", "USD")).toBe(123450n);
    expect(parseAmount(".5", "ILS")).toBe(50n);
    expect(parseAmount("1 000", "ILS")).toBe(100000n);
    expect(parseAmount("1000.05", "ILS")).toBe(100005n);
    expect(parseAmount("12.", "ILS")).toBe(1200n);
    expect(parseAmount("", "USD")).toBeNull();
    expect(parseAmount("1.2.3", "USD")).toBeNull();
    expect(parseAmount("100.6", "JPY")).toBe(101n);
  });

  it("formats without floating point drift", () => {
    expect(formatAmount(30991n, "ILS")).toBe("309.91");
    expect(formatAmount(123456789012345678n, "USD")).toBe("1,234,567,890,123,456.78");
    expect(formatAmount(100n, "USD", { fixed: true })).toBe("1.00");
    expect(formatAmount(100n, "USD")).toBe("1");
  });
});

describe("convert", () => {
  it("matches the design example: 1 USD = 3.0991 ILS", () => {
    const result = convert(MOCK_SNAPSHOT, 100n, "USD", "ILS");
    expect(result.resultMinor).toBe(310n);
    expect(formatRate(result.rateScaled)).toBe("3.0991");
  });

  it("converts large amounts exactly", () => {
    const result = convert(MOCK_SNAPSHOT, 1_000_000_00n, "USD", "ILS");
    expect(result.resultMinor).toBe(3_099_100_00n);
  });

  it("converts back from ILS", () => {
    const result = convert(MOCK_SNAPSHOT, 3_099_100n, "ILS", "USD");
    expect(result.resultMinor).toBe(1_000_000n);
  });

  it("computes cross rates through ILS", () => {
    expect(formatRate(crossRate(MOCK_SNAPSHOT, "EUR", "USD"))).toBe("1.1662");
  });

  it("handles currencies with zero minor units", () => {
    const result = convert(MOCK_SNAPSHOT, 10_000n, "JPY", "ILS");
    expect(result.resultMinor).toBe(21_034n);
  });

  it("throws for a missing rate", () => {
    expect(() => convert({ ...MOCK_SNAPSHOT, rates: {} }, 1n, "USD", "ILS")).toThrow(RangeError);
  });
});
