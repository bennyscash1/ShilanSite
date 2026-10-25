"use client";

import Script from "next/script";
import { useEffect } from "react";

/**
 * Official Nagishli v2.3 embed (https://www.nagish.li/install.html):
 * a config script sets the documented nl_* globals, then nagishli.js loads.
 * The plugin file in /public/nagishli is unmodified. Hebrew is the default
 * language; nl_lang is set explicitly. nl_pos "bl" is the bottom-left corner,
 * opposite the live site's WhatsApp button (fixed, bottom 20px, right 20px).
 * The heavy script uses next/script afterInteractive: it is not in the SSR
 * markup, so it cannot mismatch hydration, and it starts only after the page
 * is interactive.
 */

const PANEL_LIMIT = "min(20rem, calc(100vw - 7.5rem))";

type NagishliWindow = Window & {
  nl_lang?: string;
  nl_pos?: string;
  nl_color?: string;
  nl_compact?: string;
  nl_accordion?: string;
  nl_link?: string;
  nl_dir?: string;
};

const decorativeImages: HTMLImageElement[] = [];

function installNagishliConfig() {
  if (typeof window === "undefined") return;
  const target = window as NagishliWindow;
  target.nl_lang = "he";
  target.nl_pos = "bl";
  target.nl_color = "green";
  target.nl_compact = "1";
  target.nl_accordion = "1";
  target.nl_link = "/accessibility";
  target.nl_dir = "/nagishli/nl-files/";
}

function placeClearOfWhatsApp(bar: HTMLElement) {
  // Physical left/bottom: the plugin positions itself with left/right, and the
  // WhatsApp button occupies the physical bottom-right on the live site.
  bar.style.setProperty("top", "auto", "important");
  bar.style.setProperty("right", "auto", "important");
  bar.style.setProperty("bottom", "max(1rem, env(safe-area-inset-bottom))", "important");
  bar.style.setProperty("left", "max(1rem, env(safe-area-inset-left))", "important");
  bar.style.setProperty("max-width", PANEL_LIMIT, "important");
  bar.style.setProperty("min-width", "0", "important");
}

function repairHostPage() {
  document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
    if (heading.getAttribute("role") === "heading" && !heading.hasAttribute("aria-level")) {
      heading.removeAttribute("role");
    }
  });

  const titles = document.head.querySelectorAll("title");
  for (let index = 1; index < titles.length; index += 1) titles[index]?.remove();

  for (const image of decorativeImages) {
    if (image.isConnected) image.setAttribute("alt", "");
  }
}

function repairWidget(root: ParentNode) {
  root.querySelectorAll("[tabindex]").forEach((element) => {
    const order = Number(element.getAttribute("tabindex"));
    if (order > 0) element.setAttribute("tabindex", "0");
  });

  // The plugin puts aria-label on plain spans (browser icons, move arrows).
  root.querySelectorAll("span[aria-label], div[aria-label]").forEach((element) => {
    if (element.getAttribute("role")) return;
    const order = element.getAttribute("tabindex");
    const focusable = order !== null && order !== "-1";
    element.setAttribute("role", focusable ? "button" : "img");
  });

  const developed = root.querySelector("#NLDevelopedIn");
  if (developed instanceof HTMLAnchorElement && developed.textContent.trim() === "") {
    developed.setAttribute("aria-label", developed.dataset.balloon || "נגיש לי");
  }
}

export function applyNagishliAdjustments() {
  const bar = document.getElementById("NagishLiBar");
  if (!bar) return false;

  placeClearOfWhatsApp(bar);
  bar.classList.add("shilan-nagishli");
  if (!bar.dataset.shilanBound) {
    bar.dataset.shilanBound = "1";
    bar.addEventListener("click", () => {
      window.setTimeout(applyNagishliAdjustments, 0);
    });
  }

  const menus = document.getElementById("NagishLiMenus");
  if (menus) {
    menus.style.setProperty("width", "100%", "important");
    menus.style.setProperty("min-width", "0", "important");
    menus.style.setProperty("max-width", "100%", "important");
    menus.style.setProperty("box-sizing", "border-box", "important");
  }

  repairWidget(document.getElementById("NagishLiTag") ?? document);
  repairHostPage();
  document.documentElement.dataset.nagishli = "ready";
  return true;
}

export function NagishliToolbar() {
  installNagishliConfig();

  useEffect(() => {
    decorativeImages.splice(
      0,
      decorativeImages.length,
      ...[...document.images].filter((image) => image.getAttribute("alt") === ""),
    );

    if (applyNagishliAdjustments()) return;

    const observer = new MutationObserver(() => {
      if (applyNagishliAdjustments()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <Script
      id="nagishli-plugin"
      src="/nagishli/nagishli.js?v=2.3"
      strategy="afterInteractive"
      charSet="utf-8"
      onLoad={() => {
        applyNagishliAdjustments();
        window.setTimeout(applyNagishliAdjustments, 0);
      }}
    />
  );
}
