import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { defineCollection, defineConfig, s, z } from 'velite'
import { readImageSize, rehypeImages } from './lib/content/rehype-images'

// Fields shared by every MDX collection. `draft` entries are placeholders (DESIGN §12).
const draft = s.boolean().default(false)

// Like `s.isodate()`, which throws a bare "Invalid time value" without the file or field when the
// date is bad. These report it as a normal schema issue instead (P4-R1).
const toIsoDate = (value: string, ctx: z.RefinementCtx) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    ctx.addIssue({ code: 'custom', message: 'Invalid date, expected YYYY-MM-DD' })
    return z.NEVER
  }
  return date.toISOString()
}
const isoDate = () => s.string().transform(toIsoDate)
// The 2024 posts use `lastmod: ''` for "never updated".
const optionalIsoDate = () =>
  s
    .string()
    .optional()
    .transform((value, ctx) => (value ? toIsoDate(value, ctx) : undefined))

// `s.path()` is the file path relative to `content/`, without the extension.
const slugFrom = (dir: string) => s.path().transform((path) => path.replace(`${dir}/`, ''))

const posts = defineCollection({
  name: 'Post',
  // `_template.mdx` and any other `_`-prefixed file is not a post.
  pattern: 'blog/!(_)*.mdx',
  schema: s
    .object({
      // The slug is the filename: `blog/231221-hello-world.mdx` is served at `/writings/231221-hello-world`.
      slug: slugFrom('blog'),
      title: s.string().max(120),
      date: isoDate(),
      lastmod: optionalIsoDate(),
      tags: s.array(s.string()).default([]),
      images: s.array(s.string()).default([]),
      draft,
      summary: s.string().max(300),
      // Accepted from the 2024 frontmatter and ignored.
      authors: s.unknown().optional(),
      layout: s.unknown().optional(),
      canonicalUrl: s.unknown().optional(),
      metadata: s.metadata(), // reading time + word count
      toc: s.toc(),
      raw: s.raw(),
      body: s.mdx(),
    })
    .transform(async ({ raw, ...post }, ctx) => {
      // The cover is the first image in the frontmatter. The 2024 posts already show it as the
      // banner at the top of the body, so the page only adds its own when the body doesn't.
      let cover: { src: string; width: number; height: number; inBody: boolean } | undefined
      const [src] = post.images
      if (src) {
        try {
          cover = { src, ...(await readImageSize(src)), inBody: raw.includes(`](${src})`) }
        } catch (error) {
          ctx.addIssue({ code: 'custom', message: (error as Error).message, path: ['images', 0] })
        }
      }
      return { ...post, permalink: `/writings/${post.slug}`, cover }
    }),
})

const projects = defineCollection({
  name: 'Project',
  pattern: 'projects/*.mdx',
  schema: s.object({
    slug: slugFrom('projects'),
    title: s.string().max(120),
    year: s.number().int().min(2000),
    role: s.string(),
    summary: s.string().max(300),
    outcome: s.string().optional(),
    metric: s.string().optional(),
    stack: s.array(s.string()).default([]),
    // Path under `public/`, for example `/static/images/projects/fitscovery.webp`.
    cover: s.string().optional(),
    links: s
      .object({ live: s.string().url().optional(), repo: s.string().url().optional() })
      .default({}),
    featured: s.boolean().default(false),
    order: s.number().int().default(0),
    draft,
    body: s.mdx(),
  }),
})

// Long-form pages: `pages/now.mdx` -> `now`, `pages/life/building.mdx` -> `life/building`.
const pages = defineCollection({
  name: 'Page',
  pattern: 'pages/**/*.mdx',
  schema: s.object({
    slug: slugFrom('pages'),
    title: s.string().max(120),
    updatedAt: optionalIsoDate(),
    // The `now` page feeds the homepage strip (Phase 5): NOW / READING / BUILDING.
    focus: s.string().optional(),
    reading: s.string().optional(),
    building: s.string().optional(),
    draft,
    toc: s.toc(),
    body: s.mdx(),
  }),
})

export default defineConfig({
  root: 'content',
  // Velite empties `output.assets` on a clean build, and its default (`public/static`) is where the
  // post images live. Nothing links relative files today, so keep the assets in their own folder.
  output: {
    data: '.velite',
    assets: 'public/static/velite',
    base: '/static/velite/',
  },
  collections: { posts, projects, pages },
  mdx: {
    gfm: false, // remark-gfm is added explicitly below
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeImages,
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          // CSS in `app/globals.css` switches between the two with the site's `data-theme`.
          theme: { dark: 'github-dark-dimmed', light: 'github-light' },
          keepBackground: false,
        },
      ],
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
})
