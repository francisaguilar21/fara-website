// @vitest-environment node
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { posts } from '#site/content'
import { getAdjacentPosts, getPost, getPosts, getTags } from '@/lib/content'

// These run against the real build output, so `pnpm test` builds the content first.
describe('posts from content/blog', () => {
  const files = readdirSync(join(process.cwd(), 'content/blog')).filter((f) => f.endsWith('.mdx'))
  const slugs = posts.map((post) => post.slug)

  it('derives each slug from the filename, so the 2024 URLs are unchanged', () => {
    expect(slugs).toEqual(
      expect.arrayContaining([
        '231221-hello-world',
        '240108-posthog-over-google-analytics',
        '240112-a-commitment-to-change',
      ])
    )
    for (const post of posts) {
      expect(files).toContain(`${post.slug}.mdx`)
      expect(post.permalink).toBe(`/blog/${post.slug}`)
    }
  })

  it('skips files that start with an underscore', () => {
    expect(files).toContain('_template.mdx')
    expect(slugs).not.toContain('_template')
    expect(posts).toHaveLength(files.filter((f) => !f.startsWith('_')).length)
  })

  it('normalizes dates and drops an empty lastmod', () => {
    const hello = posts.find((post) => post.slug === '231221-hello-world')
    expect(hello?.date).toBe('2023-12-21T00:00:00.000Z')
    expect(hello?.lastmod).toBe('2024-01-11T00:00:00.000Z')
    expect(
      posts.find((post) => post.slug === '240112-a-commitment-to-change')?.lastmod
    ).toBeUndefined()
  })

  it('computes the reading time', () => {
    for (const post of posts) expect(post.metadata.readingTime).toBeGreaterThan(0)
  })
})

describe('post getters', () => {
  it('returns published posts newest first', () => {
    expect(getPosts().map((post) => post.slug)).toEqual([
      '240112-a-commitment-to-change',
      '240108-posthog-over-google-analytics',
      '231221-hello-world',
    ])
    expect(getPosts({ limit: 1 })).toHaveLength(1)
  })

  it('finds a post by slug', () => {
    expect(getPost('231221-hello-world')?.title).toBe('Hello World! 👋')
    expect(getPost('missing')).toBeUndefined()
  })

  it('filters by tag slug and counts tags', () => {
    expect(getPosts({ tag: 'fitness' }).map((post) => post.slug)).toEqual([
      '240112-a-commitment-to-change',
      '231221-hello-world',
    ])
    expect(getPosts({ tag: 'nope' })).toEqual([])
    const tags = getTags()
    expect(tags.find((tag) => tag.slug === 'fitness')).toEqual({
      slug: 'fitness',
      label: 'fitness',
      count: 2,
    })
    // Most used first.
    expect(tags[0]?.count).toBeGreaterThanOrEqual(tags[tags.length - 1]?.count ?? 0)
  })

  it('links each post to its older and newer neighbour', () => {
    expect(getAdjacentPosts('240108-posthog-over-google-analytics')).toMatchObject({
      previous: { slug: '231221-hello-world' },
      next: { slug: '240112-a-commitment-to-change' },
    })
    expect(getAdjacentPosts('231221-hello-world').previous).toBeUndefined()
    expect(getAdjacentPosts('240112-a-commitment-to-change').next).toBeUndefined()
    expect(getAdjacentPosts('missing')).toEqual({})
  })
})

// P4-R3: draft posts are hidden in production and visible in development.
describe('draft posts', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
    vi.doUnmock('#site/content')
  })

  async function loadWithDraft() {
    const post = (slug: string, date: string, draft: boolean, tags: string[]) => ({
      slug,
      title: slug,
      date,
      draft,
      tags,
      images: [],
      summary: '',
      permalink: `/blog/${slug}`,
      metadata: { readingTime: 1, wordCount: 100 },
    })
    vi.resetModules() // the imports above already loaded the real content
    vi.doMock('#site/content', () => ({
      posts: [
        post('published-old', '2024-01-01T00:00:00.000Z', false, ['web']),
        post('secret-draft', '2025-01-01T00:00:00.000Z', true, ['secret']),
        post('published-new', '2024-06-01T00:00:00.000Z', false, ['web']),
      ],
      projects: [],
      pages: [],
    }))
    return import('@/lib/content')
  }

  it('hides them in production from every getter', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const content = await loadWithDraft()
    expect(content.getPosts().map((p) => p.slug)).toEqual(['published-new', 'published-old'])
    expect(content.getPost('secret-draft')).toBeUndefined()
    expect(content.getPosts({ tag: 'secret' })).toEqual([])
    expect(content.getTags().map((t) => t.slug)).toEqual(['web'])
    expect(content.getAdjacentPosts('published-new').next).toBeUndefined()
  })

  it('shows them in development', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const content = await loadWithDraft()
    expect(content.getPosts().map((p) => p.slug)).toEqual([
      'secret-draft',
      'published-new',
      'published-old',
    ])
    expect(content.getPost('secret-draft')?.draft).toBe(true)
  })
})
