# Phase 9: Post-launch · Tasks

Specs: [phase-9.specs.md](./phase-9.specs.md)

## Week 1: Monitor

- [ ] **P9-T01** · Francis · Daily for 7 days: check PostHog, Speed Insights and Vercel logs. Add a line to
      the decisions log or file an issue. → P9-R1
- [ ] **P9-T02** · Claude · Add a `widget_fallback` event (server-side) so the fallback rate shows in PostHog → P9-R2
- [ ] **P9-T03** · Francis · Build the "Site health" dashboard in PostHog; Claude links it from the README → P9-R2

## Automation

- [ ] **P9-T04** · Claude · `renovate.json` ([specs §4.1](./phase-9.specs.md#41-renovate-renovatejson)); re-enable the Renovate app if it's paused → P9-R3
- [ ] **P9-T05** · Claude · release-please workflow + config, starting at `2026.0.0` → P9-R4

## Experiment

- [ ] **P9-T06** · Francis · Pick 2 headline variants (from DESIGN or new ones) → P9-R5
- [ ] **P9-T07** · Claude · Read `hero-headline` in `Hero` (server-evaluated, bootstrapped, no flicker); variants in `site.ts` → P9-R5
- [ ] **P9-T08** · Francis · Create the PostHog experiment (metrics in [specs P9-R5](./phase-9.specs.md#3-requirements)) and start it → P9-R5
- [ ] **P9-T09** · Francis + Claude · Conclude: record the result, make the winner the default, remove the variant code → P9-AC5

## Content

- [ ] **P9-T10** · Francis · Outline the launch post; Claude drafts it from the specs; Francis edits and publishes → P9-R6

## Maintenance mode, long-term

- [ ] **P9-T11** · Francis · Pick an option from [specs §4.3](./phase-9.specs.md#43-maintenance-switch-options-p9-r7) (default: PostHog local evaluation) → P9-R7
- [ ] **P9-T12** · Claude · Implement it, keeping fail-open and the env override; update the Phase 0 spec §4.1 and the unit tests → P9-R7

## Search & clean-up

- [ ] **P9-T13** · Francis · Search Console check at 2 weeks and at 6 weeks; record both in the decisions log → P9-R8
- [ ] **P9-T14** · Claude · Clean-up: `motion-rich` decision, unused `MAINTENANCE_ALLOWED_PATHS` support, leftover TODOs → P9-R9

## Done when

All of P9-AC1 to P9-AC8 in the specs pass. After that, new work gets its own `phase-N-specs/` folder.
