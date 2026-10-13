import type { GalleryImage } from '@/lib/content/schemas'

// Placeholders that reuse the images already in `public/static/images`. The real gallery (10 to 20
// photos) arrives with the Phase 6 content.
export const gallery: GalleryImage[] = [
  {
    src: '/static/images/2401/2401-12-2019-photos.webp',
    alt: 'Photos of Francis from 2018 and 2019',
    caption: 'Placeholder caption',
    tag: 'life',
    draft: true,
  },
  {
    src: '/static/images/2301/2301-fitness-banner.webp',
    alt: 'Fitness banner from the first blog post',
    caption: 'Placeholder caption',
    tag: 'life',
    draft: true,
  },
  {
    src: '/static/images/2301/2301-tech-banner.webp',
    alt: 'Technology banner from the first blog post',
    caption: 'Placeholder caption',
    tag: 'event',
    draft: true,
  },
]
