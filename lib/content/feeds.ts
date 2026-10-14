import type { MetadataRoute } from 'next'
import type { Post } from '.'
import { slugifyTag } from './tags'

// Builders for the RSS feed (`app/rss.xml/route.ts`) and the sitemap (`app/sitemap.ts`). They take
// the posts and the site URL as arguments, so they can be tested without a build.

const escapeXml = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

/** The moment a post last changed: `lastmod` when it has one, else its publish date. */
const modified = (post: Post) => post.lastmod ?? post.date

/** RSS 2.0 for the given posts, newest first. Each item carries the post's summary. */
export function buildRss({
  posts,
  siteUrl,
  title,
  description,
}: {
  posts: Post[]
  siteUrl: string
  title: string
  description: string
}): string {
  const lastBuildDate = posts.reduce<string | undefined>(
    (latest, post) => (!latest || modified(post) > latest ? modified(post) : latest),
    undefined
  )

  const items = posts.map((post) => {
    const url = `${siteUrl}${post.permalink}`
    return [
      '    <item>',
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
      `      <description>${escapeXml(post.summary)}</description>`,
      ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
      '    </item>',
    ].join('\n')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(title)}</title>`,
    `    <link>${escapeXml(siteUrl)}/writings</link>`,
    `    <description>${escapeXml(description)}</description>`,
    '    <language>en-us</language>',
    ...(lastBuildDate
      ? [`    <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>`]
      : []),
    `    <atom:link href="${escapeXml(siteUrl)}/rss.xml" rel="self" type="application/rss+xml"/>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
}

/**
 * Every published route, each with `lastModified`: the home page, the blog, each post and each tag
 * page. Pages and posts from later phases are added here as their routes ship.
 */
export function buildSitemap({
  posts,
  siteUrl,
}: {
  posts: Post[]
  siteUrl: string
}): MetadataRoute.Sitemap {
  const latest = (list: Post[]) =>
    new Date(
      list.reduce((max, post) => (modified(post) > max ? modified(post) : max), list[0]?.date ?? 0)
    )

  const tags = new Map<string, Post[]>()
  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = slugifyTag(tag)
      if (slug) tags.set(slug, [...(tags.get(slug) ?? []), post])
    }
  }

  return [
    { url: siteUrl, lastModified: latest(posts) },
    { url: `${siteUrl}/writings`, lastModified: latest(posts) },
    ...posts.map((post) => ({
      url: `${siteUrl}${post.permalink}`,
      lastModified: new Date(modified(post)),
    })),
    ...[...tags].map(([slug, tagged]) => ({
      url: `${siteUrl}/writings/tags/${slug}`,
      lastModified: latest(tagged),
    })),
  ]
}
