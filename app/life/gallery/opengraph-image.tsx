import { renderPageOg } from '@/lib/og'

export const alt = 'Francis Aguilar: Gallery'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return renderPageOg({
    path: '/life/gallery',
    title: 'Gallery',
    subtitle: 'Photos from races, trips and everyday life.',
  })
}
