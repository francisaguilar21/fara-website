# francisaguilar.co — 2026 Redesign

> Status: **Draft for review** · Owner: Francis Aguilar · Previous version archived as git tag `v2024`
>
> Companion mockup: [`mockup.html`](./mockup.html) (homepage, dark default + light toggle). Hosted preview: https://claude.ai/artifact/2dpnk3Dp4W5ZdF724TjVNQ

---

## 1. Why we're doing this

The 2024 site is a lightly customised Tailwind Next.js Starter Blog. It works as a blog. It does not
work as a personal brand: there is no work history, no projects, and nothing about running, community or
the Fitscovery story. Two "Coming Soon" links sit in the nav.

**The new site has one job: within one scroll, a visitor understands who Francis is at work and outside
of it, and has an obvious way to reach him.**

### Audiences (in priority order)

| Audience                         | What they need                                                    | Where they find it              |
| -------------------------------- | ----------------------------------------------------------------- | ------------------------------- |
| Recruiters / hiring managers     | Role, seniority, timeline, stack, proof (projects, recs, certs)   | Hero → Timeline → Projects      |
| Founders / potential clients     | Founder credibility, how to book time                             | Entrepreneurship → Contact      |
| Running & tech community         | Races, pacing, talks, writing                                     | Beyond work → Writing → /now    |
| Francis himself                  | A place that is easy to update (MDX + content files, no CMS)      | `content/`                      |

### Inspiration (taken as reference, not copied)

- **bryllim.com**: the breadth of content (experience, stack, certifications, recommendations,
  community, gallery). We keep the *coverage* and present it with a different voice and structure.
- **tim-gesemann.dev**: a timeline that animates as you scroll. We do our own version with a rose line
  that draws itself (see §7.2).

---

## 2. Decisions so far

| Topic            | Decision                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------ |
| Aesthetic        | **Editorial, bold type.** Mostly black & white, rose `#F43F5E` used sparingly               |
| Theme            | **Dark by default**, light toggle (`next-themes`, persisted)                               |
| Fonts            | **Space Grotesk** (display) · **Inter** (body) · **JetBrains Mono** (labels/data)          |
| Timeline         | **Scroll-drawn rose line**, dots light up, year sticks to the side                         |
| Motion           | **Rich**: smooth scroll, custom cursor, magnetic buttons, parallax, slash page transitions |
| Voice            | **Confident & warm**: first person, short sentences, a little wit                          |
| Live data        | **Strava**, **GitHub contributions**, **Spotify now playing**                              |
| Content          | **Local MDX** + typed content files, no CMS                                                |
| Hosting          | **Vercel**                                                                                 |
| Contact          | **Contact form** + **Google Calendar appointment schedule** link                           |

---

## 3. Brand

### 3.1 Logo

The F/A mark has four variants. Each one has a job:

| File                     | Use                                                                         |
| ------------------------ | --------------------------------------------------------------------------- |
| `logo-white-on-black`    | Header mark in dark mode, social avatars                                    |
| `logo-black-on-white`    | Header mark in light mode, print / résumé PDF                               |
| `logo-rose-on-black`     | Favicon, app icon, OG image fallback, 404 page                              |
| `logo-rose-on-white`     | Light-mode favicon (`media="(prefers-color-scheme: light)"`), email footer  |

**Action:** redraw the mark as a single SVG component (`<Logo />`) that takes its color from
`currentColor`, so one source covers every theme. Keep the PNGs only for favicons and OG images.

### 3.2 The slash is the signature

The `/` in **F/A** becomes the one recurring motif:

- **Route labels**: section eyebrows read like paths: `/work`, `/life`, `/writing`, `/now`.
- **Page transitions**: a diagonal rose wipe at the slash's angle (≈ 17°) covers and reveals the page.
- **Dividers**: a single 17° slash replaces horizontal rules between major sections.
- **Hover**: links get a rose underline that grows from left to right; nav items swap a leading `/` in.

Use the slash in those places and nowhere else. Its weight comes from not being everywhere.

### 3.3 Color tokens

Rose is exact to the logo. Neutrals lean slightly toward rose, so pure grey never sits next to the
mark.

