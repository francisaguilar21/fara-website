import { getPosts } from '@/lib/content'
import { buildRss } from '@/lib/content/feeds'
import { SITE_NAME } from '@/lib/seo'
import { siteUrl } from '@/lib/site-url'

export const dynamic = 'force-static'

export function GET() {
  const xml = buildRss({
    posts: getPosts(),
    siteUrl,
    title: `${SITE_NAME}: Writing`,
    description: 'Notes on technology, entrepreneurship and fitness.',
  })

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
