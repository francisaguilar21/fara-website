# Phase 7: Integrations · Specs

| Status      | Depends on                                                     | Ships as                                                        | Effort   |
| ----------- | -------------------------------------------------------------- | --------------------------------------------------------------- | -------- |
| Not started | Phase 0 credentials, Phase 5 widgets; can overlap with Phase 6 | 5 PRs: env + PostHog → Strava → GitHub → Spotify → contact form | 2–3 days |

References: [DESIGN §8](../design/DESIGN.md#8-live-data-integrations), [DESIGN §9](../design/DESIGN.md#9-contact), [DESIGN §10](../design/DESIGN.md#10-analytics--feature-flags-posthog), [plan §7](../2026-revamp-plan.md#7-environment-variables)

## 1. Goal

Replace every fallback with live data, make the contact form deliver email, and give the site its
analytics and feature flags. A third-party failure must never break a page.

## 2. Scope

**In**

- Env validation
- PostHog (client, server, reverse proxy, events, flags, replay)
- Strava, GitHub and Spotify adapters with caching
- Contact form delivery with spam protection and rate limiting

**Out**

- Changing widget UI (built in Phase 5)
- New integrations not in DESIGN §8–§10

## 3. Requirements

### Cross-cutting

| ID    | Requirement                                                                                                                                                                                                                                  |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P7-R1 | `lib/env.ts` (`@t3-oss/env-nextjs`) validates every variable in plan §7. The build fails if a **required** server variable is missing in production. Optional ones (Upstash, `MAINTENANCE_*`) may be empty.                                  |
| P7-R2 | Each integration lives in `lib/integrations/<name>.ts`, is `server-only`, exports typed functions that return the Phase 5 fallback types, and **never throws** to the page. On error it logs and returns the fallback with `isSample: true`. |
| P7-R3 | Each external call has a timeout (≤ 3s) and uses Next.js caching (`fetch` `next.revalidate` or `unstable_cache`) at the interval in §4.                                                                                                      |
| P7-R4 | Secrets never reach the client bundle. Only `NEXT_PUBLIC_*` variables are read in client components (checked by a bundle grep in CI).                                                                                                        |

### PostHog

| ID     | Requirement                                                                                                                                                                                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P7-R5  | `posthog-js` initialised in a client provider with `api_host: '/ingest'`, `ui_host` set to the PostHog app, `capture_pageview: 'history_change'`, `capture_pageleave: true`, `person_profiles: 'identified_only'`.                                                   |
| P7-R6  | A reverse proxy through `next.config.ts` rewrites: `/ingest/static/:path*` → `https://us-assets.i.posthog.com/static/:path*`, `/ingest/:path*` → `https://us.i.posthog.com/:path*` (EU equivalents if the project is on EU), plus `skipTrailingSlashRedirect: true`. |
| P7-R7  | The maintenance proxy matcher excludes `ingest/`, so analytics keep working during maintenance.                                                                                                                                                                      |
| P7-R8  | The events in §4.2 are captured through one typed helper (`track(event, props)`). No other `posthog.capture` calls exist.                                                                                                                                            |
| P7-R9  | The flags in §4.3 exist in PostHog and gate their features. Server-rendered flags are evaluated with `posthog-node` (local evaluation using `POSTHOG_PERSONAL_API_KEY`) and bootstrapped to the client, so nothing flickers.                                         |
| P7-R10 | Session replay on, with `maskAllInputs: true`, and text masking on the contact form.                                                                                                                                                                                 |
| P7-R11 | The CSP allows the PostHog hosts and Turnstile (`challenges.cloudflare.com`) only where needed.                                                                                                                                                                      |

### Live data

| ID     | Requirement                                                                                                                                                                                                                                                                                                     |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P7-R12 | **Strava**: exchange the refresh token for an access token (cached until expiry), then fetch athlete stats and the last 12 weeks of activities. Runs only (`sport_type` `Run`, `TrailRun`, `VirtualRun`). Revalidates every hour. Never requests or returns maps, polylines, start coordinates or segment data. |
| P7-R13 | **GitHub**: GraphQL `user(login).contributionsCollection.contributionCalendar`, mapped to levels 0–4. Revalidates every 6 hours.                                                                                                                                                                                |
| P7-R14 | **Spotify**: `GET /api/now-playing` route handler (revalidates every 30s) that returns the currently playing track, or the most recent one with `isPlaying: false`. The client polls every 30s while the tab is visible and stops when hidden. Podcasts and episodes are hidden.                                |
| P7-R15 | `/life/running`, `/now` and `/life` switch to ISR with the revalidate intervals above.                                                                                                                                                                                                                          |

### Contact

| ID     | Requirement                                                                                                                                                             |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P7-R16 | The form submits through a Server Action: Zod validation → honeypot field check → Turnstile verification → rate limit (3 per IP per hour) → Resend.                     |
| P7-R17 | Two emails: a notification to `CONTACT_TO_EMAIL` (reply-to set to the sender) and an auto-reply to the sender, both built with React Email in the site's style.         |
| P7-R18 | The form shows inline field errors, a pending state, and a success state ("Sent. I'll reply within a few days."). Errors say what to do next. Nothing is lost on error. |
| P7-R19 | The "Book a call" button fires `book_call_clicked` and opens `NEXT_PUBLIC_BOOKING_URL` in a new tab.                                                                    |

## 4. Technical design

### 4.1 Integration contracts

```ts
// lib/integrations/strava.ts
export async function getStravaSummary(): Promise<StravaSummary> // revalidate 3600
// lib/integrations/github.ts
export async function getContributions(login = 'francisaguilar21'): Promise<ContributionCalendar> // revalidate 21600
// lib/integrations/spotify.ts
export async function getNowPlaying(): Promise<NowPlaying> // revalidate 30
// lib/integrations/turnstile.ts
export async function verifyTurnstile(token: string, ip?: string): Promise<boolean>
// lib/integrations/resend.ts
export async function sendContactEmails(
  input: ContactInput
): Promise<{ ok: true } | { ok: false; reason: string }>
// lib/rate-limit.ts
export async function limit(key: string): Promise<{ ok: boolean; retryAfter?: number }> // Upstash, or in-memory fallback
```

Types (`StravaSummary`, `NowPlaying`, `ContributionCalendar`) are the ones defined in Phase 5 §4.2.

### 4.2 Events

| Event                     | Properties                                                             | Fired from                                    |
| ------------------------- | ---------------------------------------------------------------------- | --------------------------------------------- |
| `cta_clicked`             | `cta` (`see_work` \| `lets_talk` \| `book_call_hero` \| …), `location` | Buttons with `data-cta`                       |
| `book_call_clicked`       | `location`                                                             | `BookingCard`, hero                           |
| `contact_submitted`       | `topic`, `ok`                                                          | Server Action result (client)                 |
| `project_opened`          | `slug`, `from` (`home` \| `projects`)                                  | Project rows                                  |
| `post_read`               | `slug`, `percent` (25/50/75/100)                                       | Post page scroll observer, once per threshold |
| `theme_toggled`           | `to` (`dark` \| `light`)                                               | `ThemeToggle`                                 |
| `now_playing_clicked`     | `track`                                                                | `NowPlaying`                                  |
| `$pageview`, `$pageleave` | (automatic)                                                            | posthog-js                                    |

### 4.3 Flags

| Flag                  | Type         | Default          | Gates                                                               |
| --------------------- | ------------ | ---------------- | ------------------------------------------------------------------- |
| `is_maintenance_mode` | boolean      | off after launch | Maintenance page (Phase 0)                                          |
| `widget-strava`       | boolean      | on               | Running tile, `/life/running` Strava block, now-strip km            |
| `widget-github`       | boolean      | on               | Contribution graph                                                  |
| `widget-spotify`      | boolean      | on               | Now playing (strip, community tile, `/now`)                         |
| `motion-rich`         | boolean      | on               | Lenis, cursor, magnetic, parallax (kill switch for Core Web Vitals) |
| `hero-headline`       | multivariate | `control`        | Headline copy experiment (Phase 9)                                  |

When a widget flag is off, the widget's space collapses cleanly (no placeholder, no gap).

### 4.4 Contact flow

```
client form ──(FormData + turnstile token)──▶ sendContact (Server Action)
  1. zod parse (name 2–80, email, topic enum, message 10–4000)   → field errors
  2. honeypot "website" must be empty                              → silent success (bot)
  3. verifyTurnstile(token, ip)                                    → "Verification failed, please retry"
  4. limit(`contact:${ip}`)                                        → "Too many messages, try again in N min"
  5. sendContactEmails()                                           → generic error + mailto fallback text
  6. return { ok: true }
```

## 5. Acceptance criteria

| ID      | Criterion                                                                                                                                 |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| P7-AC1  | On the preview, the running tile, `/life/running`, the GitHub heatmap and now playing show live data, with no sample chips.               |
| P7-AC2  | With each API key removed (one at a time, on a preview), the page still renders with the fallback and a sample chip; logs show the error. |
| P7-AC3  | Turning each `widget-*` flag off hides its widget within the cache window, without a redeploy.                                            |
| P7-AC4  | PostHog Live Events shows `$pageview` and each event in §4.2 from the preview. Requests go to `/ingest`.                                  |
| P7-AC5  | With maintenance on, `/ingest/*` requests still succeed (not 503).                                                                        |
| P7-AC6  | A test message arrives in the inbox with the correct reply-to, and the auto-reply arrives at the sender.                                  |
| P7-AC7  | The 4th submission from the same IP within an hour is refused with a clear message. A filled honeypot sends nothing.                      |
| P7-AC8  | Strava responses contain no coordinates or polylines (unit test on the mapper).                                                           |
| P7-AC9  | Unit tests cover each adapter's mapper and its fallback path (mocked `fetch`). CI is green.                                               |
| P7-AC10 | No secret value appears in `.next/static` (CI grep for each server variable).                                                             |

## 6. Open questions

| Question                                                                         | Default if unanswered                                                   |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Show private Strava activities in the totals?                                    | No. The scope is `activity:read`, public activities only.               |
| Show the GitHub private contribution count?                                      | No. Public contributions only.                                          |
| Where should contact emails go?                                                  | `CONTACT_TO_EMAIL`, set by Francis in Phase 0.                          |
| Replace the maintenance flag lookup with `posthog-node` now that it's installed? | No. Keep `lib/maintenance/flag.ts` dependency-free. Revisit in Phase 9. |
