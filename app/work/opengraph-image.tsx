import { renderPageOg } from '@/lib/og'

export const alt = 'Francis Aguilar: Work'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return renderPageOg({
    path: '/work',
    title: 'Work',
    subtitle: 'Experience, milestones, certifications and recommendations.',
  })
}
