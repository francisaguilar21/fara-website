/**
 * Canonical origin of the site, without a trailing slash. Set `NEXT_PUBLIC_SITE_URL` (see
 * `.env.example`); production is the fallback, so a missing variable can't point canonical URLs,
 * feeds or the sitemap at localhost.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://francisaguilar.co').replace(
  /\/+$/,
  ''
)
