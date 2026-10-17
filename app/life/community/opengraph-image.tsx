import { renderPageOg } from '@/lib/og'

export const alt = 'Francis Aguilar: Community'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return renderPageOg({
    path: '/life/community',
    title: 'Community',
    subtitle: 'Talks, meetups, events and pacing.',
  })
}
