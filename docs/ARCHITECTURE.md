# Architecture

Phase 1 is the public marketing site (`apps/web`). Later phases plug into the same monorepo and Firebase project.

## Layout

| Path | Role |
|---|---|
| `apps/web` | Next.js 16 App Router site (RSC by default, Hebrew RTL) |
| `apps/admin` | Placeholder for the phase 2 admin panel |
| `packages/ui` | Design tokens (`src/styles/theme.css`) and shared React components on Radix |
| `packages/core` | Pure domain logic with no framework imports: currencies, money math, rates, conversion |
| `packages/firebase` | Firestore collection names, typed converters, Admin SDK helpers (server only) |
| `packages/config` | Shared tsconfig and ESLint configs |

Workspace packages ship TypeScript source; `apps/web` compiles them via `transpilePackages`. No package build step.

## Decisions

- **Money math.** Amounts are `bigint` minor units. Rates are decimal strings from the provider, parsed to `bigint` scaled by 10^8. Rounding is half away from zero. No floats and no decimal library dependency. See `packages/core/src/convert.ts`.
- **Rates.** Every source implements `RatesProvider` (`packages/core/src/rate.ts`). All rates are expressed as ILS per unit; cross rates go through ILS. Phase 2 admin overrides become a provider decorator that reads `rateOverrides` from Firestore and applies `spreadBps`.
- **RTL.** `<html dir="rtl">` plus Radix `DirectionProvider`. Only logical Tailwind utilities are allowed (`ms/me`, `ps/pe`, `start/end`); the custom ESLint rule `rtl/no-physical-classes` fails the build on `ml-`, `right-`, `text-left`, and so on.
- **Tailwind v4 preset.** v4 has no JS presets. `packages/ui/src/styles/theme.css` is the shared preset; each app imports it after `tailwindcss` and adds an `@source` for `packages/ui/src`.
- **Accessibility (IS 5568 / WCAG 2.0 AA).** Two Figma colors fail contrast and are replaced:
  - CTA background `#A17510` with white text is 4.1:1, so buttons use `gold-700 #8A630F` (5.4:1).
  - Gold text on dark green or glass uses `gold-300 #E0B54A` (5.7:1 on `green-900`).
  - Original Figma values remain as `gold-500` and `gold-600` (gold on white for large titles passes).
- **Content.** Copy lives in typed files under `apps/web/src/content`, shaped like future Firestore documents so the admin panel can take them over. Developer-written accessibility microcopy is isolated in `ui-strings.ts` for business review.

## Future phases

- **Auth (phase 2).** Firebase Auth (email + Google). `/login` and `/signup` routes already exist as placeholders. Session cookies are verified server-side with the Admin SDK.
- **Admin (phase 2).** `apps/admin` reuses `@shilan/ui`, `@shilan/core` and `@shilan/firebase`. It manages `leads`, `testimonials`, `rateOverrides` and users.
- **FX trading system (separate).** It may be written in another language, so it never imports these packages. It integrates over the HTTP API documented in `docs/API.md` and shares the Firebase project: same Auth users, same ID tokens as bearer credentials. Domain types in `packages/core` are the source for that API's schemas.
