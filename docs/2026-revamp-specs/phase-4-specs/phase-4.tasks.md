# Phase 4: Content layer & blog parity · Tasks

Specs: [phase-4.specs.md](./phase-4.specs.md)

## PR 1: Content layer (`feat(blog): add Velite content layer and schemas`)

- [x] **P4-T01** · Claude · `pnpm add velite zod rehype-pretty-code shiki rehype-slug rehype-autolink-headings remark-gfm` → P4-R1
- [x] **P4-T02** · Claude · `velite.config.ts` with `posts`, `projects` and `pages`; Velite wired into `next.config.ts`; `.velite/` added to `.gitignore` → P4-R1
- [x] **P4-T03** · Claude · `git mv data/blog/*.mdx content/blog/`. Rename the template to `_template.mdx`. Apply the fixes in [specs §4.5](./phase-4.specs.md#45-content-fixes-made-while-moving). → P4-R4, P4-R5
- [x] **P4-T04** · Claude · `lib/content/schemas.ts` and placeholder data files in `content/` (marked `draft: true`; real content arrives in Phases 5–6) → P4-R2, P4-R3
- [x] **P4-T05** · Claude · `lib/content/index.ts` getters (filter drafts in production) and `lib/content/format.ts` (dates, pace, durations) → P4-R3
- [x] **P4-T06** · Claude · Unit tests: every data file passes its schema; draft posts are filtered in production; slug derivation; pace formatting → P4-R1–R3

## PR 2: Blog pages (`feat(blog): add blog index, tags and post pages`)

- [ ] **P4-T07** · Claude · MDX components: `Figure` (build-time image size), links, code, `Callout`, tables → P4-R6, P4-R7
- [ ] **P4-T08** · Claude · `/blog/[slug]` post page ([specs P4-R8](./phase-4.specs.md#3-requirements)) → P4-R8
- [ ] **P4-T09** · Claude · `/blog` index and `/blog/tags/[tag]` → P4-R9
- [ ] **P4-T10** · Claude · Root `generateMetadata` defaults and per-post metadata → P4-R13
- [ ] **P4-T11** · Claude · Compare the rendered text of all 3 posts with the 2024 site (P4-AC1) and check CLS (P4-AC2) → P4-R4, P4-R6

## PR 3: SEO plumbing (`feat(seo): add feeds, sitemap, OG images and 2024 redirects`)

- [ ] **P4-T12** · Claude · `app/rss.xml/route.ts`, `app/sitemap.ts`, `app/robots.ts` → P4-R10
- [ ] **P4-T13** · Claude · `opengraph-image.tsx` (site default + per post) → P4-R11
- [ ] **P4-T14** · Claude · Redirects in `next.config.ts` → P4-R12
- [ ] **P4-T15** · Claude · Playwright: post URLs return 200, redirects return 308 with the right targets, RSS is served as XML → P4-AC1, P4-AC4
- [ ] **P4-T16** · Claude · Validate the feed and OG images (P4-AC5, P4-AC6). Run Lighthouse on a post (P4-AC10). → P4-R10, P4-R11

## After merge

- [ ] **P4-T17** · Francis · In Vercel (Production), set `MAINTENANCE_ALLOWED_PATHS=/blog,/rss.xml` and redeploy → P4-R14
- [ ] **P4-T18** · Claude · Check P4-AC9 against production → P4-R14
- [ ] **P4-T19** · Francis · In Google Search Console, submit `/sitemap.xml` and check that the post URLs are indexed → P4-R10

## Done when

All of P4-AC1 to P4-AC10 in the specs pass.
