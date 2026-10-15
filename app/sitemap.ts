import type { MetadataRoute } from 'next'
import { getPosts } from '@/lib/content'
import { buildSitemap } from '@/lib/content/feeds'
import { siteUrl } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap({ posts: getPosts(), siteUrl })
}
