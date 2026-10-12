# Phase 8: QA & launch · Tasks

Specs: [phase-8.specs.md](./phase-8.specs.md)

## PR 1: Quality gates (`ci: add e2e, accessibility and Lighthouse checks`)

- [ ] **P8-T01** · Claude · `pnpm add -D @axe-core/playwright @lhci/cli` → P8-R1, P8-R2
- [ ] **P8-T02** · Claude · Playwright suite: routes, 404, redirects, theme, contact (mocked), maintenance on/off/bypass, axe per route and theme → P8-R1, P8-R3
- [ ] **P8-T03** · Claude · `lighthouserc.json` with budgets for the 5 routes; CI job against the Vercel preview with the bypass cookie → P8-R2
- [ ] **P8-T04** · Claude · `e2e` CI job (Chromium + WebKit) → P8-R3
- [ ] **P8-T05** · Claude · `drafts` CI job, run on PRs labelled `launch` → P8-R5
- [ ] **P8-T06** · Claude · `scripts/seo-audit.ts` (crawls the sitemap, checks title, description, canonical and OG on each page) → P8-R6

## PR 2: Fixes (`fix: address QA findings`)

- [ ] **P8-T07** · Claude · Fix every axe and Lighthouse finding until the gates pass → P8-AC1, P8-AC2
- [ ] **P8-T08** · Claude · Keyboard pass and 200% zoom pass. Fix any issues. → P8-R1
- [ ] **P8-T09** · Francis · VoiceOver pass on iOS and macOS (home, a post, `/work`). Log issues. → P8-R1
- [ ] **P8-T10** · Francis · Browser matrix ([specs P8-R4](./phase-8.specs.md#3-requirements)). Log issues. → P8-R4
- [ ] **P8-T11** · Claude · Fix logged issues, or record why each is accepted → P8-AC4
- [ ] **P8-T12** · Claude · Rich Results Test and SEO audit pass → P8-AC6

## Content gate

- [ ] **P8-T13** · Francis · Replace or remove every draft entry. Proofread all pages. → P8-R5
- [ ] **P8-T14** · Claude · Open the `launch` PR (final content). `pnpm check:drafts` passes in CI. → P8-AC5

## Rollback rehearsal

- [ ] **P8-T15** · Francis + Claude · Run [specs §4.4](./phase-8.specs.md#44-rollback-rehearsal-on-a-preview) on a preview → P8-R8, P8-AC7

## Launch (runbook, [specs §4.3](./phase-8.specs.md#43-launch-runbook))

- [ ] **P8-T16** · Claude · Step 1: confirm CI, drafts and budgets are green on `main` → P8-R7
- [ ] **P8-T17** · Francis · Step 2: click through production with the bypass cookie → P8-R7
- [ ] **P8-T18** · Claude · Step 3: smoke suite against production (with the cookie) → P8-R7
- [ ] **P8-T19** · Francis · Steps 4–5: turn `is_maintenance_mode` **off**; clear `MAINTENANCE_ALLOWED_PATHS` → P8-R7
- [ ] **P8-T20** · Claude · Step 6: smoke suite against production (no cookie) → P8-R7
- [ ] **P8-T21** · Francis · Step 7: Search Console sitemap + indexing requests → P8-R6
- [ ] **P8-T22** · Claude · Step 8: tag `v2026.0.0` → P8-AC8
- [ ] **P8-T23** · Francis · Step 9: announce → P8-AC8
- [ ] **P8-T24** · Claude · Tick plan §10 (definition of done) and set every phase's status in the [README](../README.md) → P8-AC9

## Done when

All of P8-AC1 to P8-AC9 in the specs pass.