| Token            | Dark (default)  | Light          | Use                                         |
| ---------------- | --------------- | -------------- | ------------------------------------------- |
| `--bg`           | `#0B0A0B`       | `#FAF9F9`      | Page background                             |
| `--surface`      | `#151314`       | `#FFFFFF`      | Cards, form fields, now-playing             |
| `--line`         | `#2A2527`       | `#E7E2E3`      | Borders, timeline track (unreached)         |
| `--fg`           | `#F5F2F3`       | `#141112`      | Primary text, logo                          |
| `--muted`        | `#9C9496`       | `#6B6365`      | Secondary text, metadata                    |
| `--accent`       | `#F43F5E`       | `#E11D48`      | Rose: links, timeline fill, focus, CTA      |
| `--accent-ink`   | `#0B0A0B`       | `#FFFFFF`      | Text on an accent fill                      |

Light mode uses `rose-600` so body-size links meet a 4.5:1 contrast ratio on near-white. Status colors
(form success/error, Strava "PR") are kept separate from the accent: success `#22C55E`, error `#F97316`.

Tailwind v4 `@theme` mapping:

```css
@import 'tailwindcss';

@custom-variant dark (&:where([data-theme='dark'], [data-theme='dark'] *));

@theme {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-line: var(--line);
  --color-fg: var(--fg);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --font-display: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

### 3.4 Typography

Load all three fonts through `next/font/google` (self-hosted, no layout shift), as variable fonts.

| Role            | Face           | Size (mobile → desktop)          | Weight | Tracking  | Notes                              |
| --------------- | -------------- | -------------------------------- | ------ | --------- | ---------------------------------- |
| Display XL      | Space Grotesk  | `clamp(3rem, 9vw, 8.5rem)`       | 600    | -0.04em   | Hero only, `text-wrap: balance`    |
| H1              | Space Grotesk  | `clamp(2.25rem, 5vw, 4rem)`      | 600    | -0.03em   | Page titles                        |
| H2              | Space Grotesk  | `clamp(1.75rem, 3.5vw, 2.75rem)` | 500    | -0.02em   | Section titles                     |
| H3              | Space Grotesk  | `1.25rem`                        | 500    | -0.01em   | Cards, timeline roles              |
| Body            | Inter          | `1.0625rem` / 1.65               | 400    | 0         | Measure ≤ 68ch                     |
| Small           | Inter          | `0.875rem` / 1.5                 | 400    | 0         | Metadata                           |
| Label           | JetBrains Mono | `0.75rem`                        | 500    | 0.08em    | Uppercase eyebrows, dates, stats   |
| Data            | JetBrains Mono | `1.5rem` – `3rem`                | 500    | -0.02em   | Strava km, pace, counts; tabular   |

Blog posts use the same faces through `@tailwindcss/typography`, restyled: Space Grotesk headings,
rose links, mono inline code.

### 3.5 Layout & spacing

- **Grid**: 12 columns, max width `1240px`, gutters `clamp(16px, 4vw, 40px)`.
- **Editorial rhythm**: section eyebrows (`/work`) sit in columns 1–3, content in columns 4–12 on
  desktop, stacked on mobile. Most sections are left-aligned.
- **Spacing scale**: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 144 px. Sections are 96px apart on
  mobile, 144px on desktop.
- **Radius**: `0` by default (editorial, sharp like the logo). `6px` only on interactive surfaces
  (inputs, now-playing card). Pills are `999px`.
- **Borders over shadows.** One-pixel `--line` borders. No drop shadows except the custom cursor.

---

## 4. Information architecture

```
/                         Home: the one-scroll story (see §5)
/work                     Full experience timeline + certifications + recommendations
/projects                 All projects
/projects/[slug]          Case study (MDX)
/life                     Beyond work hub
  /life/running           Race log, PRs, pacing, live Strava
  /life/community         Talks, meetups, mentoring, volunteering
  /life/gallery           Photo gallery (masonry + lightbox)
  /life/building          Entrepreneurship: the Fitscovery story, lessons
