# 2026 Revamp Plan

> Status: **Ready to start** · Owner: Francis Aguilar
>
> Source of truth for _what_ we build: [`design/DESIGN.md`](./design/DESIGN.md) and
> [`design/mockup.html`](./design/mockup.html). This document covers _how_ and _in what order_.
> Each phase's details live in its `phase-N-specs/` folder (index in the [README](./README.md)).

---

## 1. Goal

Replace the 2024 starter-blog site with a personal brand site. Within one scroll, a visitor should
understand who Francis is at work and outside it, and know how to reach him. The tech stack must be
modern and easy to maintain.

### Requirements we started from

| #   | Requirement                                                                                          | Where it's handled |
| --- | ---------------------------------------------------------------------------------------------------- | ------------------ |
| 1   | Tag the current version as `v2024` so it's easy to go back                                           | Phase 0 (done)     |
| 2   | Delete all dependencies and start from a clean slate                                                 | Phase 1            |
| 3   | Delete the old setup and keep only the blog posts                                                    | Phase 1            |
| 4   | Stack: React + TypeScript, Next.js, pnpm, Husky, Commitlint, Commitizen, ESLint, Tailwind, PostHog   | Phase 2, Phase 7   |
| 5   | Show who I am professionally and what I do outside work, presented my own way                        | Phases 5–6         |
| 6   | New design and new fonts, built on the F/A logo, with an animated timeline                           | Phase 3, Phase 5   |
| 7   | While migrating, show a simple "I'm migrating the site to something better" page, toggled in PostHog | Phase 0 (done), §2 |

### Out of scope (for launch)

- CMS, comments, newsletter, site search: the 2024 site had Giscus, ConvertKit and kbar configured. None
  of them is carried over. They can come back after launch if needed.
- Internationalisation.

---

## 2. How we'll work

- **Merge straight to `main`.** There's no long-lived branch. Every phase is one or more short-lived PRs
  into `main`, each with its own Vercel preview deployment for review.
- **Maintenance mode protects production.** Once `main` starts carrying the new site, production shows
  the maintenance page ("I'm migrating the site to something better"). The PostHog feature flag
  `is_maintenance_mode` controls it, so you can turn it on or off from PostHog without a deploy (§2.1).
- **Launch = turning the flag off.** It's one switch, and turning it back on is the first rollback
  step (§9).
- **Conventional commits** from Phase 2 on (`feat:`, `fix:`, `chore:`, `docs:`…), enforced by commitlint
  and written with `pnpm commit` (Commitizen).
- **Every PR must pass** lint, typecheck, unit tests and build in CI. From Phase 3 on, it also gets a
  Vercel preview link for visual review.
- **The mockup is the visual spec.** Tokens, type, spacing and motion come from it. Where the mockup and
  `DESIGN.md` disagree, `DESIGN.md` wins.

### 2.1 Maintenance mode

