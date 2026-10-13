import { describe, expect, it } from 'vitest'
import { findDrafts } from '@/lib/home/drafts'
import { buildNowItems } from '@/lib/home/now-items'
import { NOW_PLAYING_SAMPLE, STRAVA_SAMPLE } from '@/lib/integrations/fallbacks'

const now = { focus: 'Base miles', reading: 'A book', building: 'This site', draft: true }

describe('buildNowItems', () => {
  it('lists NOW, READING, LISTENING, THIS WEEK and BUILDING in that order', () => {
    const items = buildNowItems({ now, nowPlaying: NOW_PLAYING_SAMPLE, strava: STRAVA_SAMPLE })
    expect(items.map((item) => item.label)).toEqual([
      'NOW',
      'READING',
      'LISTENING',
      'THIS WEEK',
      'BUILDING',
    ])
    expect(items.find((item) => item.label === 'THIS WEEK')?.text).toBe('41.2 km run')
    expect(items.find((item) => item.label === 'LISTENING')?.text).toBe(
      'Running Up That Hill · Kate Bush'
    )
  })

  it('marks written items with the page draft flag, and widgets with sample', () => {
    const items = buildNowItems({ now, nowPlaying: NOW_PLAYING_SAMPLE, strava: STRAVA_SAMPLE })
    const badges = Object.fromEntries(items.map((item) => [item.label, item.badge]))
    expect(badges).toEqual({
      NOW: 'draft',
      READING: 'draft',
      LISTENING: 'sample',
      'THIS WEEK': 'sample',
      BUILDING: 'draft',
    })
  })

  it('drops the chips once the content is real and the data is live', () => {
    const items = buildNowItems({
      now: { ...now, draft: false },
      nowPlaying: { ...NOW_PLAYING_SAMPLE, isSample: false },
      strava: { ...STRAVA_SAMPLE, isSample: false },
    })
    expect(items.every((item) => item.badge === undefined)).toBe(true)
  })

  it('shows "last played" when nothing is playing, and skips fields that are empty', () => {
    const items = buildNowItems({
      now: { focus: 'Base miles' },
      nowPlaying: { ...NOW_PLAYING_SAMPLE, isPlaying: false },
      strava: { ...STRAVA_SAMPLE, weekKm: 40 },
    })
    expect(items.map((item) => item.label)).toEqual(['NOW', 'LAST PLAYED', 'THIS WEEK'])
    expect(items[1]?.playing).toBe(false)
    expect(items[2]?.text).toBe('40 km run')
  })
})

describe('findDrafts', () => {
  const drafts = findDrafts()
  const sources = new Set(drafts.map((draft) => draft.source))

  it('lists the placeholder content entries', () => {
    for (const source of ['experience', 'projects', 'certifications', 'recommendations', 'uses']) {
      expect(sources).toContain(source)
    }
  })

  it('lists every sample fallback that is in use', () => {
    expect(drafts.filter((draft) => draft.source === 'sample')).toHaveLength(3)
  })

  it('lists the hero role that is waiting for the employer', () => {
    expect(drafts).toContainEqual({ source: 'hero roles', label: '/work Senior Software Engineer' })
  })

  it('does not list blog posts, which are hidden in production by design', () => {
    expect(sources).not.toContain('posts')
  })
})
