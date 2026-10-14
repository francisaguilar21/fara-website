import { describe, expect, it } from 'vitest'
import {
  CONTRIBUTIONS_SAMPLE,
  contributionLevel,
  NOW_PLAYING_SAMPLE,
  SAMPLES,
  STRAVA_SAMPLE,
} from '@/lib/integrations/fallbacks'

describe('widget fallbacks', () => {
  it('flags every sample so the UI shows a chip', () => {
    for (const sample of Object.values(SAMPLES)) expect(sample.isSample).toBe(true)
  })

  it('has 12 weeks of Strava distance, oldest first, ending on the current week', () => {
    expect(STRAVA_SAMPLE.weeks).toHaveLength(12)
    expect(STRAVA_SAMPLE.weeks.at(-1)?.km).toBe(STRAVA_SAMPLE.weekKm)
    const starts = STRAVA_SAMPLE.weeks.map((week) => Date.parse(week.weekStart))
    starts.forEach((start, index) => {
      if (index > 0) expect(start - starts[index - 1]!).toBe(7 * 24 * 60 * 60 * 1000)
      expect(new Date(start).getUTCDay()).toBe(1) // weeks start on Monday
    })
  })

  it('has a track that is playing', () => {
    expect(NOW_PLAYING_SAMPLE.isPlaying).toBe(true)
    expect(NOW_PLAYING_SAMPLE.title).not.toBe('')
  })

  it('has a 53-week contribution calendar whose total adds up', () => {
    const { weeks, total } = CONTRIBUTIONS_SAMPLE
    expect(weeks).toHaveLength(53)
    const days = weeks.flat()
    expect(days.reduce((sum, day) => sum + day.count, 0)).toBe(total)
    expect(days.every((day) => day.level === contributionLevel(day.count))).toBe(true)
    // Every full week has 7 days; only the current week can be short.
    expect(weeks.slice(0, -1).every((week) => week.length === 7)).toBe(true)
    expect(weeks.at(-1)!.length).toBeLessThanOrEqual(7)
  })

  it('is the same on every call (no randomness at import time)', () => {
    expect(CONTRIBUTIONS_SAMPLE.total).toBe(
      CONTRIBUTIONS_SAMPLE.weeks.flat().reduce((sum, day) => sum + day.count, 0)
    )
    expect(CONTRIBUTIONS_SAMPLE.weeks[0]?.[0]?.date).toBe('2025-10-12')
  })

  it('maps counts to the five heatmap steps', () => {
    expect([0, 1, 2, 3, 5, 6, 8, 9, 20].map(contributionLevel)).toEqual([0, 1, 1, 2, 2, 3, 3, 4, 4])
  })
})
