// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { Post } from '@/lib/content'
import { buildRss, buildSitemap } from '@/lib/content/feeds'
import { ogText } from '@/lib/og'
import { redirects } from '@/lib/redirects'

const post = (overrides: Partial<Post>): Post =>
  ({
    slug: 'a-post',
    title: 'A post',
    date: '2024-01-08T00:00:00.000Z',
    tags: [],
    images: [],
    draft: false,
    summary: 'A summary.',
    permalink: '/writings/a-post',
    metadata: { readingTime: 1, wordCount: 10 },
    ...overrides,
  }) as Post

const posts = [
  post({
    slug: 'new',
    permalink: '/writings/new',
    title: 'Fish & Chips <3 "quotes"',
    date: '2024-01-12T00:00:00.000Z',
    summary: "It's <b>fine</b> & done.",
    tags: ['Machine Learning', 'web'],
  }),
  post({
    slug: 'old',
    permalink: '/writings/old',
    date: '2023-12-21T00:00:00.000Z',
    lastmod: '2024-01-11T00:00:00.000Z',
    tags: ['web'],
  }),
]

describe('buildRss', () => {
  const xml = buildRss({
    posts,
    siteUrl: 'https://example.com',
    title: 'Writing',
    description: 'Notes.',
  })

  it('is RSS 2.0 with the channel details and a self link', () => {
    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>\n<rss version="2.0" /)
    expect(xml).toContain('<title>Writing</title>')
    expect(xml).toContain('<link>https://example.com/writings</link>')
    expect(xml).toContain('<atom:link href="https://example.com/rss.xml" rel="self"')
    expect(xml).toContain('<language>en-us</language>')
  })

  it('has an item per post with link, guid, RFC 822 date, summary and tags', () => {
    expect(xml.match(/<item>/g)).toHaveLength(2)
    expect(xml).toContain('<link>https://example.com/writings/new</link>')
    expect(xml).toContain('<guid isPermaLink="true">https://example.com/writings/new</guid>')
    expect(xml).toContain('<pubDate>Fri, 12 Jan 2024 00:00:00 GMT</pubDate>')
    expect(xml).toContain('<category>Machine Learning</category>')
  })

  it('escapes XML in titles and summaries', () => {
    expect(xml).toContain('<title>Fish &amp; Chips &lt;3 &quot;quotes&quot;</title>')
    expect(xml).toContain(
      '<description>It&apos;s &lt;b&gt;fine&lt;/b&gt; &amp; done.</description>'
    )
  })

  it('dates the feed by the most recent change', () => {
    expect(xml).toContain('<lastBuildDate>Fri, 12 Jan 2024 00:00:00 GMT</lastBuildDate>')
  })

  it('still produces a valid empty feed', () => {
    const empty = buildRss({
      posts: [],
      siteUrl: 'https://example.com',
      title: 'T',
      description: 'D',
    })
    expect(empty).not.toContain('<item>')
    expect(empty).not.toContain('lastBuildDate')
  })
})

describe('buildSitemap', () => {
  const entries = buildSitemap({ posts, siteUrl: 'https://example.com' })
  const urls = entries.map((entry) => entry.url)

  it('lists the home page, the blog, every post and every tag page', () => {
    expect(urls).toEqual([
      'https://example.com',
      'https://example.com/writings',
      'https://example.com/writings/new',
      'https://example.com/writings/old',
      'https://example.com/writings/tags/machine-learning',
      'https://example.com/writings/tags/web',
    ])
  })

  it('gives each entry a lastModified, using lastmod when a post has one', () => {
    for (const entry of entries) expect(entry.lastModified).toBeInstanceOf(Date)
    const byUrl = Object.fromEntries(entries.map((e) => [e.url, e.lastModified]))
    expect(byUrl['https://example.com/writings/old']).toEqual(new Date('2024-01-11T00:00:00.000Z'))
    expect(byUrl['https://example.com/writings']).toEqual(new Date('2024-01-12T00:00:00.000Z'))
    expect(byUrl['https://example.com/writings/tags/web']).toEqual(
      new Date('2024-01-12T00:00:00.000Z')
    )
  })
})

describe('redirects (P4-R12)', () => {
  it('are all permanent', () => {
    expect(redirects.every((redirect) => redirect.permanent)).toBe(true)
  })

  it('cover the 2024 URLs and the move from /blog to /writings', () => {
    expect(redirects.map(({ source, destination }) => [source, destination])).toEqual([
      ['/tags/:tag', '/writings/tags/:tag'],
      ['/tags', '/writings'],
      ['/blog/page/:n', '/writings'],
      ['/about', '/'],
      ['/feed.xml', '/rss.xml'],
      ['/blog', '/writings'],
      ['/blog/tags/:tag', '/writings/tags/:tag'],
      ['/blog/:slug', '/writings/:slug'],
    ])
  })

  it('put the specific /blog rules before the /blog/:slug catch-all', () => {
    const sources = redirects.map((redirect) => redirect.source)
    const catchAll = sources.indexOf('/blog/:slug')
    expect(sources.indexOf('/blog')).toBeLessThan(catchAll)
    expect(sources.indexOf('/blog/page/:n')).toBeLessThan(catchAll)
    expect(sources.indexOf('/blog/tags/:tag')).toBeLessThan(catchAll)
  })

  it('never redirect to another redirect', () => {
    const sources = new Set(redirects.map((redirect) => redirect.source))
    for (const { destination } of redirects) {
      expect(destination.startsWith('/blog'), destination).toBe(false)
      expect(sources.has(destination), destination).toBe(false)
    }
  })
})

describe('ogText', () => {
  it('drops emoji, which the card has no font for, and tidies the spaces', () => {
    expect(ogText('Hello World! 👋')).toBe('Hello World!')
    expect(ogText('Rocket 🚀 launch 🏃🏼 day')).toBe('Rocket launch day')
    expect(ogText('Plain title')).toBe('Plain title')
  })
})
