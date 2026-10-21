# Project: Shilan (shilan.co.il) – Currency Exchange Website Rebuild

## Context
Build a from-scratch replacement for shilan.co.il, a currency exchange (FX) business website
currently on WordPress. Hebrew only, fully RTL (`<html lang="he" dir="rtl">`).
The design exists for DESKTOP ONLY – you must derive a polished responsive/mobile layout yourself.

This is phase 1 of a larger platform. Do NOT implement future phases now, but architect for them:
- User registration & management (Firebase Auth: email + Google login), customer area
  ("כניסת לקוחות" / "הקמת לקוח" links already exist in the top bar)
- Admin panel (manage rates, content, testimonials, leads, users)
- Live exchange rates from external APIs
- A SEPARATE future system for buying/selling foreign currency that connects to this one
  (shared users, shared domain types, shared Firebase project). It may be written in a
  different backend language, so cross-system communication must go through a documented
  HTTP API, not through imports.

## Design source (source of truth)
- Figma: https://www.figma.com/design/CGSb2N8ZQaWQBYqqOqIas6
  Use the Figma MCP server if available; otherwise use the attached screenshots.
- Take ALL copy, colors, fonts, spacing and icons from the design. Never invent text.
  If text is unreadable, insert a clearly marked `TODO_COPY` placeholder and list it in your report.
- Notes on the screenshots: dashed blue lines are Figma guides; the blue border on one
  testimonial card is a Figma selection, not a design state – all cards share one style.

## Tech stack
- Next.js (latest stable, App Router, React Server Components) + TypeScript (strict)
- Tailwind CSS v4 – design tokens as CSS variables from Figma, use logical properties
  (ms-/me-/ps-/pe-, start/end) everywhere so RTL is native, never left/right
- shadcn/ui (Radix) for accessible primitives (Select, Dialog, Sheet, Tabs, Checkbox) with RTL direction
- react-hook-form + zod for forms; next/font for the Hebrew font used in Figma
- Firebase: App Hosting (deploy), Firestore (leads, rates, testimonials), Auth (later)
- Firebase Admin SDK on the server only; client SDK only where needed
- Testing: Vitest (unit) + Playwright (e2e, desktop + mobile viewports)
- ESLint + Prettier, pnpm

## Repository structure (monorepo, pnpm workspaces + Turborepo)
apps/
  web/            ← this website (phase 1)
  admin/          ← placeholder only, empty README
packages/
  ui/             ← shared design system components + tokens
  core/           ← domain types & pure logic: Currency, Rate, Lead, ConversionResult,
                    conversion math (use integer minor units / decimal lib, never float math for money)
  firebase/       ← typed Firestore converters, collection names, server helpers
  config/         ← shared tsconfig, eslint, tailwind preset
docs/
  ARCHITECTURE.md ← decisions, how future auth/admin/FX system plug in
  API.md          ← planned public API contract (OpenAPI-style) for the future FX system

## Page structure (home page, top to bottom, RTL)
1. Top bar (dark green): links "כניסת לקוחות" | "הקמת לקוח" (route to placeholders /login, /signup)
2. Header (white, sticky): logo right, nav: אודותינו, השירותים שלנו, בלוג, יצירת קשר;
   gold CTA left: "לקבלת הצעת מחיר" (scrolls to contact form)
3. Hero (dark green, globe/tech background image):
   audience pill tabs – יבואנים ויצואנים (default) / חברות ומוסדות / לקוחות פרטיים.
   Tabs switch hero headline/subtext/CTA. Content for the default tab:
   H1 "מט"ח ליבואנים וליצואנים, בשער תחרותי ובליווי אישי"
   Sub "תשלום לספקים בחו"ל, קבלת תקבולים והמרתם, עם צוות מקצועי ואמין."
   CTA "לשירותים לעסקים". Other tabs: TODO_COPY, structured as data.
4. "מט"ח לעסקים": two glassmorphism cards – "אני יבואן" / "אני יצואן", each with
   description and gold link (copy from design)
