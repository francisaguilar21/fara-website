# Phase 5: Homepage · Specs

| Status      | Depends on | Ships as                                                                                      | Effort   |
| ----------- | ---------- | --------------------------------------------------------------------------------------------- | -------- |
| In progress | Phases 3–4 | 4 PRs: hero + now strip → timeline → projects + life → stack, proof, writing, GitHub, contact | 3–4 days |

References: [DESIGN §5](../design/DESIGN.md#5-homepage-section-by-section), [DESIGN §7.2](../design/DESIGN.md#72-scroll-drawn-timeline), [mockup](../design/mockup.html)

## 1. Goal

Build the homepage from the mockup. It's the one-scroll story of who Francis is at work and outside
it, and it ends with an obvious way to get in touch. Every section reads from the Phase 4 content
layer. Until real content and live data exist, sections show clearly marked placeholders.

## 2. Scope

**In**

- The 10 homepage sections plus the footer (already built in Phase 3)
- Section components
- Static fallbacks for the live widgets
- The placeholder (draft) policy

**Out**

- Live Strava, Spotify and GitHub data (Phase 7). Widgets render their fallback data here.
- Contact form submission (Phase 7). The form here validates on the client only.
- Analytics events (Phase 7)

## 3. Requirements

### General

| ID    | Requirement                                                                                                                                                                                                                       |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P5-R1 | Each section is a component in `components/home/` and takes typed data from `lib/content`. Each section wraps in `<Section eyebrow label id>`.                                                                                    |
| P5-R2 | **Placeholder policy.** Any entry with `draft: true` renders a `<DraftChip />`. A section never renders empty: it falls back to placeholder entries. `pnpm check:drafts` lists every draft entry; Phase 8 makes it a launch gate. |
| P5-R3 | The page matches the mockup at 1440px and 390px in both themes. Where they differ, DESIGN wins, then the mockup.                                                                                                                  |
| P5-R4 | Motion follows Phase 3 components and rules (reduced motion, visible resting state).                                                                                                                                              |
| P5-R5 | Section `id`s: `work`, `projects`, `life`, `stack`, `proof`, `writing`, `github`, `contact`, `now` (the strip). The header nav links to them on the homepage.                                                                     |

### Sections

| ID     | Section            | Requirement                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P5-R6  | Hero               | Label row (name · `Manila, PH · 14.60°N 120.98°E`). Headline from `site.headline` as Display XL, rising in line by line, with a rose underline drawn under the last phrase. Intro paragraph. Three role rows labelled `/work`, `/build` and `/run`. CTAs "See my work" (to `#work`) and "Book a call" (`site.bookingUrl`, magnetic). Portrait: grayscale that colors on hover, with a rose slash overlay and parallax. Mobile: portrait first, at most 220px wide.                    |
| P5-R7  | Now strip          | Marquee of `NOW`, `READING`, `LISTENING` (Spotify), `THIS WEEK` (Strava km) and `BUILDING` items from `now.mdx` frontmatter plus widget data. Pauses on hover. Duplicated for the loop, with the copy hidden from screen readers. Static row under reduced motion.                                                                                                                                                                                                                    |
| P5-R8  | Timeline (`/work`) | The latest 6 `featured` entries from `experience.ts`, newest first. A vertical track with a rose fill drawn by scroll (`scaleY`, spring `stiffness 120, damping 30`). Dots: **work = filled**, **life = ring**; each lights up when it passes 55% of the viewport. Desktop: a sticky year column (`top: 40vh`) cross-fades to the active entry's year and range. Mobile: inline years only. A legend explains the dots. "Full timeline →" links to `/work`. Full spec in DESIGN §7.2. |
| P5-R9  | Projects           | 3 `featured` projects as full-width rows (year, title, role/stack, one-line outcome, arrow). On hover the title shifts right in rose, the arrow rotates -45°, and a 280×210 cover preview follows the cursor (desktop with a fine pointer only). Rows link to `/projects/[slug]`.                                                                                                                                                                                                     |
| P5-R10 | Life (`/life`)     | 4 tiles in a 12-column grid. **Running**: 3 stats (this week, YTD, average pace), a 12-week bar chart drawn to scale with the current week in rose, and the last run. **Community**: 3 latest talks/events + `<NowPlaying />`. **Gallery**: 5 photos (2 tall + 3) with captions and parallax. **Building**: a pull quote + "Read the story →" to `/life/building`.                                                                                                                    |
| P5-R11 | Stack (`/uses`)    | 6 groups from `uses.ts` in a bordered grid (3 → 2 → 1 columns). A rose `/` appears before items in the hovered group. Links to `/uses`.                                                                                                                                                                                                                                                                                                                                               |
| P5-R12 | Proof              | A recommendations carousel (one quote, dots, cross-fade, swipeable on touch, keyboard arrows) + a certifications list (name, issuer · year, verify link).                                                                                                                                                                                                                                                                                                                             |
| P5-R13 | Writing            | The 3 latest posts (date, title, summary, reading time). The title slides right on hover. "All posts →" goes to `/blog`.                                                                                                                                                                                                                                                                                                                                                              |
| P5-R14 | GitHub             | 53×7 contribution heatmap in 5 rose steps, a total count, and a legend. Scrolls sideways inside its own container on mobile. Each cell has a tooltip with the date and count.                                                                                                                                                                                                                                                                                                         |
| P5-R15 | Contact            | Big "Got something in mind?" heading, a short paragraph, and a booking card (Google Calendar · 30 min · video · Asia/Manila) with a "Book a 30-min call" button. Form fields: name, email, topic (Hiring / A project / Speaking / Running / Just saying hi), message. Client-side validation with inline errors. Submit is a stub until Phase 7.                                                                                                                                      |

### Quality

| ID     | Requirement                                                                                                                                                        |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P5-R16 | Server components by default. Client components only for motion, carousel, marquee and form.                                                                       |
| P5-R17 | Images use `next/image` with `sizes` and `placeholder="blur"`. The hero portrait has `priority`.                                                                   |
| P5-R18 | Accessibility: headings in order (one `h1` = headline), landmarks, carousel controls labelled, chart and heatmap have text alternatives, every image has alt text. |

## 4. Technical design

### 4.1 Components

| Component                                                                  | Client?                                         | Data                                                                     |
| -------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| `Hero`                                                                     | Partly (`HeroPortrait` parallax, CTAs magnetic) | `site`                                                                   |
| `NowStrip`                                                                 | Yes (marquee)                                   | `pages/now` frontmatter, `getNowPlaying()`, `getStravaWeek()` (fallback) |
| `Timeline`, `TimelineItem`, `TimelineYear`                                 | Yes                                             | `getExperience({ featured: true, limit: 6 })`                            |
| `ProjectList`, `ProjectRow`, `CursorPeek`                                  | Row server, peek client                         | `getProjects({ featured: true, limit: 3 })`                              |
| `LifeGrid`, `RunningTile`, `CommunityTile`, `GalleryStrip`, `BuildingTile` | Partly                                          | Strava fallback, `talks`, `gallery`, `pages/life/building`               |
| `WeeklyBars` (SVG)                                                         | No                                              | `{ weekStart, km }[]` (12 entries)                                       |
| `NowPlaying` (`components/widgets/`)                                       | Yes                                             | Fallback track until Phase 7                                             |
| `StackGrid`                                                                | No                                              | `uses`                                                                   |
| `Proof`, `QuoteCarousel`, `CertList`                                       | Carousel client                                 | `recommendations`, `certifications`                                      |
| `LatestPosts`                                                              | No                                              | `getPosts({ limit: 3 })`                                                 |
| `ContributionGraph` (`components/widgets/`)                                | Tooltip client                                  | Fallback calendar until Phase 7                                          |
| `ContactSection`, `ContactForm`, `BookingCard`                             | Form client                                     | `site.bookingUrl`                                                        |

### 4.2 Widget fallbacks (`lib/integrations/fallbacks.ts`)

Typed sample data with the same shape Phase 7 returns, flagged `isSample: true` so the UI shows a
`<DraftChip>sample</DraftChip>`:

```ts
type StravaSummary = {
  isSample: boolean
  weekKm: number
  ytdKm: number
  avgPaceSecPerKm: number
  weeks: { weekStart: string; km: number }[]
  lastRun?: { km: number; paceSecPerKm: number; avgHr?: number; startedAt: string }
}
type NowPlaying = {
  isSample: boolean
  isPlaying: boolean
  title: string
  artist: string
  albumArt?: string
  url?: string
}
type ContributionCalendar = {
  isSample: boolean
  total: number
  weeks: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[][]
}
```

### 4.3 Timeline mechanics

- Progress = how far the timeline container has scrolled through the window from `start 70%` to
  `end 50%`, via Motion `useScroll({ target, offset })` and then `useSpring`.
- Fill: `transform: scaleY(progress)` on a 2px absolutely positioned bar.
- Active entry: an `IntersectionObserver` with `rootMargin: '-55% 0px -45% 0px'`. The last entry above
  the line is active and drives the sticky year.
- Use CSS `animation-timeline: view()` where supported; Motion is the fallback.

### 4.4 Draft check

`scripts/check-drafts.ts` (run as `pnpm check:drafts`) prints every `draft: true` entry and every
`isSample` fallback in use, then exits with code 1 if any are found. It isn't wired into CI until
Phase 8, because placeholders are expected before then.

## 5. Acceptance criteria

| ID     | Criterion                                                                                                                                                 |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P5-AC1 | A side-by-side comparison with the mockup at 1440px and 390px, in both themes, shows no unexplained differences. Screenshots are attached to each PR.     |
| P5-AC2 | Timeline: the fill follows scroll smoothly, dots light up in order, the sticky year updates (desktop), and with reduced motion everything is fully drawn. |
| P5-AC3 | Projects: the cursor preview appears only with a fine pointer. Rows are keyboard-focusable and the focus style is visible.                                |
| P5-AC4 | Every section renders with placeholder content and shows draft/sample chips. `pnpm check:drafts` lists them.                                              |
| P5-AC5 | No horizontal page scroll at 360px. The heatmap and tables scroll inside their own containers.                                                            |
| P5-AC6 | axe: no violations. Heading order is valid. Carousel works by keyboard.                                                                                   |
| P5-AC7 | Lighthouse (mobile, preview with bypass): Performance ≥ 90 (optimized to ≥ 95 in Phase 8), Accessibility 100, CLS < 0.05.                                 |
| P5-AC8 | With JavaScript disabled, all sections and text are visible. The timeline shows fully drawn.                                                              |

## 6. Open questions

| Question                                                              | Default if unanswered                                              |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Headline: keep _"I build software & run long distances."_?            | Keep it. Phase 9 A/B tests alternatives.                           |
| Show the current employer's name in the hero and timeline?            | No company name until Francis confirms. The role shows on its own. |
| Coordinates in the hero label (`14.60°N 120.98°E` is central Manila)? | Keep the city-level coordinates. They're not a home location.      |
