import { renderPageOg } from '@/lib/og'

export const alt = 'Francis Aguilar: Running'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return renderPageOg({
    path: '/life/running',
    title: 'Running',
    subtitle: 'Weekly distance, race log and pacing.',
  })
}
