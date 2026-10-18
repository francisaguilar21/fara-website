import { renderPageOg } from '@/lib/og'

export const alt = 'Francis Aguilar: Now'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return renderPageOg({
    path: '/now',
    title: 'Now',
    subtitle: "What I'm focused on this month.",
  })
}
