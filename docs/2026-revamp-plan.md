# 2026 Revamp Plan

> Status: **Ready to start** · Owner: Francis Aguilar
>
> Source of truth for _what_ we build: [`design/DESIGN.md`](./design/DESIGN.md) and
> [`design/mockup.html`](./design/mockup.html). This document covers _how_ and _in what order_.

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

Built in Phase 0 against the 2024 codebase, and carried into the new codebase in Phase 2.

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
| `MAINTENANCE_ALLOWED_PATHS` (env)  | Path prefixes that stay public during maintenance, e.g. `/blog,/rss.xml`         |

**Sequence**

1. Ship maintenance mode to the 2024 site. Create the flag, off.
2. Turn the flag **on** just before merging the Phase 1–2 PR.
3. Keep it on through Phases 3–7. Once blog parity lands (Phase 4), set
   `MAINTENANCE_ALLOWED_PATHS=/blog,/rss.xml` so the posts are back online early.
4. Turn it **off** at launch (Phase 8).

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

### Phase 0: Prep

- [x] Tag the 2024 site: `v2024` → `05edb13`.
  - Note: `0398fc8` (the Next.js / React Server Components security fix) landed on `main` _after_
    the tag. To bring the 2024 site back, deploy `0398fc8`, not `v2024`, so you don't reintroduce the
    vulnerability. Optional: add `git tag -a v2024.1 0398fc8 -m "v2024 + security fix"`.
- [x] Maintenance mode built: `middleware.ts` and `lib/maintenance/` (§2.1).
- [ ] In PostHog, create the flag `is_maintenance_mode`. Release condition: 100% of all users. Leave it **off**.
- [ ] In Vercel (production), set `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` (if the project is
      on EU cloud) and `MAINTENANCE_BYPASS_TOKEN`. Then check the toggle: flag on → 503 page, flag off → site.
- [ ] Protect `main`: PRs only, CI required. Check that Vercel builds preview deployments for PRs.
- [ ] Create accounts and keys (they go into Vercel env vars, see §7):
  - [ ] PostHog project (US or EU region)
  - [ ] Strava API application → one-time OAuth to get a refresh token with `activity:read`
  - [ ] Spotify developer app → one-time OAuth to get a refresh token with
        `user-read-currently-playing user-read-recently-played`
  - [ ] GitHub fine-grained token (read-only, public data)
  - [ ] Resend account + verify the sending domain `francisaguilar.co` (DNS records)
  - [ ] Cloudflare Turnstile site + secret key
  - [ ] Google Calendar appointment schedule (30 min, video call) → copy the booking URL
  - [ ] Upstash Redis (optional, for rate limiting the contact form)
- [ ] Start collecting the content listed in §11. It takes the longest, so start it now.

### Phase 1: Clean slate

Ships **in the same PR as Phase 2**, because merging to `main` deploys to production and the repo must
always build. Turn `is_maintenance_mode` **on** before merging it.

**Keep**

| Path                                        | Why                                                      |
| ------------------------------------------- | -------------------------------------------------------- |
| `data/blog/*.mdx`                           | The posts. Moved to `content/blog/` in Phase 4           |
| `public/static/images/2301/`, `2401/`       | Images used in the posts. **Paths stay the same**        |
| `public/static/images/logo-*.png`           | The 4 logo variants                                      |
| `public/static/images/fara-dp.webp`         | Portrait                                                 |
| `public/static/images/fa-social-banner.png` | Fallback social image until generated OG images ship     |
| `public/static/favicons/`                   | Kept until Phase 3 regenerates them from the SVG logo    |
| `docs/design/`, `docs/LICENSE`, this file   | Docs                                                     |
| `.github/ISSUE_TEMPLATE/`                   | Still useful                                             |
| `middleware.ts`, `lib/maintenance/`         | Maintenance mode must keep working through the migration |
| `.gitattributes`, `.gitignore`              | `.gitignore` gets rewritten in Phase 2                   |

