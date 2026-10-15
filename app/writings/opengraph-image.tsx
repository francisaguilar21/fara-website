import { renderOgImage } from '@/lib/og'

export const alt = 'Francis Aguilar: Writing'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// For /writings. It lives under /writings on purpose, like the post and tag images: that prefix stays
// public during maintenance (`MAINTENANCE_ALLOWED_PATHS=/writings,/rss.xml`), so shared links to the
// writings pages get their image too. The site default at `/opengraph-image` would be a 503 then.
export default function Image() {
  return renderOgImage({
    eyebrow: 'francisaguilar.co/writings',
    title: 'Writing',
    subtitle: 'Notes on technology, entrepreneurship and fitness.',
  })
}
