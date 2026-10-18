import type { MetadataRoute } from 'next'
import { getPage, getPosts, getProjects } from '@/lib/content'
import { buildSitemap } from '@/lib/content/feeds'
import { siteUrl } from '@/lib/site-url'

// Inner pages, besides the case studies and the writings (which come from the content). Each
// route of Phase 6 is added here in the PR that ships it (P6-R3).
const PAGES = [
  '/work',
  '/projects',
  '/life',
  '/life/running',
  '/life/community',
  '/now',
  '/uses',
  '/contact',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap({
    posts: getPosts(),
    siteUrl,
    pages: [
      ...PAGES,
      '/life/gallery',
      // Pages made from a content file are 404 while that file is a hidden draft.
      ...(getPage('life/building') ? ['/life/building'] : []),
    ],
    projects: getProjects(),
  })
}
