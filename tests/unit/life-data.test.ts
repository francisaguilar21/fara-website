// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { splitEmphasis } from '@/lib/home/emphasis'
import { formatKm, formatRunStart } from '@/lib/home/format'
import { describeWeeklyBars, weeklyBarsGeometry } from '@/lib/home/weekly-bars'
import { STRAVA_SAMPLE } from '@/lib/integrations/fallbacks'
import { getBlurDataURL } from '@/lib/images'

describe('weeklyBarsGeometry', () => {
  const weeks = STRAVA_SAMPLE.weeks
  const geometry = weeklyBarsGeometry(weeks)
  const top = 18
  const bottom = 20
  const plot = geometry.height - top - bottom

  it('draws one bar per week, in order, and marks only the last as the current week', () => {
    expect(geometry.bars).toHaveLength(12)
    expect(geometry.bars.map((bar) => bar.km)).toEqual(weeks.map((week) => week.km))
    expect(geometry.bars.filter((bar) => bar.current)).toHaveLength(1)
    expect(geometry.bars.at(-1)?.current).toBe(true)
    const xs = geometry.bars.map((bar) => bar.x)
    expect([...xs].sort((a, b) => a - b)).toEqual(xs)
  })

  it('draws heights to scale from a baseline at 0 km', () => {
    for (const bar of geometry.bars) {
      expect(bar.height).toBeCloseTo((bar.km / geometry.max) * plot, 6)
      // Every bar stands on the same baseline.
      expect(bar.y + bar.height).toBeCloseTo(geometry.height - bottom, 6)
    }
    // Twice the distance, twice the height.
    const doubled = weeklyBarsGeometry([
      { weekStart: '2026-01-05', km: 10 },
      { weekStart: '2026-01-12', km: 20 },
    ])
    expect(doubled.bars[1]!.height).toBeCloseTo(doubled.bars[0]!.height * 2, 6)
  })

  it('tops the axis at the next 5 km above the tallest week, and keeps bars inside the plot', () => {
    expect(geometry.max).toBe(45)
    expect(Math.max(...geometry.bars.map((bar) => bar.height))).toBeLessThanOrEqual(plot)
    expect(geometry.gridlines.map((line) => line.km)).toEqual([0, 20, 40])
    // The 0 km gridline is the baseline.
    expect(geometry.gridlines[0]?.y).toBeCloseTo(geometry.height - bottom, 6)
  })

  it('copes with no data and with all-zero weeks', () => {
    expect(weeklyBarsGeometry([]).bars).toEqual([])
    const zeros = weeklyBarsGeometry([{ weekStart: '2026-01-05', km: 0 }])
    expect(zeros.bars[0]?.height).toBe(0)
    expect(zeros.max).toBe(5)
  })

  it('describes the chart in words', () => {
    const text = describeWeeklyBars(weeks, { sample: true })
    expect(text).toContain('last 12 weeks')
    expect(text).toContain('18.4, 22, 25.3')
    expect(text).toContain('This week: 41.2 km')
    expect(text).toContain('Sample data')
    expect(describeWeeklyBars(weeks, { sample: false })).not.toContain('Sample data')
  })
})

describe('format', () => {
  it('formats distances with at most one decimal and a thousands separator', () => {
    expect([41.2, 41, 1284, 10.25].map(formatKm)).toEqual(['41.2', '41', '1,284', '10.3'])
  })

  it('reads a run start in Manila time as weekday and 24-hour time', () => {
    expect(formatRunStart('2026-10-11T06:10:00+08:00')).toBe('Sun 06:10')
    // The same instant from another offset reads the same in Manila.
    expect(formatRunStart('2026-10-10T22:10:00Z')).toBe('Sun 06:10')
    expect(formatRunStart('2026-10-12T00:05:00+08:00')).toBe('Mon 00:05')
  })
})

describe('splitEmphasis', () => {
  it('sets *asterisked* words apart', () => {
    expect(splitEmphasis('Shipping is *a team sport*, always.')).toEqual([
      { text: 'Shipping is ', emphasis: false },
      { text: 'a team sport', emphasis: true },
      { text: ', always.', emphasis: false },
    ])
  })

  it('keeps plain text, several pairs and a stray asterisk', () => {
    expect(splitEmphasis('Plain')).toEqual([{ text: 'Plain', emphasis: false }])
    expect(splitEmphasis('*a* and *b*').map((part) => part.text)).toEqual(['a', ' and ', 'b'])
    expect(splitEmphasis('5 * 3')).toEqual([{ text: '5 * 3', emphasis: false }])
    expect(splitEmphasis('')).toEqual([])
  })
})

describe('getBlurDataURL', () => {
  it('makes a small webp data URL for an image in public/, once per image', async () => {
    const src = '/static/images/gallery/road.webp'
    const blur = await getBlurDataURL(src)
    expect(blur.startsWith('data:image/webp;base64,')).toBe(true)
    // Tiny: next/image inlines it in the HTML.
    expect(blur.length).toBeLessThan(2000)
    expect(getBlurDataURL(src)).toBe(getBlurDataURL(src))
  })

  it('rejects for a file that does not exist', async () => {
    await expect(getBlurDataURL('/static/images/gallery/nope.webp')).rejects.toThrow()
  })
})
