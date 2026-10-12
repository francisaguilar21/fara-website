# Phase 7: Integrations · Tasks

Specs: [phase-7.specs.md](./phase-7.specs.md)

## Before starting (Francis)

- [ ] **P7-T01** · Francis · Check that every Phase 0 credential is in Vercel (Production + Preview). Add
      `POSTHOG_PERSONAL_API_KEY` (read-only feature-flag scope) and `CONTACT_TO_EMAIL`. → P7-R1, P7-R9

## PR 1: Env & PostHog (`feat(analytics): add env validation and PostHog`)

- [ ] **P7-T02** · Claude · `pnpm add @t3-oss/env-nextjs posthog-js posthog-node server-only` → P7-R1, P7-R5
- [ ] **P7-T03** · Claude · `lib/env.ts`; replace direct `process.env` reads (except in `lib/maintenance/`) → P7-R1
- [ ] **P7-T04** · Claude · `/ingest` rewrites + `skipTrailingSlashRedirect`; exclude `ingest/` in the `proxy.ts` matcher → P7-R6, P7-R7
- [ ] **P7-T05** · Claude · `PostHogProvider` (client) and `lib/analytics/posthog-server.ts` (local evaluation, bootstrap flags) → P7-R5, P7-R9
- [ ] **P7-T06** · Claude · `lib/analytics/events.ts` typed `track()`; wire up every event in [specs §4.2](./phase-7.specs.md#42-events) → P7-R8
- [ ] **P7-T07** · Francis · In PostHog, create the flags in [specs §4.3](./phase-7.specs.md#43-flags) and turn on session replay with input masking → P7-R9, P7-R10
- [ ] **P7-T08** · Claude · Gate widgets and motion on their flags; `useMotionEnabled` reads `motion-rich` → P7-R9
- [ ] **P7-T09** · Claude · CSP update (PostHog, Turnstile) → P7-R11

## PR 2: Strava (`feat(integrations): add Strava running data`)

- [ ] **P7-T10** · Claude · `lib/integrations/strava.ts`: token refresh + cache, stats, 12-week aggregation, last run, a mapper that strips location data → P7-R12
- [ ] **P7-T11** · Claude · Switch the running tile, `/life/running`, `/life` and the now strip to live data; ISR 1h → P7-R15
- [ ] **P7-T12** · Claude · Unit tests: aggregation, pace, no coordinates, fallback on 401/500/timeout → P7-AC8, P7-AC9

## PR 3: GitHub (`feat(integrations): add GitHub contributions`)

- [ ] **P7-T13** · Claude · `lib/integrations/github.ts` (GraphQL, level mapping, 6h revalidate) → P7-R13
- [ ] **P7-T14** · Claude · Live `ContributionGraph`; unit tests for the mapper and fallback → P7-AC9

## PR 4: Spotify (`feat(integrations): add Spotify now playing`)

- [ ] **P7-T15** · Claude · `lib/integrations/spotify.ts` + `app/api/now-playing/route.ts` (30s revalidate, recently-played fallback, episodes hidden) → P7-R14
- [ ] **P7-T16** · Claude · Client polling hook (30s, pauses when the tab is hidden) used by `NowPlaying` and the now strip → P7-R14
- [ ] **P7-T17** · Claude · Unit tests: mapper, nothing-playing path, fallback → P7-AC9

## PR 5: Contact (`feat(contact): deliver contact form with Resend`)

- [ ] **P7-T18** · Claude · `pnpm add resend @react-email/components @marsidev/react-turnstile`; optional `@upstash/ratelimit @upstash/redis` → P7-R16
- [ ] **P7-T19** · Claude · `sendContact` Server Action ([specs §4.4](./phase-7.specs.md#44-contact-flow)), `lib/rate-limit.ts`, `lib/integrations/turnstile.ts` → P7-R16
- [ ] **P7-T20** · Claude · React Email templates (notification + auto-reply) and `lib/integrations/resend.ts` → P7-R17
- [ ] **P7-T21** · Claude · Form states (pending, field errors, success, failure) + Turnstile widget + `contact_submitted` event → P7-R18
- [ ] **P7-T22** · Claude · `book_call_clicked` wiring → P7-R19
- [ ] **P7-T23** · Claude · Unit tests for the action's steps (mocked Turnstile, Resend and limiter) → P7-AC7, P7-AC9

## Verification

- [ ] **P7-T24** · Claude · CI step: grep `.next/static` for every server variable's value (stored as CI secrets) → P7-R4, P7-AC10
- [ ] **P7-T25** · Claude · Preview checks P7-AC1 to P7-AC5 (remove keys one at a time on a preview deployment) → P7-R2
- [ ] **P7-T26** · Francis · Send a real test message and check both emails (P7-AC6). Check that PostHog Live Events shows the events. → P7-AC4, P7-AC6

## Done when

All of P7-AC1 to P7-AC10 in the specs pass.
