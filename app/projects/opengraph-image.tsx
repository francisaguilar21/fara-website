import { renderPageOg } from '@/lib/og'

export const alt = 'Francis Aguilar: Projects'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return renderPageOg({
    path: '/projects',
    title: 'Projects',
    subtitle: 'Products and side projects, with case studies.',
  })
}
