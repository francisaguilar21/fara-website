// @vitest-environment node
import { readFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { getGallery } from '@/lib/content'
import {
  filterGallery,
  galleryTags,
  nextIndex,
  previousIndex,
  swipeDirection,
} from '@/lib/life/gallery'

const images = [
  { src: 'a', tag: 'race' as const },
  { src: 'b', tag: 'life' as const },
  { src: 'c', tag: 'race' as const },
]

describe('gallery images (P6-R12, P6-T13)', () => {
  const gallery = getGallery()

  it.each(gallery.map((image) => image.src))('%s is a WebP no wider than 2000px', async (src) => {
    const file = readFileSync(path.join(process.cwd(), 'public', src))
    const { format, width } = await sharp(file).metadata()
    expect(format).toBe('webp')
    expect(width).toBeLessThanOrEqual(2000)
  })

  it('describes every photo (the schema needs 10+ characters of alt text)', () => {
    expect(gallery.every((image) => image.alt.length >= 10)).toBe(true)
  })
})

describe('filter chips', () => {
  it('lists the tags in use once, in order of first appearance', () => {
    expect(galleryTags(images)).toEqual(['race', 'life'])
  })

  it('filters by tag, and keeps everything for "All"', () => {
    expect(filterGallery(images, 'race').map((image) => image.src)).toEqual(['a', 'c'])
    expect(filterGallery(images, null)).toBe(images)
    expect(filterGallery(images, 'travel')).toEqual([])
  })
})

describe('lightbox navigation', () => {
  it('wraps around at both ends', () => {
    expect(nextIndex(2, 3)).toBe(0)
    expect(nextIndex(0, 3)).toBe(1)
    expect(previousIndex(0, 3)).toBe(2)
    expect(previousIndex(2, 3)).toBe(1)
  })

  it('reads a swipe left as next and right as previous, and ignores short drags', () => {
    expect(swipeDirection(-80)).toBe('next')
    expect(swipeDirection(80)).toBe('previous')
    expect(swipeDirection(30)).toBeNull()
    expect(swipeDirection(-47)).toBeNull()
    expect(swipeDirection(-48)).toBe('next')
  })
})
