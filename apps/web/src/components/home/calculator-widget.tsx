"use client";

import {
  CURRENCIES,
  CURRENCY_CODES,
  convert,
  crossRate,
  formatAmount,
  formatRate,
  hasRate,
  parseAmount,
  type CurrencyCode,
  type RatesSnapshot,
} from "@shilan/core";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shilan/ui/components/select";
import { useId, useMemo, useState } from "react";
import { SwapIcon } from "@/components/icons/figma-icons";
import { uiStrings } from "@/content/ui-strings";

type Side = "a" | "b";

type CalcState = {
  codes: Record<Side, CurrencyCode>;
  /** Text shown in each input. The side the user typed in keeps their raw text. */
  text: Record<Side, string>;
  edited: Side;
};

const other = (side: Side): Side => (side === "a" ? "b" : "a");

/** Recomputes the side the user did not edit, from the side they did. */
function recompute(snapshot: RatesSnapshot, state: CalcState): CalcState {
  const from = state.edited;
  const to = other(from);
  const minor = parseAmount(state.text[from], state.codes[from]);
  const result =
    minor === null ? "" : formatAmount(convert(snapshot, minor, state.codes[from], state.codes[to]).resultMinor, state.codes[to], { fixed: true });
  return { ...state, text: { ...state.text, [to]: result } as Record<Side, string> };
}

const sanitize = (value: string) => value.replace(/[^\d.,]/g, "");

const dateFormat = new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Jerusalem" });

/**
 * Bi-directional converter. Side "a" is the right-hand field in RTL (ILS by default),
 * side "b" the left-hand one (USD by default), as in the design.
 */
export function CalculatorWidget({ snapshot, disclaimer }: { snapshot: RatesSnapshot; disclaimer: string }) {
  const id = useId();
  const available = useMemo(() => CURRENCY_CODES.filter((code) => hasRate(snapshot, code)), [snapshot]);
  const [state, setState] = useState<CalcState>(() =>
    recompute(snapshot, { codes: { a: "ILS", b: "USD" }, text: { a: "", b: "1" }, edited: "b" }),
  );

  const setText = (side: Side, value: string) =>
    setState((s) => recompute(snapshot, { ...s, edited: side, text: { ...s.text, [side]: sanitize(value) } as Record<Side, string> }));

  const setCode = (side: Side, code: CurrencyCode) =>
    setState((s) => {
      // Picking the currency already on the other side swaps them.
      const codes =
        code === s.codes[other(side)]
          ? ({ [side]: code, [other(side)]: s.codes[side] } as Record<Side, CurrencyCode>)
          : { ...s.codes, [side]: code };
      return recompute(snapshot, { ...s, codes });
    });

  const swap = () =>
    setState((s) =>
      recompute(snapshot, {
        codes: { a: s.codes.b, b: s.codes.a },
        text: { a: s.text.b, b: s.text.a },
        edited: other(s.edited),
      }),
    );

  const rate = formatRate(crossRate(snapshot, state.codes.b, state.codes.a));

  const field = (side: Side, label: string) => {
    const code = state.codes[side];
    const currency = CURRENCIES[code];
    return (
      <div className="w-full overflow-hidden rounded-control border border-white bg-white/10 lg:w-[249px]">
        <Select value={code} onValueChange={(value) => setCode(side, value as CurrencyCode)}>
          <SelectTrigger
            aria-label={label}
            className="relative h-[57px] justify-center border-b border-white bg-white/10 px-12 [&>svg]:absolute [&>svg]:end-6 [&>svg]:stroke-1"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {available.map((c) => (
              <SelectItem key={c} value={c}>
                {CURRENCIES[c].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex h-[70px] items-center pe-5">
          <input
            id={`${id}-${side}`}
            aria-label={uiStrings.amountIn(currency.name)}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            dir="ltr"
            value={state.text[side]}
            onChange={(e) => setText(side, e.target.value)}
            size={1}
            className="h-full w-0 min-w-0 flex-1 bg-transparent pe-[26px] text-end text-amount outline-none focus-visible:outline-none"
          />
          <span aria-hidden className="text-amount">
            {currency.symbol}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-card border border-white bg-green-900/80 px-5 py-8 sm:px-10 lg:min-h-[368px] lg:px-[61px] lg:pt-[119px] lg:pb-6">
      <div className="flex flex-col items-center gap-3 lg:flex-row lg:gap-0 [&>div]:focus-within:outline-2 [&>div]:focus-within:outline-offset-2 [&>div]:focus-within:outline-gold-500">
        {field("a", uiStrings.currencyA)}
        <div className="flex shrink-0 justify-center lg:w-[55px]">
          <button
            type="button"
            onClick={swap}
            aria-label={uiStrings.swapCurrencies}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full text-gold-600 transition-transform hover:scale-110 max-lg:rotate-90"
          >
            <SwapIcon />
          </button>
        </div>
        {field("b", uiStrings.currencyB)}
      </div>
      <p className="mt-[18px] text-fine" aria-live="polite">
        <span dir="ltr">
          1 {state.codes.b} = {rate} {state.codes.a}
        </span>
      </p>
      <p className="mt-2 text-fine opacity-90">
        {disclaimer} · {uiStrings.ratesUpdated}{" "}
        <time dateTime={snapshot.asOf} suppressHydrationWarning>
          {dateFormat.format(new Date(snapshot.asOf))}
        </time>
      </p>
    </div>
  );
}
