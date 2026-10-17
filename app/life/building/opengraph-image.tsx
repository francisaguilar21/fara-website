import { renderPageOg } from '@/lib/og'

export const alt = 'Francis Aguilar: Building'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return renderPageOg({
    path: '/life/building',
    title: 'Building',
    subtitle: 'The founder story, lessons included.',
  })
}
