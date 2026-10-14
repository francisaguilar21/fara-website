type Redirect = { source: string; destination: string; permanent: true }

// Permanent redirects (308) from old URLs to their new homes (P4-R12). Kept apart from
// `next.config.ts` so they can be unit tested.
//
// Every destination is final, so nothing redirects twice. Next.js applies the first rule that
// matches, so the specific `/blog/...` rules come before the `/blog/:slug` catch-all.
export const redirects: Redirect[] = [
  // The 2024 site's own redirects: tag pages and pagination moved into the blog.
  { source: '/tags/:tag', destination: '/writings/tags/:tag', permanent: true },
  { source: '/tags', destination: '/writings', permanent: true },
  { source: '/blog/page/:n', destination: '/writings', permanent: true },
  { source: '/about', destination: '/', permanent: true },
  { source: '/feed.xml', destination: '/rss.xml', permanent: true },

  // Decision D5: the blog moved from `/blog` to `/writings`. The 2024 post URLs are indexed by
  // search engines, so every one of them keeps working.
  { source: '/blog', destination: '/writings', permanent: true },
  { source: '/blog/tags/:tag', destination: '/writings/tags/:tag', permanent: true },
  { source: '/blog/:slug', destination: '/writings/:slug', permanent: true },
]