**Delete**: everything else. That includes `app/`, `components/`, `layouts/`, `css/`, `scripts/`,
`data/*.ts`, `data/*.js`, `data/authors/`, `data/references-data.bib`, `data/logo.svg`,
`contentlayer.config.ts`, `next.config.js`, `package.json`, `yarn.lock`, `.yarnrc.yml`, `.eslintrc.js`,
`.eslintignore`, `prettier.config.js`, `postcss.config.js`, `jsconfig.json`, `tsconfig.json`,
`next-env.d.ts`, `.husky/`, `.env.example`, `renovate.json`, `.vscode/`, `docs/Troubleshooting.md`,
and the old `README.md` (rewritten in Phase 2).

**Done when**:

- `git ls-files` shows only the "keep" paths plus the Phase 2 scaffold.
- With the flag on, production serves the maintenance page.

### Phase 2: Scaffold & tooling

**Runtime**: current Node LTS, pinned in `.nvmrc` and `engines.node`. pnpm is pinned through
`packageManager` and enabled with `corepack enable`.

```bash
pnpm create next-app@latest . --ts --tailwind --eslint --app --turbopack --import-alias "@/*" --use-pnpm --no-src-dir
```

**Dev tooling**

```bash
pnpm add -D prettier prettier-plugin-tailwindcss \
  husky lint-staged @commitlint/cli @commitlint/config-conventional \
  commitizen cz-git \
  eslint-plugin-jsx-a11y \
  vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom \
  @playwright/test
```

| File                                 | Contents                                                                                        |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `eslint.config.mjs`                  | Flat config: `next/core-web-vitals`, `next/typescript`, `jsx-a11y/recommended`, `prettier` last |
| `prettier.config.mjs`                | `semi: false`, `singleQuote: true`, `printWidth: 100`, tailwind plugin                          |
| `commitlint.config.ts`               | `extends: ['@commitlint/config-conventional']`, scopes enum (see below)                         |
| `package.json` → `config.commitizen` | `{ "path": "node_modules/cz-git" }`                                                             |
| `.husky/pre-commit`                  | `pnpm lint-staged`                                                                              |
| `.husky/commit-msg`                  | `pnpm commitlint --edit "$1"`                                                                   |
| `lint-staged` (package.json)         | `*.{ts,tsx}` → `eslint --fix`, `prettier --write`; `*.{md,mdx,json,css}` → `prettier --write`   |
| `tsconfig.json`                      | `strict`, `noUncheckedIndexedAccess`, path alias `@/*`                                          |
| `.github/workflows/ci.yml`           | pnpm install (cached) → `lint` → `typecheck` → `test` → `build`                                 |
| `.github/pull_request_template.md`   | Summary · Screenshots · Checklist                                                               |
| `README.md`                          | What the site is, how to run it, env vars, how to write a post                                  |

**Maintenance mode on Next.js 16**: Next.js 16 renamed `middleware.ts` to `proxy.ts`, with the exported
function named `proxy`. Rename the file and the function, and keep `lib/maintenance/` as is.

**Commit scopes**: `design`, `blog`, `home`, `work`, `projects`, `life`, `now`, `uses`, `contact`,
`analytics`, `integrations`, `deps`, `ci`, `docs`.

**Scripts**

```jsonc
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "format": "prettier --write .",
  "test": "vitest run",
  "test:e2e": "playwright test",
  "commit": "cz",
  "prepare": "husky",
}
```

**Done when**:

- `pnpm i && pnpm build` works on a clean clone.
- The maintenance page is served while the flag is on, and the bypass link works.
- A bad commit message is rejected.
- `pnpm commit` opens the cz-git prompt.
- CI is green on the PR.

### Phase 3: Design system

Implements DESIGN.md §3 and §7, using the mockup's CSS as reference.

- [ ] `app/globals.css`: tokens from the mockup's `:root` (dark is the default and wins regardless of
      OS setting, light under `[data-theme="light"]`). Map them in Tailwind `@theme` (DESIGN.md §3.3).
