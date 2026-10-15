// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { GalleryStrip } from '@/components/home/GalleryStrip'

describe('GalleryStrip', () => {
  it('renders nothing when every photo is a hidden draft, instead of an empty box', async () => {
    expect(await GalleryStrip({ images: [] })).toBeNull()
  })
})
