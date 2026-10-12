# Phase 3: Design system · Tasks

Specs: [phase-3.specs.md](./phase-3.specs.md)

## PR 1: Tokens, fonts and theme (`feat(design): add tokens, fonts and theme switching`)

- [ ] **P3-T01** · Francis · Answer open question 1 (Display XL size); Claude updates DESIGN §3.4 to match → P3-R3
- [x] **P3-T02** · Claude · `pnpm add next-themes clsx tailwind-merge` and `pnpm add -D @tailwindcss/typography` → P3-R1
- [x] **P3-T03** · Claude · `app/globals.css` tokens + `@theme inline` mapping ([specs §4.1](./phase-3.specs.md#41-tokens-appglobalscss)) → P3-R1
- [x] **P3-T04** · Claude · Load the 3 fonts with `next/font/google` in `app/fonts.ts` and apply the variables on `<html>` → P3-R2
- [x] **P3-T05** · Claude · Type scale utilities ([specs §4.2](./phase-3.specs.md#42-type-scale)) and prose overrides for `@tailwindcss/typography` → P3-R3
- [x] **P3-T06** · Claude · `ThemeProvider` (next-themes, dark default, no system) in the root layout → P3-R4
- [x] **P3-T07** · Claude · `lib/cn.ts` (`clsx` + `tailwind-merge`) → P3-R7
- [x] **P3-T08** · Claude · `/styleguide` page with the colors and type sections. Returns 404 in production. → P3-R12
- [x] **P3-T09** · Claude · Check P3-AC3 and the contrast part of P3-AC7 → P3-R11

## PR 2: Logo, layout and UI (`feat(design): add logo, header, footer and UI primitives`)

- [ ] **P3-T10** · Claude · `components/ui/Logo.tsx` with hand-built SVG paths ([specs §4.6](./phase-3.specs.md#46-logo)) → P3-R5
- [ ] **P3-T11** · Claude · `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico`; delete `public/static/favicons/` → P3-R5
- [ ] **P3-T12** · Claude · `Button`, `Eyebrow`, `SlashDivider`, `Tag`, `Label`, `DraftChip`, `UnderlineLink` in `components/ui/` → P3-R7
- [ ] **P3-T13** · Claude · `Container`, `Section`, `SkipLink` in `components/layout/` → P3-R6
- [ ] **P3-T14** · Claude · `SiteHeader`: sticky, hides on scroll, nav, CTA; mobile menu (static for now, the wipe comes in PR 3) → P3-R6
- [ ] **P3-T15** · Claude · `SiteFooter` with the outlined wordmark and link columns → P3-R6
- [ ] **P3-T16** · Claude · Focus ring styles and skip link → P3-R11
- [ ] **P3-T17** · Claude · Add the components to `/styleguide` → P3-R12
- [ ] **P3-T18** · Claude · Unit tests: `Button` renders as a link with `href`; `DraftChip` renders its text; `Logo` uses `currentColor` → P3-R7

## PR 3: Motion (`feat(design): add motion system`)

- [ ] **P3-T19** · Claude · `pnpm add motion lenis lucide-react` → P3-R8
- [ ] **P3-T20** · Claude · `lib/motion.ts` (easing, durations, `useMotionEnabled`) → P3-R9
- [ ] **P3-T21** · Claude · `Reveal` and `Parallax` (visible resting state) → P3-R8, P3-R10
- [ ] **P3-T22** · Claude · `SmoothScroll` (Lenis), loaded after `requestIdleCallback` → P3-R8, P3-R13
- [ ] **P3-T23** · Claude · `Cursor` + `data-cursor` labels, loaded after `requestIdleCallback` → P3-R8, P3-R13
- [ ] **P3-T24** · Claude · `Magnetic` wrapper; apply it to header CTA and theme toggle → P3-R8
- [ ] **P3-T25** · Claude · `SlashWipe` + `ThemeToggle`; mobile menu uses the wipe → P3-R7, P3-R8
- [ ] **P3-T26** · Claude · Route transitions (resolve open question 2) → P3-R8
- [ ] **P3-T27** · Claude · Motion demos + "simulate reduced motion" switch in `/styleguide` → P3-R12
- [ ] **P3-T28** · Claude · Run P3-AC1 to P3-AC9. Attach before/after screenshots to the PR. → all

## Done when

All of P3-AC1 to P3-AC9 in the specs pass.
