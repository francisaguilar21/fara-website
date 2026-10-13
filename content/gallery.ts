import type { GalleryImage } from '@/lib/content/schemas'

// Starter photos cropped from the 2023 fitness collage (the same ones as the design mockup), with
// placeholder captions. The homepage shows the first five. The real gallery (10 to 20 photos)
// arrives with the Phase 6 content.
export const gallery: GalleryImage[] = [
  {
    src: '/static/images/gallery/road.webp',
    alt: 'Francis running down a tree-lined road in a blue shirt',
    caption: 'Road',
    tag: 'life',
    draft: true,
  },
  {
    src: '/static/images/gallery/obstacle-race.webp',
    alt: 'Francis leaping between floating platforms on an obstacle course',
    caption: 'Obstacle race',
    tag: 'race',
    draft: true,
  },
  {
    src: '/static/images/gallery/run-club.webp',
    alt: 'Francis smiling in an orange run club shirt and sunglasses',
    caption: 'Run club',
    tag: 'event',
    draft: true,
  },
  {
    src: '/static/images/gallery/trail.webp',
    alt: 'Francis on a rainy mountain trail with an orange backpack',
    caption: 'Trail',
    tag: 'travel',
    draft: true,
  },
  {
    src: '/static/images/gallery/rings.webp',
    alt: 'Francis swinging across the rings on an obstacle course',
    caption: 'Rings',
    tag: 'race',
    draft: true,
  },
  {
    src: '/static/images/2401/2401-12-2019-photos.webp',
    alt: 'Photos of Francis from 2018 and 2019',
    caption: 'Placeholder caption',
    tag: 'life',
    draft: true,
  },
]
