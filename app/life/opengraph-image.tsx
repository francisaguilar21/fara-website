import { renderPageOg } from '@/lib/og'

export const alt = 'Francis Aguilar: Life'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return renderPageOg({
    path: '/life',
    title: 'Life',
    subtitle: 'Running, community and the startup story.',
  })
}