/blog                     Writing index (kept at /blog to preserve existing URLs & SEO)
/blog/[slug]              Post (existing MDX, unchanged slugs)
/blog/tags/[tag]          Tag listing
/now                      What I'm focused on this month (+ live Strava/Spotify)
/uses                     Tech stack, tools, gear (shoes and watch included)
/contact                  Form + "Book a call" (Google Calendar appointment schedule)
/rss.xml, /sitemap.xml, /robots.txt, /og/[...]   Generated
```

**Primary nav** (4 + CTA): `Work` · `Life` · `Writing` · `Now` · **[Let's talk]**
**Footer**: socials, `/uses`, RSS, "Built with …" (links to repo), last-deployed timestamp, theme toggle.

**Redirects** (in `next.config.ts`): `/about` → `/`, `/projects` stays, `/tags/:tag` → `/blog/tags/:tag`,
`/blog/page/:n` → `/blog`.

---

## 5. Homepage, section by section

The mockup shows this page.

| #  | Section                | Content                                                                                                         | Motion                                                     |
| -- | ---------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1  | **Hero**               | Headline *"I build software & run long distances."* with a rose underline under "long distances". One-line intro. 3 role lines (Engineer · Founder · Pacer). CTAs: *See my work* / *Let's talk*. Portrait. | Words rise in line by line; underline draws; portrait parallax |
| 2  | **Now strip**          | Thin ticker: `NOW → Training for <race> · Reading <book> · ♫ <Spotify track>`                                    | Marquee; pauses on hover                                   |
| 3  | **/work: Timeline**    | 4–6 milestones (role, org, years, 1-line impact, 3 tags). Link to `/work`.                                      | Scroll-drawn rose line (§7.2)                              |
| 4  | **Selected projects**  | 3 large rows (not cards): title, year, role, one-line outcome, stack. Hovering shows the image following the cursor. | Image reveal follows cursor; row underline                 |
| 5  | **/life: Beyond work** | 4 tiles: *Running* (live Strava weekly km sparkline + last run), *Community* (latest talk), *Gallery* (3 photos), *Building* (Fitscovery story teaser). | Parallax on photos; numbers count up                       |
| 6  | **Stack**              | Grouped list: Languages · Frontend · Backend · Cloud · Data · Tools. Mono labels, no logo soup.                  | Group highlight on hover                                   |
| 7  | **Proof**              | Certifications (badge row) + 2–3 recommendation quotes (name, role, relationship) in a carousel.                | Quotes cross-fade; drag to scroll                          |
| 8  | **/writing**           | Latest 3 posts: date (mono), title, reading time.                                                               | Title slides on hover                                      |
| 9  | **GitHub**             | Contribution heatmap (last 52 weeks), with rose replacing GitHub's green.                                       | Cells fade in diagonally (slash angle)                     |
| 10 | **Contact**            | *"Got something in mind?"* Form (name, email, topic, message) + **Book a 30-min call** button.                  | Magnetic CTA                                               |
| 11 | **Footer**             | Big outlined **F/A** wordmark, links, now-playing mini.                                                         | Wordmark fills on hover                                    |

---

## 6. Components

| Component                 | Notes                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `<Logo />`                | SVG, `currentColor`, optional `animated` (slash draws on load)                             |
| `<SiteHeader />`          | Sticky, blurs on scroll, hides on scroll down and shows on scroll up. Mobile: full-screen menu with slash wipe |
| `<Eyebrow path="/work" />`| Mono uppercase label with route-style path                                                 |
| `<SlashDivider />`        | 17° slash rule                                                                             |
| `<Timeline />`            | See §7.2. Data from `content/experience.ts`                                                |
| `<ProjectRow />`          | Hover image follows cursor (desktop), inline image (mobile)                                |
| `<StatTile />`            | Mono number + label + optional sparkline                                                   |
| `<NowPlaying />`          | Spotify: album art, track, artist, live equaliser bars; "Last played" when idle            |
| `<StravaCard />`          | Weekly km sparkline (12 weeks), last run (distance · pace · HR)                            |
| `<ContributionGraph />`   | 53×7 grid, rose scale (5 steps), tooltip with count & date                                 |
| `<Quote />`               | Recommendation with avatar, name, role, relationship                                       |
| `<CertBadge />`           | Issuer logo (mono), name, year, verify link                                                |
| `<ContactForm />`         | Server Action → Resend; Zod validation; honeypot + Turnstile                               |
| `<BookCallButton />`      | Opens the Google Calendar appointment schedule URL in a new tab; fires a PostHog event     |
| `<ThemeToggle />`         | Sun/moon icons swap with a slash wipe                                                      |
| `<Cursor />`              | Dot + ring; grows over links and shows labels ("Read", "View", "Drag"). Disabled on touch & reduced motion |
| `<Magnetic />`            | Wrapper; pulls child ≤ 12px toward the pointer                                             |
| `<PageTransition />`      | Diagonal rose wipe between routes (View Transitions API, Motion as fallback)               |
| MDX: `Callout`, `Figure`, `CodeBlock` (Shiki), `Strava` embed, `Gallery` |                                                     |

---

## 7. Motion

### 7.1 Principles

1. **Motion explains.** Every animation reveals hierarchy, shows progress, or answers an input.
2. **Fast in, slow out.** Use `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quint), 400–700ms for reveals and
   150–200ms for hovers.
