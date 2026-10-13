import { describe, expect, it } from 'vitest'
import { scrollProgress } from '@/lib/use-scroll-progress'

const VH = 1000

describe('scrollProgress', () => {
  describe('a crossing of the whole screen (parallax: start at the bottom, end at the top)', () => {
    const crossing = { startAt: 1, endAt: 0 }
    const progress = (top: number, height = 400) => scrollProgress({ top, height }, VH, crossing)

    it('is 0 when the top edge reaches the bottom of the screen, and before', () => {
      expect(progress(1000)).toBe(0)
      expect(progress(1500)).toBe(0)
    })

    it('is 1 when the bottom edge reaches the top of the screen, and after', () => {
      expect(progress(-400)).toBe(1)
      expect(progress(-900)).toBe(1)
    })

    it('is linear in between, and 0.5 when the element is centered', () => {
      // A 400px element is centered with its top at 300px.
      expect(progress(300)).toBeCloseTo(0.5, 10)
      expect(progress(1000 - 0.25 * 1400)).toBeCloseTo(0.25, 10)
    })
  })

  describe('the timeline fill (start at 70% of the screen, end at 50%)', () => {
    const drawing = { startAt: 0.7, endAt: 0.5 }
    const progress = (top: number, height: number) => scrollProgress({ top, height }, VH, drawing)

    it('starts when the top edge reaches 70% and ends when the bottom edge reaches 50%', () => {
      expect(progress(700, 2000)).toBe(0)
      expect(progress(701, 2000)).toBe(0)
      // The bottom edge (top + height) is at 500.
      expect(progress(500 - 2000, 2000)).toBe(1)
      expect(progress(-2000, 2000)).toBe(1)
    })

    it('is the same fraction as Motion with offset [start 70%, end 50%]', () => {
      // Halfway: the top has moved half of (height + 20% of the screen) from 70%.
      const height = 2000
      const top = 700 - 0.5 * (height + 200)
      expect(progress(top, height)).toBeCloseTo(0.5, 10)
    })
  })

  it('handles an element too short to have a window', () => {
    const range = { startAt: 0.5, endAt: 0.9 }
    // distance = 0 + (0.5 - 0.9) * 1000 < 0
    expect(scrollProgress({ top: 400, height: 0 }, VH, range)).toBe(1)
    expect(scrollProgress({ top: 600, height: 0 }, VH, range)).toBe(0)
  })
})
