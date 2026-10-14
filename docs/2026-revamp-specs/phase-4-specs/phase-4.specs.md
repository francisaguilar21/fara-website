# Phase 4: Content layer & blog parity · Specs

| Status      | Depends on | Ships as                                                                 | Effort |
| ----------- | ---------- | ------------------------------------------------------------------------ | ------ |
| In progress | Phase 3    | 3 PRs: content layer + schemas → blog pages → SEO (feeds, OG, redirects) | 2 days |

References: [DESIGN §4](../design/DESIGN.md#4-information-architecture), [DESIGN §12](../design/DESIGN.md#12-content-model), [plan §2.1](../2026-revamp-plan.md#21-maintenance-mode)

## 1. Goal

A typed, validated content layer for every content type in the design. The blog runs on it with
**the same URLs** as the 2024 site, so the posts can come back online (via
`MAINTENANCE_ALLOWED_PATHS`) long before launch.

## 2. Scope

**In**

- Velite setup and every content schema
- Moving the posts
- Blog index, tag and post pages
- MDX components needed by the existing posts
- RSS, sitemap and robots
- Generated OG images
- Redirects from 2024 URLs

**Out**

- Homepage and inner pages that consume the content (Phases 5–6)
- Real content for experience, projects and the rest. Placeholder entries marked `draft: true` are fine.

## 3. Requirements

| ID     | Requirement                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P4-R1  | Velite builds the MDX collections `posts`, `projects` and `pages` (for `now.mdx` and `life/building.mdx`) with Zod schemas. A schema error fails the build with the file and field named.                                                                                                                                                                                                                                 |
| P4-R2  | The structured data files (`experience`, `certifications`, `recommendations`, `races`, `talks`, `gallery`, `uses`, `site`) are typed TypeScript modules in `content/`, validated by Zod schemas in `lib/content/schemas.ts`.                                                                                                                                                                                              |
| P4-R3  | Every non-blog entry supports `draft?: boolean`. Draft entries render with `<DraftChip />` (Phase 5 policy) on previews and locally. Where drafts are hidden (`VERCEL_ENV=production`, or `HIDE_DRAFTS=1`, via `shouldHideDrafts()` in `lib/content/visibility.ts`) every getter leaves them out, so production pages, feeds and the sitemap never contain one. `getSite()` is the exception: it always returns the site. |
| P4-R4  | Posts move to `content/blog/`. **The slug is the filename without the extension**, so these URLs are unchanged: `/blog/231221-hello-world`, `/blog/240108-posthog-over-google-analytics`, `/blog/240112-a-commitment-to-change`.                                                                                                                                                                                          |
| P4-R5  | The post frontmatter schema accepts the existing fields (`title`, `date`, `lastmod`, `tags`, `images`, `draft`, `summary`, plus the optional and ignored `authors`, `layout`, `canonicalUrl`), so the posts move without content edits other than §4.5.                                                                                                                                                                   |
| P4-R6  | Post images keep their `/static/images/...` paths. MDX `img` renders through a `<Figure />` that sets intrinsic `width`/`height` at build time, so there's no layout shift.                                                                                                                                                                                                                                               |
| P4-R7  | Code blocks are highlighted at build time with `rehype-pretty-code` + Shiki, with light and dark themes that follow `data-theme`. At minimum `javascript`, `typescript`, `http`, `bash`, `json` and `tsx`.                                                                                                                                                                                                                |
| P4-R8  | Post page: title, date, last-updated date, reading time, tags, cover image, prose, heading anchors, previous/next links, back to `/blog`. Uses DESIGN typography (Space Grotesk headings, rose links, mono inline code).                                                                                                                                                                                                  |
| P4-R9  | `/blog` lists all published posts, newest first, with date, title, summary and reading time. `/blog/tags/[tag]` filters by tag. Tag slugs are lowercase and hyphenated.                                                                                                                                                                                                                                                   |
| P4-R10 | `/rss.xml` (RSS 2.0, full summaries), `sitemap.ts` (all published routes with `lastModified`) and `robots.ts` (allow all, link to the sitemap).                                                                                                                                                                                                                                                                           |
| P4-R11 | OG images generated with `next/og`: the site default plus one per post. 1200×630, F/A mark, title in Space Grotesk, rose slash, both under 100 kB.                                                                                                                                                                                                                                                                        |
| P4-R12 | Permanent redirects (308) from 2024 URLs: `/tags/:tag` → `/blog/tags/:tag`, `/tags` → `/blog`, `/blog/page/:n` → `/blog`, `/about` → `/`, `/feed.xml` → `/rss.xml`.                                                                                                                                                                                                                                                       |
| P4-R13 | Per-page metadata through the `generateMetadata` API: title template `%s · Francis Aguilar`, description, canonical URL from `NEXT_PUBLIC_SITE_URL`, OG/Twitter cards.                                                                                                                                                                                                                                                    |
| P4-R14 | After merge, `MAINTENANCE_ALLOWED_PATHS=/blog,/rss.xml` brings the posts back online in production. The 2024 post URLs return 200, not 503.                                                                                                                                                                                                                                                                               |

## 4. Technical design

### 4.1 Content layout

```
content/
  blog/            231221-hello-world.mdx · 240108-posthog-over-google-analytics.mdx · 240112-a-commitment-to-change.mdx · _template.mdx
  projects/        fitscovery.mdx · francisaguilar-co.mdx · …        (draft placeholders until real content)
  pages/           now.mdx · life/building.mdx
  experience.ts  certifications.ts  recommendations.ts  races.ts  talks.ts  gallery.ts  uses.ts  site.ts
lib/content/
  schemas.ts       Zod schemas + inferred types for the TS data files
  index.ts         typed getters: getPosts(), getPost(slug), getTags(), getExperience(), …
velite.config.ts
```

### 4.2 Velite

Run it from `next.config.ts`, as the Velite docs recommend for Turbopack. Next.js 16 loads
`next.config.ts` as CommonJS, so top-level `await` fails. Export an async config function instead:

```ts
// next.config.ts
export default async function config(phase: string) {
  if (phase !== PHASE_PRODUCTION_SERVER && !process.env.VELITE_STARTED) {
    process.env.VELITE_STARTED = '1'
    const isDev = phase === PHASE_DEVELOPMENT_SERVER
    const { build } = await import('velite')
    await build({ watch: isDev, clean: !isDev, strict: !isDev })
  }
  return nextConfig
}
```

`strict` makes a schema error fail `next build` (P4-R1); `next dev` only warns. Two more details:

- Velite's `clean` empties its assets folder, which defaults to `public/static`, where the post images
  live. `velite.config.ts` points `output.assets` at `public/static/velite` instead.
- `pnpm typecheck` and `pnpm test` run `pnpm content` first, because `.velite/` is generated and git-ignored.

```ts
// velite.config.ts (posts collection)
const posts = defineCollection({
  name: 'Post',
  pattern: 'blog/!(_)*.mdx',
  schema: s.object({
    slug: s.path().transform((p) => p.replace(/^blog\//, '')),
    title: s.string().max(120),
    date: s.isodate(),
    lastmod: s
      .isodate()
      .optional()
      .or(s.literal('').transform(() => undefined)),
    tags: s.array(s.string()).default([]),
    images: s.array(s.string()).default([]),
    draft: s.boolean().default(false),
    summary: s.string().max(300),
    authors: s.unknown().optional(),
    layout: s.unknown().optional(),
    canonicalUrl: s.unknown().optional(),
    metadata: s.metadata(), // reading time + word count
    toc: s.toc(),
    body: s.mdx(),
  }),
})
```

`mdx` options: `remarkPlugins: [remarkGfm]`,
`rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: { dark: 'github-dark-dimmed', light: 'github-light' } }], [rehypeAutolinkHeadings, { behavior: 'wrap' }]]`.

### 4.3 Data schemas (`lib/content/schemas.ts`)

| Schema           | Fields                                                                                                                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Experience`     | `role`, `org`, `orgUrl?`, `start` (YYYY-MM), `end?` (YYYY-MM, empty = present), `location?`, `kind: 'work' \| 'life'`, `summary`, `highlights: string[]`, `tags: string[]`, `featured: boolean`, `draft?` |
| `Project` (MDX)  | `title`, `slug`, `year`, `role`, `summary`, `outcome?`, `metric?`, `stack: string[]`, `cover?`, `links: { live?, repo? }`, `featured`, `order`, `draft?`                                                  |
| `Certification`  | `name`, `issuer`, `year`, `credentialUrl?`, `draft?`                                                                                                                                                      |
| `Recommendation` | `quote`, `name`, `role`, `company`, `relationship`, `avatar?`, `linkedinUrl?`, `draft?`                                                                                                                   |
| `Race`           | `name`, `date`, `distanceKm`, `time` (h:mm:ss), `pr: boolean`, `role: 'runner' \| 'pacer'`, `resultsUrl?`, `draft?`                                                                                       |
| `Talk`           | `title`, `event`, `date`, `location?`, `slidesUrl?`, `videoUrl?`, `draft?`                                                                                                                                |
| `GalleryImage`   | `src`, `alt` (required, ≥ 10 chars), `caption?`, `date?`, `tag: 'race' \| 'travel' \| 'event' \| 'life'`                                                                                                  |
| `UsesGroup`      | `category`, `items: { name, note?, url? }[]`                                                                                                                                                              |
| `Site`           | `name`, `tagline`, `headline`, `intro`, `location`, `socials`, `resumeUrl?`, `email?`                                                                                                                     |

`pace` and durations are derived in helpers (`lib/content/format.ts`), never stored.

### 4.4 Routes

| Route                         | File                                                             | Notes                                                           |
| ----------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------- |
| `/blog`                       | `app/blog/page.tsx`                                              | Static                                                          |
| `/blog/[slug]`                | `app/blog/[slug]/page.tsx`                                       | `generateStaticParams`, `dynamicParams = false`                 |
| `/blog/tags/[tag]`            | `app/blog/tags/[tag]/page.tsx`                                   | Static                                                          |
| `/rss.xml`                    | `app/rss.xml/route.ts`                                           | `export const dynamic = 'force-static'`                         |
| `/sitemap.xml`, `/robots.txt` | `app/sitemap.ts`, `app/robots.ts`                                |                                                                 |
| OG images                     | `app/opengraph-image.tsx`, `app/blog/[slug]/opengraph-image.tsx` | Fonts loaded from `next/font` files or `fetch` of a bundled TTF |

MDX components (`components/mdx/`): `Figure` (img), `a` → `UnderlineLink` (external links open in a new
tab with `rel="noopener"`), `pre`/`code` styling, `Callout`, `table` wrapped in an `overflow-x-auto`
container.

### 4.5 Content fixes made while moving

| Post                       | Fix                                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `231221-hello-world.mdx`   | `lastmod: '2023-01-11'` is before the publish date. Change it to `'2024-01-11'`.                                        |
| `000000-blog-template.mdx` | Rename to `_template.mdx`; image path `/public/static/images/logo-black.png` → `/static/images/logo-white-on-black.png` |

### 4.6 Maintenance interaction

Allowed paths are prefix matches, so `/blog` also covers `/blog/[slug]`, the tag pages and the post OG
images. `_next/` assets are already skipped. The site header's links to other pages still lead to
the maintenance page until launch. That's expected.

## 5. Acceptance criteria

| ID      | Criterion                                                                                                                |
| ------- | ------------------------------------------------------------------------------------------------------------------------ |
| P4-AC1  | The 3 post URLs return 200 with the same text as the 2024 site (diff the rendered text).                                 |
| P4-AC2  | All 8 post images load with no layout shift (CLS < 0.05 on each post).                                                   |
| P4-AC3  | Code blocks are highlighted and switch theme with the site.                                                              |
| P4-AC4  | Each redirect in P4-R12 returns 308 to the right target (Playwright test).                                               |
| P4-AC5  | `/rss.xml` passes the W3C feed validator. `/sitemap.xml` lists the blog routes.                                          |
| P4-AC6  | OG images render (check with an OG preview tool) and are under 100 kB.                                                   |
| P4-AC7  | A post with a broken frontmatter field fails `pnpm build` with a clear message (shown once, then reverted).              |
| P4-AC8  | Unit tests validate every data file in `content/` against its schema.                                                    |
| P4-AC9  | After merge and setting `MAINTENANCE_ALLOWED_PATHS`, the 3 post URLs return 200 in production and `/` still returns 503. |
| P4-AC10 | Lighthouse (mobile) on a post: Performance ≥ 95, Accessibility 100, SEO 100.                                             |

## 6. Open questions

| Question                                                                  | Default if unanswered                                                                                       |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Should the posts keep date-prefixed slugs (`231221-…`) for new posts too? | Existing posts keep theirs. New posts use plain slugs (`my-post-title`), and the date lives in frontmatter. |
| Shiki theme pair?                                                         | `github-light` / `github-dark-dimmed`, with the background overridden to `--surface`.                       |
| Comments on posts (the 2024 site had Giscus configured)?                  | No, out of scope for launch (plan §1).                                                                      |