3. **Content is never hidden waiting for JS.** Reveals start from a visible state (e.g. `opacity: .001`
   → 1 is *not* allowed; use `translateY(16px)` + `opacity .6` → 1). With JS disabled, the page reads
   correctly.
4. **`prefers-reduced-motion: reduce`** disables Lenis, the cursor, parallax, marquee and magnetic pull.
   Transitions become 0ms cross-fades. The timeline renders fully drawn.

### 7.2 Scroll-drawn timeline

```
 2024 ┃  ● Senior Software Engineer — <Company>
 sticky┃  │   one-line impact · tags
       ┃  │
 2021  ┃  ● Co-founder & CTO — Fitscovery        ← dot fills rose + scales 1→1.25 when line reaches it
       ┃  ╎   card: x -24px → 0, opacity .6 → 1
       ╎  ╎
 2016  ╎  ○ Software Engineer                     ← not yet reached: --line colored
```

- **Track**: 2px `--line`. **Fill**: 2px `--accent`, `transform: scaleY(progress)` with
  `transform-origin: top`. `progress` comes from Motion's `useScroll({ target, offset: ['start 70%', 'end 50%'] })`
  through `useSpring({ stiffness: 120, damping: 30 })` for a slightly elastic feel.
- **Dots**: each one reads its own `useInView` (`margin: '-50% 0px'`). When active: fill `--accent`, a 6px
  `--accent` ring at 25% opacity, and a pulse once.
- **Year**: `position: sticky; top: 40vh` in a left column; it cross-fades to the active entry's year.
- **Mobile**: line on the left edge, year inline above each role.
- Uses CSS `animation-timeline: view()` where supported, with Motion as the fallback.

### 7.3 Rich-motion package

| Effect               | Library / technique                         | Where                              |
| -------------------- | ------------------------------------------- | ---------------------------------- |
| Smooth scroll        | **Lenis** (`lerp: 0.1`), synced with Motion | Global                             |
| Custom cursor        | Motion springs, `pointer: fine` only        | Global                             |
| Magnetic buttons     | `<Magnetic>` wrapper                        | CTAs, socials, theme toggle        |
| Parallax             | `useScroll` + `useTransform` (±40px max)    | Hero portrait, gallery tiles       |
| Text reveal          | Split by line (`SplitText`-like util) + stagger 60ms | Hero, H1s                 |
| Page transition      | View Transitions API + slash clip-path       | Route changes                      |
| Count-up             | Motion `animate()` on in-view               | Strava stats, project metrics      |
| Marquee              | CSS keyframes, paused on hover              | Now strip                          |

Performance budget for motion: no layout-triggering properties (only `transform`, `opacity`, `clip-path`).
Lenis and the cursor load after `requestIdleCallback`.

---

## 8. Live data integrations

All calls run on the server (Route Handlers / RSC). They are cached with `fetch` + `next.revalidate`, and
each one has a static fallback so the page never shows an error state.

