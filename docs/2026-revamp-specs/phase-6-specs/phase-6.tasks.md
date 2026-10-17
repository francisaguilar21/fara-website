# Phase 6: Inner pages · Tasks

Specs: [phase-6.specs.md](./phase-6.specs.md)

## Content needed (Francis)

- [ ] **P6-T01** · Francis · Fitscovery story (500–1,500 words, or rough notes for Claude to draft from) → P6-R13
- [ ] **P6-T02** · Francis · Race history (or a Strava export), talks/events, 10–20 gallery photos with captions → P6-R10–R12
- [ ] **P6-T03** · Francis · `/uses` list, résumé PDF, any extra projects for `/projects` → P6-R6, P6-R7, P6-R15

## PR 1: Work & projects (`feat(work): add work and projects pages`)

- [x] **P6-T04** · Claude · Shared `OgTemplate` and `JsonLd` helpers → P6-R2, P6-R5
- [x] **P6-T05** · Claude · `/work`: full timeline, certifications, recommendations grid, résumé link, `Person` JSON-LD → P6-R6
- [x] **P6-T06** · Claude · `/projects` with `StackFilter` → P6-R7
- [ ] **P6-T07** · Claude · `/projects/[slug]` with `CaseStudyLayout`; write the Fitscovery and francisaguilar.co case studies from Francis's notes → P6-R8 _(layout and route done; the case studies are still placeholders in the five-part structure, waiting for notes)_
- [x] **P6-T08** · Claude · Add the routes to the sitemap; metadata + OG for each → P6-R2, P6-R3

## PR 2: Life hub, running, community (`feat(life): add life hub, running and community pages`)

- [ ] **P6-T09** · Claude · `/life` hub with 4 teaser cards → P6-R9
- [ ] **P6-T10** · Claude · `/life/running`: Strava summary (fallback data), `RaceTable`, pacing section → P6-R10
- [ ] **P6-T11** · Claude · `/life/community` → P6-R11
- [ ] **P6-T12** · Claude · Breadcrumb back links + `BreadcrumbList` JSON-LD on `/life/*` → P6-R5

## PR 3: Gallery & building (`feat(life): add gallery and building story`)

- [ ] **P6-T13** · Claude · Optimize the gallery images (WebP, ≤ 2000px) into `public/static/images/gallery/`; fill in `gallery.ts` with alt text → P6-R12
- [ ] **P6-T14** · Claude · `MasonryGallery` + `Lightbox` (keyboard, focus trap, swipe) → P6-R12
- [ ] **P6-T15** · Claude · `/life/building` from MDX with a table of contents → P6-R13

## PR 4: Now, uses, contact, 404 (`feat(now): add now, uses, contact and 404 pages`)

- [ ] **P6-T16** · Claude · `/now` with the updated-on label, staleness note and fallback widgets → P6-R14
- [ ] **P6-T17** · Claude · `/uses` → P6-R15
- [ ] **P6-T18** · Claude · `/contact` → P6-R16
- [ ] **P6-T19** · Claude · `app/not-found.tsx` → P6-R17

## Verification

- [ ] **P6-T20** · Claude · Playwright: every route returns 200, unknown routes return 404, lightbox keyboard flow, race table sort → P6-AC1, P6-AC3–AC5
- [ ] **P6-T21** · Claude · Unit test for the `/now` staleness rule → P6-AC8
- [ ] **P6-T22** · Claude · OG preview check, Rich Results Test, axe + Lighthouse on every page → P6-AC2, P6-AC6, P6-AC7
- [ ] **P6-T23** · Francis · Review every page on the preview and sign off → P6-R1

## Done when

All of P6-AC1 to P6-AC8 in the specs pass.
