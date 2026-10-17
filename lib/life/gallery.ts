export type GalleryTag = 'race' | 'travel' | 'event' | 'life'

/** The tags in use, in the order they first appear, for the filter chips. */
export function galleryTags<T extends { tag: GalleryTag }>(images: T[]): GalleryTag[] {
  return [...new Set(images.map((image) => image.tag))]
}

/** The images with this tag, or all of them for `null` (the "All" chip). */
export function filterGallery<T extends { tag: GalleryTag }>(
  images: T[],
  tag: GalleryTag | null
): T[] {
  return tag ? images.filter((image) => image.tag === tag) : images
}

/** The index after `index`, wrapping around at the end. */
export const nextIndex = (index: number, length: number) => (index + 1) % length

/** The index before `index`, wrapping around at the start. */
export const previousIndex = (index: number, length: number) => (index - 1 + length) % length

/** Which way a horizontal swipe goes: left to the next photo, right to the previous, and short drags do nothing. */
export function swipeDirection(deltaX: number, threshold = 48): 'next' | 'previous' | null {
  if (Math.abs(deltaX) < threshold) return null
  return deltaX < 0 ? 'next' : 'previous'
}