| Source   | API                                                     | Cache                 | Shows                                     | Env vars                                                        |
| -------- | ------------------------------------------------------- | --------------------- | ----------------------------------------- | --------------------------------------------------------------- |
| Strava   | `GET /athlete/activities`, `GET /athletes/{id}/stats` (OAuth refresh-token flow) | 1 h | Weekly km (12 wks), YTD km, last run, PRs | `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN` |
| GitHub   | GraphQL `contributionsCollection.contributionCalendar`  | 6 h                   | 52-week heatmap, total contributions      | `GITHUB_TOKEN` (read:user)                                      |
| Spotify  | `GET /me/player/currently-playing`, fallback `recently-played` | 30 s (client polls `/api/now-playing` every 30 s while visible) | Track, artist, art, link | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` |

- Strava: show **only runs**. Round start locations away; never show maps of home or work.
- Each widget sits behind a **PostHog feature flag** (`widget-strava`, `widget-github`, `widget-spotify`), so
  one can be switched off without a deploy if an API breaks or the data is something you don't want public.

---

## 9. Contact

- **Form**: Next.js Server Action → **Resend** (email to Francis, plus an auto-reply to the sender built
  with React Email). Validated with Zod. Spam protection is a hidden honeypot field plus **Cloudflare
  Turnstile**. Rate limit: 3 per IP per hour (Upstash Redis, or in-memory if you'd rather skip a dependency).
- **Book a call**: a button linking to the **Google Calendar appointment schedule** booking page. A
  `topic` select on the form ("Hiring", "Project", "Speaking", "Running", "Just saying hi") is sent
  to PostHog as an event property.

---

## 10. Analytics & feature flags (PostHog)

- `posthog-js` client provider plus `posthog-node` for server-side flags. Requests go through a
  reverse proxy at `/ingest` (Next rewrites) so ad blockers don't drop them.
- **Events**: `cta_clicked {cta}`, `book_call_clicked`, `contact_submitted {topic}`,
  `project_opened {slug}`, `post_read {slug, percent}` (25/50/75/100), `theme_toggled {to}`,
  `now_playing_clicked`.
- **Flags**: `widget-*` (above), `hero-headline` (multivariate A/B test on headline copy), `motion-rich`
  (kill switch for heavy motion if Core Web Vitals regress).
- Session replay: on, with all inputs masked.

---

## 11. Tech stack

### Requested

| Area               | Choice                                                                   |
| ------------------ | ------------------------------------------------------------------------ |
| Framework          | **Next.js** (latest stable, App Router, RSC, Server Actions), **React** + **TypeScript** (`strict`) |
| Package manager    | **pnpm** (pinned via `packageManager` + Corepack)                        |
| Styling            | **Tailwind CSS v4** (CSS-first `@theme`), `@tailwindcss/typography`       |
| Git hygiene        | **Husky** + **lint-staged**, **commitlint** (`@commitlint/config-conventional`), **Commitizen** (`cz-git` adapter for a nicer prompt) |
| Lint               | **ESLint** flat config (`eslint-config-next`, `typescript-eslint`, `eslint-plugin-jsx-a11y`) |
| Analytics / flags  | **PostHog**                                                              |

### Suggested additions

| Need                       | Suggestion                                   | Why                                                                 |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------------------- |
| Formatting                 | **Prettier** + `prettier-plugin-tailwindcss` | Class sorting; ESLint stays focused on correctness                  |
| MDX content layer          | **Velite**                                   | Typed, Zod-validated MDX + JSON collections. Successor to Contentlayer, which the current site uses and which is no longer maintained |
| Code highlighting          | **Shiki** via `rehype-pretty-code`           | Build-time, theme-aware (dual light/dark themes)                    |
| Animation                  | **Motion** (`motion/react`)                  | Scroll-linked values, springs, layout animations                    |
| Smooth scroll              | **Lenis**                                    | Needed for the rich-motion package                                  |
| Theme                      | **next-themes**                              | No-flash theme switching                                            |
| Email                      | **Resend** + **React Email**                 | Contact form delivery                                               |
| Validation                 | **Zod**                                      | Forms, env vars (`@t3-oss/env-nextjs`), content schemas             |
| Spam                       | **Cloudflare Turnstile**                     | Free, privacy-friendly CAPTCHA                                      |
| OG images                  | **`next/og`**                                | Generated social cards per post/project with the F/A mark           |
| Images                     | `next/image` + **plaiceholder** (blur)       | Gallery performance                                                 |
| Icons                      | **lucide-react** + **simple-icons**          | UI + brand icons, tree-shakeable                                    |
| Testing                    | **Vitest** + Testing Library, **Playwright** | Unit tests for data adapters; e2e smoke + visual tests              |
| CI                         | **GitHub Actions**: lint, typecheck, test, build, Lighthouse CI | Keeps `main` deployable                          |
| Releases                   | **release-please** or **changesets**         | Works well with conventional commits; automatic CHANGELOG + tags    |
| Deps                       | **Renovate** (grouped, weekly, automerge patch) | Restores the paused bot without the PR noise                     |
| Monitoring                 | **Vercel Speed Insights**                    | Real-user Core Web Vitals alongside PostHog                         |

### Quality budgets

- Lighthouse: Performance ≥ 95 (mobile), Accessibility 100, SEO 100, Best Practices 100.
- LCP < 2.0s, CLS < 0.05, INP < 150ms. JS on the home route < 120kB gzipped.
- WCAG 2.2 AA: visible focus ring (2px `--accent`, 2px offset), skip link, semantic landmarks,
  every image has alt text, motion respects user settings.

---

## 12. Content model

```
content/
  blog/*.mdx                 ← existing posts move here unchanged (slugs preserved)
  projects/*.mdx             title, slug, year, role, summary, stack[], cover, links{live,repo}, featured
  experience.ts              { role, org, orgUrl, start, end?, location, summary, highlights[], tags[] }[]
  certifications.ts          { name, issuer, year, credentialUrl }[]
  recommendations.ts         { quote, name, role, company, relationship, avatar, linkedinUrl }[]
  races.ts                   { name, date, distance, time, pace, pr?: boolean, role: 'runner'|'pacer', resultsUrl }[]
  talks.ts                   { title, event, date, location, slidesUrl?, videoUrl? }[]
  gallery.ts                 { src, alt, caption, date, tag: 'race'|'travel'|'event'|'life' }[]
  now.mdx                    frontmatter: updatedAt; body: focus areas
  uses.ts                    { category, items: { name, note, url }[] }[]
  site.ts                    name, tagline, socials, bookingUrl, résumé URL
public/images/...            blog images keep their existing /static/images/... paths
```

Velite validates every collection at build time, so a typo in a date fails the build instead of reaching
production.

---

## 13. Migration plan

| Phase | Work                                                                                                       | Output                         |
| ----- | ---------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 0     | Tag current `main` as **`v2024`**                                                                          | Created locally (see note below) |
| 1     | Clean slate: delete every file except `data/blog/*.mdx`, the images they reference, the logos, `README.md`, `LICENSE` | Empty-ish branch           |
| 2     | Scaffold: Next.js + TS + pnpm + Tailwind v4 + ESLint/Prettier + Husky/commitlint/Commitizen + CI           | Running blank app              |
| 3     | Design system: tokens, fonts, `Logo`, header/footer, theme toggle, motion primitives                       | `/` shell                      |
| 4     | Content layer: Velite, move posts to `content/blog`, post page, tags, RSS, sitemap, OG images             | Blog parity with v2024         |
| 5     | Homepage sections + `/work` timeline                                                                       | Main experience                |
| 6     | `/projects`, `/life/*`, `/now`, `/uses`, `/contact`                                                        | Full IA                        |
| 7     | Integrations: PostHog (+proxy, flags), Strava, GitHub, Spotify, Resend, Turnstile                          | Live data                      |
| 8     | QA: a11y audit, Lighthouse CI, Playwright smoke, redirects check, content proofreading → launch            | v2026 live                     |

> **Note on the tag:** `v2024` points at `05edb13` (last commit on `main`). Pushing it from the cloud session
> returned 403. If it isn't on GitHub yet, run:
> `git tag -a v2024 05edb13 -m "v2024" && git push origin v2024`

---

## 14. Content I still need from you

Placeholders in the mockup are marked *draft*. To replace them I need:

1. **Experience**: each role with company, title, start/end month-year, and one sentence of impact. Should
   your current employer be named?
2. **Projects**: 3–6 you're proud of (Fitscovery first?), with a one-line outcome and a metric if you have one.
3. **Certifications**: name, issuer, year, verify link.
4. **Recommendations**: 2–4 quotes. LinkedIn recommendations work; we need permission to show each name.
5. **Running**: race history, PRs, the races you've paced, your current goal race.
6. **Community/speaking**: talks, events, mentoring.
7. **Photos**: a new portrait (the 2023 one is fine for now) + 10–20 gallery shots.
8. **Booking link**: your Google Calendar appointment schedule URL.
9. **Headline**: do you like *"I build software & run long distances."*? Alternatives to A/B test:
   *"Engineer by trade. Runner by choice."* · *"Shipping code. Pacing miles."*
10. **Contact email** for the form to deliver to (the 2024 site had `iam@francisaguilar.co` commented out).
