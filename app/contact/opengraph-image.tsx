import { renderPageOg } from '@/lib/og'

export const alt = 'Francis Aguilar: Contact'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return renderPageOg({
    path: '/contact',
    title: 'Contact',
    subtitle: 'Send a note or book a 30-minute call.',
  })
}
