import { renderPageOg } from '@/lib/og'

export const alt = 'Francis Aguilar: Uses'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return renderPageOg({
    path: '/uses',
    title: 'Uses',
    subtitle: 'Stack, tools and gear.',
  })
}