Built in Phase 0 against the 2024 codebase, and carried into the new codebase in Phase 2. Full spec:
[Phase 0 specs §4.1](./phase-0-specs/phase-0.specs.md#41-maintenance-mode-built-in-pr-72).

| Piece                     | What it does                                                                                                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `middleware.ts`           | Runs on every page request (static files, `/api`, `robots.txt`, `sitemap.xml` and feeds are skipped)                                                                                           |
| `lib/maintenance/flag.ts` | Asks PostHog's `/flags` endpoint for `is_maintenance_mode`. Caches the answer for 30s per server instance, with a 1.5s timeout. **Fails open**: if PostHog can't be reached, the site stays up |
| `lib/maintenance/page.ts` | Self-contained HTML page (no app layout, fonts or scripts). Served with **503 + `Retry-After`** so search engines treat the outage as temporary                                                |

**Controls**

| Control                            | How to use it                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| PostHog flag `is_maintenance_mode` | Release condition **100% of all users**. On = maintenance page, off = site       |
| `MAINTENANCE_MODE=on\|off` (env)   | Emergency override that wins over PostHog (needs a redeploy)                     |
| `MAINTENANCE_BYPASS_TOKEN` (env)   | Visit `/?preview=<token>` to see the real site in production for 7 days (cookie) |
| `MAINTENANCE_ALLOWED_PATHS` (env)  | Path prefixes that stay public during maintenance, e.g. `/writings,/rss.xml`     |

**Sequence**

1. Ship maintenance mode to the 2024 site. Create the flag, off.
2. Turn the flag **on** just before merging the Phase 1–2 PR.
3. Keep it on through Phases 3–7. Once blog parity lands (Phase 4), set
   `MAINTENANCE_ALLOWED_PATHS=/writings,/rss.xml` so the posts are back online early.
4. Turn it **off** at launch (Phase 8).

Phase 7 adds `/ingest` (the PostHog proxy) to the skipped paths, so analytics keep working during
maintenance.

---

## 3. Phases at a glance

| Phase | Name                        | Output                                                                                                  | Effort\* |
| ----- | --------------------------- | ------------------------------------------------------------------------------------------------------- | -------- |
| 0     | Prep                        | `v2024` tag, maintenance mode, accounts & keys, content requests sent                                   | 0.5 day  |
| 1–2   | Clean slate + scaffold      | Old setup removed; blank Next.js app with pnpm, linting, commit hooks, CI and maintenance mode (one PR) | 1.5 days |
| 3     | Design system               | Tokens, fonts, logo, header and footer, motion pieces                                                   | 2–3 days |
| 4     | Content layer & blog parity | Blog fully working on the new stack, same URLs                                                          | 2 days   |
| 5     | Homepage                    | All 11 homepage sections from the mockup                                                                | 3–4 days |
| 6     | Inner pages                 | `/work`, `/projects`, `/life/*`, `/now`, `/uses`, `/contact`                                            | 3–4 days |
| 7     | Integrations                | PostHog, Strava, GitHub, Spotify, contact form                                                          | 2–3 days |
| 8     | QA & launch                 | Accessibility, performance and SEO checks, launch                                                       | 1–2 days |
| 9     | Post-launch                 | Monitoring, dependency bot, release automation, launch post                                             | ongoing  |

\* Focused working days, not counting time spent waiting on content (§11). That's about 3–4 weeks
of evenings and weekends.

---

## 4. Phase details

Each phase has its own folder with a **specs** file (scope, requirements, technical design, acceptance
criteria) and a **tasks** file (ordered checklist, split into PRs). See the [README](./README.md) for
the conventions.

| Phase | Name                        | Delivers                                                                                                       | Specs · Tasks                                                                         |
| ----- | --------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 0     | Prep                        | `v2024` tag, maintenance mode, branch protection, credentials, content request                                 | [specs](./phase-0-specs/phase-0.specs.md) · [tasks](./phase-0-specs/phase-0.tasks.md) |
| 1     | Clean slate                 | 2024 setup and dependencies removed; posts, images, logos, maintenance mode and docs kept                      | [specs](./phase-1-specs/phase-1.specs.md) · [tasks](./phase-1-specs/phase-1.tasks.md) |
| 2     | Scaffold & tooling          | Next.js 16, pnpm, TypeScript, Tailwind, ESLint, Prettier, Husky, commitlint, Commitizen, tests, CI, `proxy.ts` | [specs](./phase-2-specs/phase-2.specs.md) · [tasks](./phase-2-specs/phase-2.tasks.md) |
| 3     | Design system               | Tokens, fonts, theme, logo, header and footer, UI primitives, motion, `/styleguide`                            | [specs](./phase-3-specs/phase-3.specs.md) · [tasks](./phase-3-specs/phase-3.tasks.md) |
| 4     | Content layer & blog parity | Velite + schemas, blog at the same URLs, RSS, sitemap, OG images, 2024 redirects                               | [specs](./phase-4-specs/phase-4.specs.md) · [tasks](./phase-4-specs/phase-4.tasks.md) |
| 5     | Homepage                    | All homepage sections from the mockup, with fallbacks and the draft policy                                     | [specs](./phase-5-specs/phase-5.specs.md) · [tasks](./phase-5-specs/phase-5.tasks.md) |
| 6     | Inner pages                 | `/work`, `/projects`, `/life/*`, `/now`, `/uses`, `/contact`, 404                                              | [specs](./phase-6-specs/phase-6.specs.md) · [tasks](./phase-6-specs/phase-6.tasks.md) |
| 7     | Integrations                | Env validation, PostHog (events, flags, `/ingest`), Strava, GitHub, Spotify, contact delivery                  | [specs](./phase-7-specs/phase-7.specs.md) · [tasks](./phase-7-specs/phase-7.tasks.md) |
| 8     | QA & launch                 | Accessibility, performance, e2e and draft gates in CI; launch runbook; rollback rehearsal                      | [specs](./phase-8-specs/phase-8.specs.md) · [tasks](./phase-8-specs/phase-8.tasks.md) |
| 9     | Post-launch                 | Monitoring, Renovate, release-please, headline experiment, launch post, long-term maintenance switch           | [specs](./phase-9-specs/phase-9.specs.md) · [tasks](./phase-9-specs/phase-9.tasks.md) |

---

## 5. Target project structure

```
.
├─ app/
│  ├─ (site)/                  page routes: page.tsx, work/, projects/, life/, blog/, now/, uses/, contact/
│  ├─ api/now-playing/route.ts
│  ├─ ingest/                  (rewrites only, see next.config.ts)
│  ├─ layout.tsx · globals.css · not-found.tsx
│  ├─ sitemap.ts · robots.ts · rss.xml/route.ts · opengraph-image.tsx
│  └─ styleguide/              development only
├─ components/
│  ├─ ui/                      Button, Tag, Eyebrow, SlashDivider, Logo, DraftChip
│  ├─ layout/                  SiteHeader, SiteFooter, Container, Section, ThemeToggle
│  ├─ motion/                  SmoothScroll, Cursor, Magnetic, Reveal, Parallax, SlashWipe
│  ├─ home/                    Hero, NowStrip, Timeline, ProjectList, LifeGrid, …
│  ├─ widgets/                 StravaCard, NowPlaying, ContributionGraph
│  └─ mdx/                     Callout, Figure, Gallery, Strava
├─ content/
│  ├─ blog/*.mdx · projects/*.mdx · now.mdx
│  └─ experience.ts · certifications.ts · recommendations.ts · races.ts · talks.ts · gallery.ts · uses.ts · site.ts
├─ lib/
│  ├─ integrations/            strava.ts · github.ts · spotify.ts · resend.ts · turnstile.ts
│  ├─ analytics/               posthog-client.tsx · posthog-server.ts · events.ts
│  └─ env.ts · utils.ts
├─ public/static/              images (2024 paths kept), favicons
├─ tests/                      unit/ · e2e/
├─ docs/2026-revamp-specs/     README.md · 2026-revamp-plan.md · design/ · phase-0-specs/ … phase-9-specs/
└─ velite.config.ts · next.config.ts · eslint.config.mjs · prettier.config.mjs · commitlint.config.ts
```

---

## 6. Dependencies

Versions current as of October 2026. Install the latest at scaffold time and pin them with the lockfile.

| Package                                                                                                          | Purpose                   | Phase |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------- | ----- |
| `next` (16.x), `react`, `react-dom` (19.x)                                                                       | Framework                 | 2     |
| `typescript`                                                                                                     | Types (see risk R1)       | 2     |
| `tailwindcss` (4.x), `@tailwindcss/typography`                                                                   | Styling                   | 2–3   |
| `eslint`, `eslint-config-next`, `typescript-eslint`, `eslint-plugin-jsx-a11y`                                    | Lint                      | 2     |
| `prettier`, `prettier-plugin-tailwindcss`                                                                        | Format                    | 2     |
| `husky`, `lint-staged`                                                                                           | Git hooks                 | 2     |
| `@commitlint/cli`, `@commitlint/config-conventional`                                                             | Commit message linting    | 2     |
| `commitizen`, `cz-git`                                                                                           | Guided commit prompt      | 2     |
| `vitest`, `@testing-library/*`, `@playwright/test`                                                               | Tests                     | 2     |
| `next-themes`                                                                                                    | Theme switching           | 3     |
| `motion`, `lenis`                                                                                                | Animation, smooth scroll  | 3     |
| `lucide-react`, `simple-icons`, `clsx`, `tailwind-merge`                                                         | Icons, class utilities    | 3     |
| `velite`, `rehype-pretty-code`, `shiki`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `reading-time` | Content                   | 4     |
| `posthog-js`, `posthog-node`                                                                                     | Analytics & feature flags | 7     |
| `resend`, `@react-email/components`                                                                              | Contact email             | 7     |
| `@marsidev/react-turnstile`                                                                                      | Spam protection           | 7     |
| `zod`, `@t3-oss/env-nextjs`                                                                                      | Validation                | 4–7   |
| `@upstash/ratelimit`, `@upstash/redis`                                                                           | Rate limit (optional)     | 7     |

---

## 7. Environment variables

| Variable                                                  | Scope  | Phase | Notes                                                                                                                                                  |
| --------------------------------------------------------- | ------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                                    | public | 4     | `https://francisaguilar.co`                                                                                                                            |
| `NEXT_PUBLIC_POSTHOG_KEY`                                 | public | 0     | Project API key                                                                                                                                        |
| `NEXT_PUBLIC_POSTHOG_HOST`                                | public | 0     | PostHog API host. Defaults to `https://us.i.posthog.com`. The browser client uses `/ingest` (proxied) from Phase 7                                     |
| `MAINTENANCE_MODE`                                        | server | 0     | Optional override: `on` or `off`                                                                                                                       |
| `MAINTENANCE_BYPASS_TOKEN`                                | server | 0     | Long random string, used in `/?preview=<token>`                                                                                                        |
| `MAINTENANCE_ALLOWED_PATHS`                               | server | 0     | e.g. `/writings,/rss.xml` after Phase 4                                                                                                                |
| `POSTHOG_PERSONAL_API_KEY`                                | server | 7     | Only for server-side flag evaluation                                                                                                                   |
| `STRAVA_CLIENT_ID` / `_SECRET` / `_REFRESH_TOKEN`         | server | 7     |                                                                                                                                                        |
| `SPOTIFY_CLIENT_ID` / `_SECRET` / `_REFRESH_TOKEN`        | server | 7     |                                                                                                                                                        |
| `GITHUB_TOKEN`                                            | server | 7     | Read-only                                                                                                                                              |
| `RESEND_API_KEY`                                          | server | 7     |                                                                                                                                                        |
| `CONTACT_TO_EMAIL`                                        | server | 7     | Where messages go                                                                                                                                      |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | mixed  | 7     |                                                                                                                                                        |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN`                       | server | 7     | Optional                                                                                                                                               |
| `NEXT_PUBLIC_BOOKING_URL`                                 | public | 5     | Google Calendar appointment schedule. Unset: the "Book a call" button points at the contact form. Inlined at build time, so redeploy after changing it |
| `HIDE_DRAFTS`                                             | server | 4     | `1` hides `draft: true` content on previews and locally. Production (`VERCEL_ENV=production`) always hides it                                          |

Commit a `.env.example` with every key and no values.

---

## 8. Risks & mitigations

| #   | Risk                                                                            | Mitigation                                                                                                                                                                                                              |
| --- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | TypeScript 7 (native) may not yet be supported by `typescript-eslint` or Velite | At scaffold time, check `typescript-eslint`'s supported range. Pin TS to the newest supported version if needed                                                                                                         |
| R2  | Velite is still 0.x                                                             | Keep its use simple (collections + MDX). Swap to `@next/mdx` + `gray-matter` if it blocks                                                                                                                               |
| R3  | Heavy motion hurts performance or accessibility                                 | Load motion libraries when the browser is idle; `motion-rich` kill-switch flag; reduced-motion path tested in CI                                                                                                        |
| R4  | Live APIs rate-limit or break                                                   | Server-side caching, fallback data, a flag per widget                                                                                                                                                                   |
| R5  | Strava data reveals locations                                                   | Never request or render maps or GPS data; only aggregate stats                                                                                                                                                          |
| R6  | Losing search rankings for existing posts                                       | Same slugs, 301s for old routes, submit the sitemap, watch Search Console. Maintenance serves 503 (temporary), but **weeks** of 503s can still drop pages from search. Reach blog parity early and allow `/blog` (§2.1) |
| R9  | Maintenance check adds latency to every request                                 | Cached for 30 seconds per server instance, 1.5s timeout, fails open. Once the site is launched and stable, remove the middleware or switch to PostHog local evaluation                                                  |
| R7  | Content isn't ready at launch                                                   | `pnpm check:drafts` gates the launch PR (Phase 8). Can launch with fewer projects, recommendations or certifications rather than placeholders                                                                           |
| R8  | Scope creep                                                                     | Anything not in DESIGN.md goes to Phase 9 or later                                                                                                                                                                      |

---

## 9. Rollback

- **Before launch**: visitors only see the maintenance page, so there's nothing to roll back. A bad merge
  only affects preview deployments and the bypass link.
- **After launch**:
  1. Turn `is_maintenance_mode` back **on**. This takes effect in about 30 seconds, without a deploy.
  2. Fix forward, or use Vercel's Instant Rollback to an earlier deployment of the new site.
  3. If the 2024 site has to come back, redeploy `0398fc8` (the security-patched 2024 site), not
     `v2024`. Its deployment from before Phase 1 can also be promoted in Vercel.

---

## 10. Definition of done (launch)

- [ ] Every route in DESIGN.md §4 is live and in the sitemap.
- [ ] The 3 existing blog URLs work unchanged, and old routes redirect.
- [ ] The homepage matches the mockup in both themes at desktop and phone widths.
- [ ] Strava, GitHub and Spotify show live data. Each one can be turned off with a PostHog flag.
- [ ] The contact form delivers email, and the booking link works.
- [ ] PostHog records page views and the events in [Phase 7 specs §4.2](./phase-7-specs/phase-7.specs.md#42-events).
- [ ] Lighthouse and accessibility budgets are met, and CI is green.
- [ ] No draft or placeholder content left in production.
- [ ] `is_maintenance_mode` is off, and `MAINTENANCE_ALLOWED_PATHS` is cleared.
- [ ] Husky, commitlint and Commitizen are enforced. The README explains how to run the site and add content.

---

## 11. Content checklist (Francis)

Needed by the phase shown. Placeholders hold the spot until each item arrives.

| Item                                                                                                        | Format               | Needed by |
| ----------------------------------------------------------------------------------------------------------- | -------------------- | --------- |
| Google Calendar appointment schedule URL                                                                    | URL                  | Phase 5   |
| Contact email for form delivery                                                                             | Email                | Phase 7   |
| Headline: keep _"I build software & run long distances."_ or pick another                                   | Text                 | Phase 5   |
| Experience: company, title, start/end (month + year), one-line impact, whether to name the current employer | List                 | Phase 5   |
| Projects: 3–6 projects with year, role, one-line outcome, a metric, stack, cover image, links               | List + images        | Phase 5   |
| Fitscovery story (founder → CTO → exit), 500–1,500 words                                                    | Text or rough notes  | Phase 6   |
| Certifications: name, issuer, year, verify link                                                             | List                 | Phase 5   |
| Recommendations: 2–4 quotes, with permission to show each name, role and photo                              | Text + photos        | Phase 5   |
| Races: name, date, distance, time, PR?, runner or pacer, results link                                       | List / Strava export | Phase 6   |
| Pacing: start year, groups or paces led                                                                     | Text                 | Phase 5   |
| Talks / community: title, event, date, slides/video links                                                   | List                 | Phase 6   |
| Photos: new portrait (optional) + 10–20 gallery shots with captions                                         | Images               | Phase 6   |
| `/now`: current training focus, reading, building                                                           | Text                 | Phase 5   |
| `/uses`: stack, tools, gear (shoes, watch)                                                                  | List                 | Phase 6   |
| Résumé PDF                                                                                                  | PDF                  | Phase 6   |
