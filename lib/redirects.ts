type Redirect = { source: string; destination: string; permanent: true }

// Permanent redirects (308) from 2024 URLs to their new homes (P4-R12). Kept apart from
// `next.config.ts` so they can be unit tested.
export const redirects: Redirect[] = [
  { source: '/tags/:tag', destination: '/blog/tags/:tag', permanent: true },
  { source: '/tags', destination: '/blog', permanent: true },
  { source: '/blog/page/:n', destination: '/blog', permanent: true },
  { source: '/about', destination: '/', permanent: true },
  { source: '/feed.xml', destination: '/rss.xml', permanent: true },
]
