# Phase 6: Inner pages · Specs

| Status      | Depends on                                                | Ships as                                                                                               | Effort   |
| ----------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------- |
| Not started | Phase 5 (reuses its components); can overlap with Phase 7 | 4 PRs: work + projects → life hub + running + community → gallery + building → now, uses, contact, 404 | 3–4 days |

References: [DESIGN §4](../design/DESIGN.md#4-information-architecture), [DESIGN §6](../design/DESIGN.md#6-components)

## 1. Goal

Give every topic the homepage previews a full page of its own: `/work`, `/projects`, `/life/*`,
`/now`, `/uses` and `/contact`, plus a branded 404. Each page is linkable, indexable and has its
own social card.

## 2. Scope

**In**

- Every route in DESIGN §4 except `/` and `/writings/*`
- Page metadata and OG images
- Sitemap entries
- The 404 page

**Out**

- Live data wiring (Phase 7). Pages use the Phase 5 fallbacks.
- Form delivery (Phase 7)

## 3. Requirements

### Shared

| ID    | Requirement                                                                                                                                                                       |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P6-R1 | Every page has an `h1` page title with an `<Eyebrow>` path (`/work`, `/life/running`, …). It reuses Phase 3–5 components, with no page-specific styling outside those primitives. |
| P6-R2 | Every page exports `generateMetadata` (title, description, canonical) and an `opengraph-image.tsx` built from a shared OG template (F/A mark, page path, title).                  |
| P6-R3 | Every page is statically generated (except where Phase 7 adds live data with ISR) and listed in `sitemap.ts`.                                                                     |
| P6-R4 | The draft policy from P5-R2 applies. `pnpm check:drafts` covers every page.                                                                                                       |
| P6-R5 | Breadcrumb-style back links on sub-pages (`/life/running` → `/life`), as a `BreadcrumbList` in JSON-LD.                                                                           |

### Pages

| ID     | Route                     | Requirement                                                                                                                                                                                                                                                                                                             |
| ------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P6-R6  | `/work`                   | The full `experience.ts` timeline (same `Timeline` component, all entries, grouped by year), certifications, all recommendations as a grid (not a carousel), and a résumé PDF link (`site.resumeUrl`, opens in a new tab). JSON-LD `Person` with `jobTitle`, `alumniOf` / `worksFor` where known, and `sameAs` socials. |
| P6-R7  | `/projects`               | Every non-draft project as `ProjectRow`s, sorted by `order` then year, with a filter by stack tag (client-side, URL `?stack=react`).                                                                                                                                                                                    |
| P6-R8  | `/projects/[slug]`        | MDX case study with the fixed structure **Problem → Role → What we built → Outcome → Stack**, plus a hero cover, a metadata sidebar (year, role, stack, links) and next/previous project. `generateStaticParams`, `dynamicParams = false`.                                                                              |
| P6-R9  | `/life`                   | Hub with 4 large cards (Running, Community, Gallery, Building), each with a live or fallback teaser (week km, latest talk, 3 photos, pull quote).                                                                                                                                                                       |
| P6-R10 | `/life/running`           | Strava summary (this week, YTD, average pace, 12-week bars, last run). A race log table from `races.ts` that sorts by date, distance or time, highlights PRs in rose, labels runner/pacer, and scrolls sideways on mobile. A pacing section (club, since, paces led). **No maps or GPS data.**                          |
| P6-R11 | `/life/community`         | Talks and events from `talks.ts`, grouped by year, with slides and video links; plus a "Pacing" block that links to `/life/running`.                                                                                                                                                                                    |
| P6-R12 | `/life/gallery`           | Masonry grid from `gallery.ts` with filter chips by tag, a lightbox (keyboard: arrows, Esc; focus trapped; swipe on touch), blur placeholders, lazy loading. Every image needs alt text (enforced by the schema).                                                                                                       |
| P6-R13 | `/life/building`          | Long-form MDX from `pages/life/building.mdx` (the Fitscovery story), with prose styling and a table of contents on desktop.                                                                                                                                                                                             |
| P6-R14 | `/now`                    | From `pages/now.mdx` with an "Updated on {date}" label and a staleness note if it's older than 60 days. Live (fallback) Strava week and Spotify now-playing. A footnote links to nownownow.com, which explains what a /now page is.                                                                                     |
| P6-R15 | `/uses`                   | All `uses.ts` groups (Stack, Tools, Hardware, Running gear) with notes and links.                                                                                                                                                                                                                                       |
| P6-R16 | `/contact`                | Full-page version of the homepage contact section: booking card first on mobile, form, socials.                                                                                                                                                                                                                         |
| P6-R17 | 404 (`app/not-found.tsx`) | Rose-on-black F/A mark, "This path doesn't exist" with the requested path shown in mono as `/the/path`, and links to `/`, `/writings` and `/work`. Returns status 404.                                                                                                                                                  |

## 4. Technical design

### 4.1 Routes and files

| Route              | File                           | Data                                                      | Rendering                                |
| ------------------ | ------------------------------ | --------------------------------------------------------- | ---------------------------------------- |
| `/work`            | `app/work/page.tsx`            | `experience`, `certifications`, `recommendations`, `site` | Static                                   |
| `/projects`        | `app/projects/page.tsx`        | `getProjects()`                                           | Static + client filter                   |
| `/projects/[slug]` | `app/projects/[slug]/page.tsx` | Velite `projects`                                         | Static                                   |
| `/life`            | `app/life/page.tsx`            | Teasers                                                   | Static (ISR once Phase 7 adds live data) |
| `/life/running`    | `app/life/running/page.tsx`    | `races`, Strava                                           | Static → ISR 1h in Phase 7               |
| `/life/community`  | `app/life/community/page.tsx`  | `talks`                                                   | Static                                   |
| `/life/gallery`    | `app/life/gallery/page.tsx`    | `gallery`                                                 | Static                                   |
| `/life/building`   | `app/life/building/page.tsx`   | Velite `pages`                                            | Static                                   |
| `/now`             | `app/now/page.tsx`             | Velite `pages`, Strava, Spotify                           | Static → ISR in Phase 7                  |
| `/uses`            | `app/uses/page.tsx`            | `uses`                                                    | Static                                   |
| `/contact`         | `app/contact/page.tsx`         | `site`                                                    | Static                                   |

### 4.2 New components

| Component                     | Notes                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| `RaceTable`                   | Sortable table with `aria-sort` headers and a PR badge; `formatPace` from `lib/content/format.ts` |
| `MasonryGallery` + `Lightbox` | CSS columns for masonry. A `<dialog>`-based lightbox with a focus trap, arrows, Esc and swipe.    |
| `CaseStudyLayout`             | Cover, sidebar metadata, MDX body, next/previous                                                  |
| `StackFilter`                 | Chips that sync with `?stack=` via `useSearchParams`                                              |
| `OgTemplate`                  | Shared `next/og` layout: `({ path, title }) => ImageResponse`                                     |
| `JsonLd`                      | `<script type="application/ld+json">` helper                                                      |

## 5. Acceptance criteria

| ID     | Criterion                                                                                                                        |
| ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| P6-AC1 | Every route in §4.1 returns 200 on the preview (bypass cookie) and appears in `/sitemap.xml`.                                    |
| P6-AC2 | Each page has a unique title, description and OG image (checked with an OG preview tool).                                        |
| P6-AC3 | `/projects/does-not-exist` and `/nope` return the branded 404 with status 404.                                                   |
| P6-AC4 | Race table sorts by every column with keyboard and mouse. PRs are highlighted. It scrolls sideways at 360px without page scroll. |
| P6-AC5 | Lightbox: opens on click and Enter, arrows navigate, Esc closes and focus returns to the thumbnail, swipe works on touch.        |
| P6-AC6 | Rich Results Test validates the `Person` and `BreadcrumbList` JSON-LD.                                                           |
| P6-AC7 | axe: no violations on any page. Lighthouse (mobile) Accessibility 100 and SEO 100 on each.                                       |
| P6-AC8 | `/now` shows the correct "Updated on" date, and the staleness note appears when the date is over 60 days old (unit test).        |

## 6. Open questions

| Question                                               | Default if unanswered                                                                                  |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Résumé: a static PDF in `public/` or a generated page? | A static PDF at `/static/resume.pdf`, replaced by hand.                                                |
| Gallery image hosting: in the repo or an image CDN?    | In the repo (`public/static/images/gallery/`), WebP at most 2000px wide. Revisit past about 60 images. |
| Should `/projects` show draft projects?                | No. Drafts only appear on the homepage (with chips) until real ones exist.                             |