5. "השירותים שלנו" (white): 5 service cards with icon, gold title, short text, gold-outlined:
   המרת מט"ח, העברות בינלאומיות, מט"ח באשראי, כרטיסי אשראי נטען, ניכיון שיקים
   – each links to /services/[slug] (create simple template pages)
6. FX calculator (green): title "מחשבון המרת מט"ח", gold CTA "להמרת מט"ח",
   card with two currency selectors (default שקל ישראלי ↔ דולר אמריקאי), two amount inputs,
   swap button, rate line under inputs. Bi-directional live calculation.
   Rates come from a `RatesProvider` interface in packages/core with:
   - `MockRatesProvider` (dev)
   - `BankOfIsraelRatesProvider` (official representative rates, server-side, cached with revalidate)
   Show "שערים להמחשה בלבד" disclaimer + last-updated time. Design so the admin can
   later override rates/spreads from Firestore.
7. "למה לעבוד עם שילן?" (dark green, trading-chart background): 6 glass cards, gold title + text
8. "מה אומרים הלקוחות שלנו" (cream background): testimonial cards with 5 stars;
   carousel (swipe on mobile, arrows/keyboard on desktop). Data from Firestore with local fallback.
9. Footer (dark green):
   - Contact form card "נשמח לשמוע מכם": name, phone, "איך אפשר לעזור?",
     audience chips (single select: יבואן / יצואן / חברה / לקוח פרטי – verify in Figma),
     marketing/privacy consent checkbox, gold submit.
   - Link columns: שירותים / החברה / יצירת קשר (phone, fax, email – take exact values from Figma)
   - Bottom: מדיניות פרטיות | הצהרת נגישות (create both pages with TODO content)

## Contact form (lead capture)
- Server Action → validate with zod (Israeli phone format) → save to Firestore `leads`
  → send notification email (abstract `Notifier` interface; implement via Firebase
  "Trigger Email" extension or a provider – make it swappable)
- Honeypot + rate limiting against spam; success/error states in Hebrew

## Responsive requirements (no mobile design exists – you design it)
- Mobile-first. Breakpoints: <640 mobile, 640–1024 tablet, ≥1024 desktop (match Figma at 1440)
- Header → hamburger opening a side Sheet from the right; top-bar links move into the menu;
  CTA stays visible
- Hero: text centered/right, tabs horizontally scrollable, background image cropped sensibly
- Importer/exporter cards: stack vertically
- Services: 5 → 2 columns tablet → 1 column (or horizontal snap-scroll) on mobile
- Calculator: inputs stacked vertically, swap button rotates 90°
- "Why" cards: 2 columns → 1 column
- Footer: form full width first, then link columns stacked
- Touch targets ≥ 44px, no horizontal scroll at 360px width

## Quality requirements
- Accessibility: Israeli standard IS 5568 (WCAG 2.0 AA) – legally required in Israel.
  Semantic HTML, keyboard navigation, focus states, labels, contrast check on gold-on-green
- SEO: metadata per page, Open Graph, sitemap.xml, robots.txt, JSON-LD (FinancialService / LocalBusiness)
- Migration from WordPress: `redirects` config with 301s – leave a mapping table I will fill in
- Performance: Lighthouse ≥ 90 on mobile; next/image, optimized hero backgrounds
- No secrets in client code; env vars documented in `.env.example`
- Content (services, why-cards, testimonials, hero tabs) lives in typed data files now,
  ready to move to Firestore/admin later

## Working process
1. Read the design. Report: list of sections, components, design tokens (colors, fonts,
   sizes, radii, shadows), and every TODO_COPY item. Wait for my approval.
2. Scaffold the monorepo, tokens and shared UI components. Show me.
3. Build the home page section by section; after each section compare visually against
   the design (desktop) and check mobile at 375px.
4. Contact form + Firestore + calculator providers.
5. Inner pages (services template, about, contact, privacy, accessibility, login/signup placeholders).
6. Tests: Playwright e2e for navigation, mobile menu, calculator math, form validation & submit.
7. Deployment setup for Firebase App Hosting + README with run/deploy instructions.

Ask before adding any dependency not listed above.