- [ ] Fonts through `next/font/google`: Space Grotesk, Inter, JetBrains Mono as CSS variables.
- [ ] `next-themes` with `attribute="data-theme"`, `defaultTheme="dark"`, `enableSystem={false}`.
- [ ] `<Logo />`: F/A as an SVG using `currentColor`. Favicons, `icon.svg` and `apple-icon.png`
      regenerated from it (rose-on-black).
- [ ] Layout: `<SiteHeader />` (sticky, hides when scrolling down), `<SiteFooter />` (outlined wordmark),
      `<Container />`, `<Section eyebrow="/work" />`, `<Eyebrow />`, `<SlashDivider />`, `<Button />`
      (solid / ghost / sm), `<Tag />`, `<DraftChip />` (development only).
- [ ] Motion pieces (`components/motion/`): `<SmoothScroll />` (Lenis), `<Cursor />`, `<Magnetic />`,
      `<Reveal />`, `<Parallax />`, `<SlashWipe />` (theme toggle + route transitions via the View
      Transitions API). All of them are skipped when the user prefers reduced motion or uses touch.
- [ ] A `/styleguide` page, available in development only, that shows the tokens, type scale and components.

```bash
pnpm add next-themes motion lenis lucide-react clsx tailwind-merge
pnpm add -D @tailwindcss/typography
```

**Done when**:

- `/styleguide` matches the mockup in both themes.
- Toggling the theme plays the slash wipe.
- With reduced motion on, nothing animates except cross-fades.

### Phase 4: Content layer & blog parity

Implements DESIGN.md §12.

- [ ] Add **Velite** (`velite.config.ts`). Set up these collections with Zod schemas:
      `posts`, `projects`, `now`. Also typed data files: `experience`, `certifications`,
      `recommendations`, `races`, `talks`, `gallery`, `uses`, `site`.
- [ ] Move `data/blog/*.mdx` to `content/blog/`. **The slug is the filename without `.mdx`**, so
      `231221-hello-world`, `240108-posthog-over-google-analytics` and `240112-a-commitment-to-change`
      keep their URLs.
- [ ] Rename the template to `content/blog/_template.mdx` (excluded from the build). Fix its image path
      (`/public/static/...` should be `/static/...`).
- [ ] Post page `/blog/[slug]`: title, date, reading time, tags, cover image, prose styling,
      **rehype-pretty-code + Shiki** (dual themes), heading anchors, previous/next links.
- [ ] `/blog` index and `/blog/tags/[tag]`.
- [ ] Generate `rss.xml`, `sitemap.ts` and `robots.ts`.
- [ ] Generated OG images with `next/og` (`opengraph-image.tsx` per route): F/A mark, title, rose slash.
- [ ] Redirects in `next.config.ts`: `/tags/:tag → /blog/tags/:tag`, `/blog/page/:n → /blog`,
      `/about → /`, `/feed.xml → /rss.xml`.

```bash
pnpm add velite rehype-pretty-code shiki rehype-slug rehype-autolink-headings remark-gfm reading-time
```

Once this phase is merged, set `MAINTENANCE_ALLOWED_PATHS=/blog,/rss.xml` in Vercel so the posts are
back online while the rest of the site is built.

**Done when**:

- The 3 existing post URLs return 200 with the same content.
- All of their images load.
- Old URLs redirect.
- The RSS feed validates.

### Phase 5: Homepage

Implements DESIGN.md §5. Build each section from the mockup as its own component under
`components/home/`.

| Section          | Component           | Data source                               | Notes                                                  |
| ---------------- | ------------------- | ----------------------------------------- | ------------------------------------------------------ |
| Hero             | `Hero`              | `site.ts`                                 | Line-by-line reveal, underline draw, portrait parallax |
| Now strip        | `NowStrip`          | `now.mdx` + Spotify + Strava              | Marquee, pauses on hover                               |
| `/work` timeline | `Timeline`          | `experience.ts`, latest 6                 | DESIGN.md §7.2. Work = filled dot, life = ring         |
| `/projects`      | `ProjectList`       | `projects/*.mdx` where `featured`         | Image preview follows the cursor                       |
| `/life`          | `LifeGrid`          | Strava, `talks.ts`, `gallery.ts`          | Running, community, gallery and building tiles         |
| `/uses`          | `StackGrid`         | `uses.ts`                                 | 6 groups                                               |
| `/proof`         | `Proof`             | `recommendations.ts`, `certifications.ts` | Quote carousel + certification list                    |
| `/writing`       | `LatestPosts`       | `posts`, latest 3                         |                                                        |
| `/github`        | `ContributionGraph` | GitHub GraphQL                            | Rose scale                                             |
| `/contact`       | `ContactSection`    | `site.ts`                                 | Form + booking card                                    |

