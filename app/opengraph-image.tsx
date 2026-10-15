import { renderOgImage } from '@/lib/og'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo'

export const alt = `${SITE_NAME}. ${SITE_DESCRIPTION}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// The site default: every page without a more specific image uses it.
export default function Image() {
  return renderOgImage({
    eyebrow: 'francisaguilar.co',
    title: SITE_NAME,
    subtitle: SITE_DESCRIPTION,
  })
}
