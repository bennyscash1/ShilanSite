"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

const SELECTOR = [
  "main h1",
  "main h2",
  "main h3",
  "main h4",
  "main p",
  "main li",
  "main blockquote",
  "footer h2",
  "footer h3",
  "footer p",
  "footer li",
].join(", ");

const STAGGER_MS = 70;
const STAGGER_CAP = 4;
const DURATION_MS = 650;

function isRevealTarget(el: HTMLElement) {
  if (el.closest("form, header, [role='menu'], [data-no-reveal]")) return false;
  if (el.closest("[hidden], [aria-hidden='true']")) return false;
  if (el.classList.contains("sr-only")) return false;
  if (!el.textContent?.trim()) return false;
  if (el.getClientRects().length === 0) return false;
  // Cards animate their own heading and paragraph. Animating the card too would double the motion.
  if (el.matches("li") && el.querySelector("h1, h2, h3, h4, p")) return false;
  return true;
}

function show(elements: HTMLElement[]) {
  const groups = new Map<HTMLElement, HTMLElement[]>();
  for (const el of elements) {
    if (!el.classList.contains("scroll-reveal-pending")) continue;
    const parent = el.parentElement ?? document.body;
    const list = groups.get(parent) ?? [];
    list.push(el);
    groups.set(parent, list);
  }
  for (const list of groups.values()) {
    list.forEach((el, index) => {
      const delay = Math.min(index, STAGGER_CAP) * STAGGER_MS;
      if (delay > 0) el.style.setProperty("--reveal-delay", `${delay}ms`);
      el.classList.add("scroll-reveal-in");
      el.classList.remove("scroll-reveal-pending");
      const clear = () => {
        el.classList.remove("scroll-reveal-in");
        el.style.removeProperty("--reveal-delay");
      };
      el.addEventListener(
        "transitionend",
        (event) => {
          if (event.target !== el || event.propertyName !== "transform") return;
          clear();
        },
        { once: true },
      );
      window.setTimeout(clear, DURATION_MS + delay + 80);
    });
  }
}

/** One-shot fade and rise for text as it enters the viewport. Content is visible without JS. */
export function ScrollReveal() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const nodes = [...document.querySelectorAll<HTMLElement>(SELECTOR)].filter(isRevealTarget);
    const pending: HTMLElement[] = [];
    const viewBottom = window.innerHeight - 8;
    for (const el of nodes) {
      if (el.classList.contains("scroll-reveal-in")) continue;
      const rect = el.getBoundingClientRect();
      // On screen, or already scrolled past before this script ran: leave it visible.
      if (rect.bottom <= 0 || (rect.top < viewBottom && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0)) {
        el.classList.remove("scroll-reveal-pending");
        continue;
      }
      el.classList.add("scroll-reveal-pending");
      pending.push(el);
    }
    root.classList.add("js-scroll-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        const entered = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target)
          .filter((el): el is HTMLElement => el instanceof HTMLElement);
        for (const el of entered) observer.unobserve(el);
        show(entered);
      },
      { rootMargin: "0px 0px -24px 0px", threshold: 0.01 },
    );
    for (const el of pending) observer.observe(el);

    // A fast scroll can jump an element past the viewport between observer frames.
    function catchUp() {
      const ready = pending.filter((el) => {
        if (!el.classList.contains("scroll-reveal-pending")) return false;
        const rect = el.getBoundingClientRect();
        if (rect.bottom <= 0) return true;
        return (
          rect.top < window.innerHeight - 8 &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0
        );
      });
      for (const el of ready) observer.unobserve(el);
      show(ready);
    }
    document.addEventListener("scroll", catchUp, { capture: true, passive: true });
    window.addEventListener("resize", catchUp);

    function onFocusIn(event: Event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const el = target.closest(".scroll-reveal-pending");
      if (!(el instanceof HTMLElement)) return;
      observer.unobserve(el);
      show([el]);
    }
    document.addEventListener("focusin", onFocusIn);

    return () => {
      observer.disconnect();
      document.removeEventListener("scroll", catchUp, { capture: true });
      window.removeEventListener("resize", catchUp);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [pathname]);

  return null;
}