Until the real data and integrations land (Phase 7), sections render placeholder data marked with
`<DraftChip />`. They never render empty.

**Done when**:

- The homepage matches the mockup at 1440px and at 390px, in both themes.
- Lighthouse mobile performance is at least 90 before optimisation.

### Phase 6: Inner pages

Implements DESIGN.md §4.

- [ ] `/work`: full timeline, certifications, all recommendations, link to résumé PDF.
- [ ] `/projects` and `/projects/[slug]`: MDX case study (problem → role → what we built →
      outcome → stack).
- [ ] `/life`: hub page with 4 cards.
  - [ ] `/life/running`: Strava stats, race log table (sortable, PRs highlighted), pacing history.
  - [ ] `/life/community`: talks and events list.
  - [ ] `/life/gallery`: masonry layout, lightbox, filter by tag, blur placeholders.
  - [ ] `/life/building`: the Fitscovery story (long-form MDX).
- [ ] `/now`: from `now.mdx` with an "updated on" date, plus live Strava and Spotify.
- [ ] `/uses`: full stack, tools and gear.
- [ ] `/contact`: full-page form and booking link.
- [ ] `not-found.tsx`: rose-on-black F/A, "This path doesn't exist", links back.

**Done when** every route in DESIGN.md §4 renders, is in the sitemap, and has its own OG image.

### Phase 7: Integrations

Implements DESIGN.md §8–§10. Each integration lives in `lib/integrations/<name>.ts`. Each one exports a
typed function, runs only on the server, and returns **fallback data** if it fails.

- [ ] **PostHog**
  - Set up `posthog-js` in a client provider and `posthog-node` for feature flags on the server.
  - Add a reverse proxy: rewrites `/ingest/static/:path*` and `/ingest/:path*`, with
    `skipTrailingSlashRedirect: true`.
  - Track page views and leaves. Add the events from DESIGN.md §10 (`cta_clicked`, `book_call_clicked`,
    `contact_submitted`, `project_opened`, `post_read`, `theme_toggled`, `now_playing_clicked`).
  - Add the flags `widget-strava`, `widget-github`, `widget-spotify`, `hero-headline` and `motion-rich`.
    (`is_maintenance_mode` already exists from Phase 0.)
  - Turn on session replay with all inputs masked.
- [ ] **Strava**: refresh-token exchange, then fetch activities and stats. Runs only. Revalidates hourly.
      No maps.
- [ ] **GitHub**: GraphQL `contributionCalendar`. Revalidates every 6 hours.
- [ ] **Spotify**: `/api/now-playing` route handler (revalidates every 30 seconds). The client polls every
      30 seconds while the tab is visible. Shows the recently played track when nothing is playing.
- [ ] **Contact**: Server Action → Zod validation → honeypot check → Turnstile verify → rate limit
      (3 per hour per IP) → send with Resend (to Francis, plus an auto-reply built with React Email).
- [ ] **Env validation** with `@t3-oss/env-nextjs`. The build fails if a required variable is missing.

```bash
pnpm add posthog-js posthog-node resend @react-email/components @marsidev/react-turnstile zod @t3-oss/env-nextjs
pnpm add @upstash/ratelimit @upstash/redis   # optional
```

**Done when**:

- Each widget shows live data on the preview deployment.
- Turning off a flag hides its widget without a redeploy.
- A test message arrives in the inbox.
- PostHog shows the events.

### Phase 8: QA & launch

