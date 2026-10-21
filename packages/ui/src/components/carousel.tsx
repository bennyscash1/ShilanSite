"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

type CarouselProps = {
  /** Accessible name of the carousel region. */
  label: string;
  prevLabel: string;
  nextLabel: string;
  children: ReactNode;
  className?: string;
  /** Classes for the scrolling track (set item widths on the children). */
  trackClassName?: string;
};

/**
 * Native scroll-snap carousel: swipe on touch, arrow buttons on desktop, and arrow keys
 * when the track has focus. No JS animation library; direction-aware for RTL.
 */
export function Carousel({
  label,
  prevLabel,
  nextLabel,
  children,
  className,
  trackClassName,
}: CarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // In RTL, scrollLeft runs from 0 to negative values.
    const offset = Math.abs(el.scrollLeft);
    setEdges({ atStart: offset < 2, atEnd: offset + el.clientWidth >= el.scrollWidth - 2 });
  }, []);

  // When every item fits (e.g. 5 testimonials on desktop), the arrows are hidden entirely.
  const scrollable = !(edges.atStart && edges.atEnd);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update]);

  const page = (step: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: (rtl ? -1 : 1) * step * el.clientWidth * 0.9,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const buttonClass = cn(
    "hidden size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gold-600 text-green-900 transition-opacity hover:bg-gold-600/10 disabled:cursor-default disabled:opacity-30",
    scrollable && "md:inline-flex",
  );

  return (
    <section aria-roledescription="carousel" aria-label={label} className={cn("flex items-center gap-3", className)}>
      {/* In RTL "previous" sits on the right (start) side and points right. */}
      <button type="button" className={buttonClass} onClick={() => page(-1)} disabled={edges.atStart}>
        <ChevronRightIcon className="size-5 rtl:block ltr:hidden" aria-hidden />
        <ChevronLeftIcon className="size-5 rtl:hidden ltr:block" aria-hidden />
        <span className="sr-only">{prevLabel}</span>
      </button>
      <ul
        ref={trackRef}
        onScroll={update}
        tabIndex={scrollable ? 0 : -1}
        className={cn(
          "scrollbar-none flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-2 outline-offset-4 *:snap-start",
          trackClassName,
        )}
      >
        {children}
      </ul>
      <button type="button" className={buttonClass} onClick={() => page(1)} disabled={edges.atEnd}>
        <ChevronLeftIcon className="size-5 rtl:block ltr:hidden" aria-hidden />
        <ChevronRightIcon className="size-5 rtl:hidden ltr:block" aria-hidden />
        <span className="sr-only">{nextLabel}</span>
      </button>
    </section>
  );
}
