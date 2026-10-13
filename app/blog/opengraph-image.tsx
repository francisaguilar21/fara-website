import { renderOgImage } from '@/lib/og'

export const alt = 'Francis Aguilar: Writing'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// For /blog. It lives under /blog on purpose, like the post and tag images: that prefix stays
// public during maintenance (`MAINTENANCE_ALLOWED_PATHS=/blog,/rss.xml`), so shared links to the
// blog get their image too. The site default at `/opengraph-image` would be a 503 then.
export default function Image() {
  return renderOgImage({
    eyebrow: 'francisaguilar.co/blog',
    title: 'Writing',
    subtitle: 'Notes on technology, entrepreneurship and fitness.',
  })
}
