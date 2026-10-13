# Phase 5: Homepage · Tasks

Specs: [phase-5.specs.md](./phase-5.specs.md)

## Content needed (Francis, before or during this phase)

- [ ] **P5-T01** · Francis · Booking URL, headline decision, and `/now` focus items → P5-R6, P5-R7, P5-R15
- [ ] **P5-T02** · Francis · Experience entries (company, title, start/end, impact, whether to name the employer), pacing start year → P5-R8
- [ ] **P5-T03** · Francis · 3 featured projects (year, role, outcome, metric, stack, cover) → P5-R9
- [ ] **P5-T04** · Francis · Certifications and 2–4 recommendations (with permission) → P5-R12

Missing items don't block the work. Placeholders with draft chips stand in.

## PR 1: Hero & now strip (`feat(home): add hero and now strip`)

- [x] **P5-T05** · Claude · `lib/integrations/fallbacks.ts` (typed sample data, `isSample: true`) → P5-R2
- [x] **P5-T06** · Claude · `scripts/check-drafts.ts` + `pnpm check:drafts` → P5-R2
- [x] **P5-T07** · Claude · `app/page.tsx` composed from sections; section `id`s; header nav anchors on home → P5-R1, P5-R5
- [x] **P5-T08** · Claude · `Hero` (reveal, underline draw, roles, CTAs, portrait parallax and hover color) → P5-R6, P5-R17
- [x] **P5-T09** · Claude · `NowStrip` (marquee, duplicated items hidden from screen readers, static under reduced motion) → P5-R7

## PR 2: Timeline (`feat(home): add scroll-drawn timeline`)

- [x] **P5-T10** · Claude · `Timeline`, `TimelineItem`, `TimelineYear` ([specs §4.3](./phase-5.specs.md#43-timeline-mechanics)) → P5-R8
- [x] **P5-T11** · Claude · Mobile layout (inline years, track on the left) and reduced-motion state (fully drawn) → P5-R8, P5-R4
- [x] **P5-T12** · Claude · Unit test: active-entry calculation. Playwright: scrolling lights up the dots in order. → P5-R8

## PR 3: Projects & life (`feat(home): add projects and beyond-work sections`)

- [ ] **P5-T13** · Claude · `ProjectList`, `ProjectRow`, `CursorPeek` (fine pointer only) → P5-R9
- [ ] **P5-T14** · Claude · `RunningTile` + `WeeklyBars` SVG drawn to scale → P5-R10
- [ ] **P5-T15** · Claude · `CommunityTile` + `NowPlaying` widget (fallback data) → P5-R10
- [ ] **P5-T16** · Claude · `GalleryStrip` (5 photos, parallax, captions; crop the 2023 fitness collage as starter images) → P5-R10, P5-R17
- [ ] **P5-T17** · Claude · `BuildingTile` (pull quote marked draft until the story exists) → P5-R10

## PR 4: Remaining sections (`feat(home): add stack, proof, writing, GitHub and contact`)

- [ ] **P5-T18** · Claude · `StackGrid` → P5-R11
- [ ] **P5-T19** · Claude · `Proof`: `QuoteCarousel` (keyboard, swipe, labelled dots) + `CertList` → P5-R12, P5-R18
- [ ] **P5-T20** · Claude · `LatestPosts` → P5-R13
- [ ] **P5-T21** · Claude · `ContributionGraph` (fallback calendar, tooltip, scrolls inside its own container) → P5-R14
- [ ] **P5-T22** · Claude · `ContactSection`, `BookingCard`, `ContactForm` (client-side validation; submit stub) → P5-R15

## Verification

- [ ] **P5-T23** · Claude · Screenshot comparison with the mockup (P5-AC1) and checks at 360px (P5-AC5) → P5-R3
- [ ] **P5-T24** · Claude · axe and keyboard pass (P5-AC6). Check with JavaScript disabled (P5-AC8). → P5-R18
- [ ] **P5-T25** · Claude · Lighthouse on the preview with the bypass cookie (P5-AC7) → P5-R16, P5-R17
- [ ] **P5-T26** · Francis · Review the preview and sign off on the homepage → P5-R3

## Done when

All of P5-AC1 to P5-AC8 in the specs pass.