- [ ] **Accessibility**: axe has no violations. The whole site works by keyboard. Focus is visible.
      There's a skip link. All images have alt text. Color contrast is checked in both themes.
- [ ] **Performance budgets** (enforced by Lighthouse CI on PRs): performance ≥ 95 on mobile;
      accessibility, SEO and best practices = 100; LCP < 2.0s; CLS < 0.05; INP < 150ms;
      home route JS < 120kB gzipped.
- [ ] **Tests**:
  - Vitest for the integration adapters (with mocked APIs) and content schemas.
  - Playwright smoke tests: every route returns 200, theme toggle, contact form happy path,
    and redirects.
- [ ] **Browsers**: Safari iOS, Chrome Android, desktop Safari, Chrome and Firefox. Check
      reduced-motion mode.
- [ ] **Content**: proofread, remove every `<DraftChip />` (the build fails if any is left in production).
- [ ] **SEO**:
  - Canonical URLs, meta descriptions, OG images.
  - Submit the new sitemap in Google Search Console.
  - Check that old URLs return 200 or 301.
- [ ] **Launch**:
  1. Run the smoke tests against production with the bypass cookie.
  2. Turn `is_maintenance_mode` **off** in PostHog. The site is live within about 30 seconds (the flag cache).
  3. Clear `MAINTENANCE_ALLOWED_PATHS`.
  4. Tag `v2026.0.0`.

### Phase 9: Post-launch

- [ ] Watch PostHog and Vercel Speed Insights for the first week.
- [ ] Turn Renovate back on: grouped weekly, auto-merge for patch updates, and minor/major updates
      reviewed by hand.
- [ ] Add release-please for automatic changelogs and version tags.
- [ ] Start the `hero-headline` A/B test.
- [ ] Write a blog post about the revamp, using this plan and the design doc as material.

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
├─ docs/                       design/ · 2026-revamp-plan.md
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

| Variable                                                  | Scope  | Phase | Notes                                                                                                              |
| --------------------------------------------------------- | ------ | ----- | ------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                                    | public | 4     | `https://francisaguilar.co`                                                                                        |
| `NEXT_PUBLIC_POSTHOG_KEY`                                 | public | 0     | Project API key                                                                                                    |
| `NEXT_PUBLIC_POSTHOG_HOST`                                | public | 0     | PostHog API host. Defaults to `https://us.i.posthog.com`. The browser client uses `/ingest` (proxied) from Phase 7 |
| `MAINTENANCE_MODE`                                        | server | 0     | Optional override: `on` or `off`                                                                                   |
| `MAINTENANCE_BYPASS_TOKEN`                                | server | 0     | Long random string, used in `/?preview=<token>`                                                                    |
| `MAINTENANCE_ALLOWED_PATHS`                               | server | 0     | e.g. `/blog,/rss.xml` after Phase 4                                                                                |
| `POSTHOG_PERSONAL_API_KEY`                                | server | 7     | Only for server-side flag evaluation                                                                               |
| `STRAVA_CLIENT_ID` / `_SECRET` / `_REFRESH_TOKEN`         | server | 7     |                                                                                                                    |
| `SPOTIFY_CLIENT_ID` / `_SECRET` / `_REFRESH_TOKEN`        | server | 7     |                                                                                                                    |
| `GITHUB_TOKEN`                                            | server | 7     | Read-only                                                                                                          |
| `RESEND_API_KEY`                                          | server | 7     |                                                                                                                    |
| `CONTACT_TO_EMAIL`                                        | server | 7     | Where messages go                                                                                                  |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | mixed  | 7     |                                                                                                                    |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN`                       | server | 7     | Optional                                                                                                           |
| `NEXT_PUBLIC_BOOKING_URL`                                 | public | 5     | Google Calendar appointment schedule                                                                               |

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
| R7  | Content isn't ready at launch                                                   | `DraftChip` blocks production builds. Can launch with fewer projects, recommendations or certifications rather than placeholders                                                                                        |
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
- [ ] PostHog records page views and the events in §4 Phase 7.
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
