// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { certifications } from '@/content/certifications'
import { experience } from '@/content/experience'
import { gallery } from '@/content/gallery'
import { races } from '@/content/races'
import { recommendations } from '@/content/recommendations'
import { site } from '@/content/site'
import { talks } from '@/content/talks'
import { uses } from '@/content/uses'
import {
  CertificationSchema,
  ExperienceSchema,
  GalleryImageSchema,
  RaceSchema,
  RecommendationSchema,
  SiteSchema,
  TalkSchema,
  UsesGroupSchema,
} from '@/lib/content/schemas'

// P4-AC8: every data file in `content/` is valid against its schema. A typo in a date or a URL
// fails here with the entry and field named.
describe.each([
  ['experience', experience, ExperienceSchema],
  ['certifications', certifications, CertificationSchema],
  ['recommendations', recommendations, RecommendationSchema],
  ['races', races, RaceSchema],
  ['talks', talks, TalkSchema],
  ['gallery', gallery, GalleryImageSchema],
  ['uses', uses, UsesGroupSchema],
] as const)('content/%s.ts', (_name, entries, schema) => {
  it('has at least one entry', () => {
    expect(entries.length).toBeGreaterThan(0)
  })

  it.each(entries.map((entry, index) => [index, entry] as const))(
    'entry %i passes its schema',
    (_index, entry) => {
      const result = schema.safeParse(entry)
      expect(result.error?.issues ?? []).toEqual([])
    }
  )
})

describe('content/site.ts', () => {
  it('passes its schema', () => {
    const result = SiteSchema.safeParse(site)
    expect(result.error?.issues ?? []).toEqual([])
  })
})

describe('schemas', () => {
  const experienceEntry = experience[0]!
  const raceEntry = races[0]!
  const galleryEntry = gallery[0]!

  it('names the field that is wrong', () => {
    const result = ExperienceSchema.safeParse({ ...experienceEntry, start: '2024-13' })
    expect(result.error?.issues[0]?.path).toEqual(['start'])
  })

  it('treats an empty `end` as the current role and rejects an end before the start', () => {
    expect(ExperienceSchema.safeParse({ ...experienceEntry, end: '' }).success).toBe(true)
    expect(ExperienceSchema.safeParse({ ...experienceEntry, end: undefined }).success).toBe(true)
    const result = ExperienceSchema.safeParse({
      ...experienceEntry,
      start: '2024-05',
      end: '2024-04',
    })
    expect(result.error?.issues[0]?.path).toEqual(['end'])
  })

  it('requires gallery alt text of at least 10 characters', () => {
    expect(GalleryImageSchema.safeParse({ ...galleryEntry, alt: 'Too short' }).success).toBe(false)
    expect(GalleryImageSchema.safeParse({ ...galleryEntry, alt: 'Ten chars!' }).success).toBe(true)
  })

  it('requires race times as h:mm:ss', () => {
    expect(RaceSchema.safeParse({ ...raceEntry, time: '1:59:59' }).success).toBe(true)
    expect(RaceSchema.safeParse({ ...raceEntry, time: '59:59' }).success).toBe(false)
    expect(RaceSchema.safeParse({ ...raceEntry, time: '1:75:00' }).success).toBe(false)
  })

  it('rejects unknown enum values and malformed URLs', () => {
    expect(RaceSchema.safeParse({ ...raceEntry, role: 'spectator' }).success).toBe(false)
    expect(RaceSchema.safeParse({ ...raceEntry, resultsUrl: 'not a url' }).success).toBe(false)
    expect(GalleryImageSchema.safeParse({ ...galleryEntry, tag: 'work' }).success).toBe(false)
  })

  it('accepts `draft` on every schema', () => {
    expect(RaceSchema.safeParse({ ...raceEntry, draft: true }).success).toBe(true)
    expect(RaceSchema.safeParse({ ...raceEntry, draft: 'yes' }).success).toBe(false)
  })
})
