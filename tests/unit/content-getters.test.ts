// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  getCertifications,
  getExperience,
  getGallery,
  getPage,
  getProject,
  getProjects,
  getRaces,
  getRecommendations,
  getSite,
  getTalks,
  getUses,
} from '@/lib/content'

describe('data getters', () => {
  it('returns experience newest first, with the current role ahead of one that started the same month', () => {
    const entries = getExperience()
    const starts = entries.map((entry) => entry.start)
    expect(starts).toEqual([...starts].sort().reverse())
    expect(entries[0]).toMatchObject({ start: '2024-01', end: '' })
  })

  it('filters experience by featured, kind and limit', () => {
    expect(getExperience({ kind: 'life' }).every((entry) => entry.kind === 'life')).toBe(true)
    expect(getExperience({ featured: true, limit: 2 })).toHaveLength(2)
    expect(getExperience({ featured: false })).toEqual([])
  })

  it('returns projects by order, and only the featured ones when asked', () => {
    const projects = getProjects()
    expect(projects.map((project) => project.order)).toEqual(
      [...projects.map((project) => project.order)].sort((a, b) => a - b)
    )
    expect(getProjects({ featured: true, limit: 3 }).length).toBeLessThanOrEqual(3)
    expect(getProject('fitscovery')?.title).toBe('Fitscovery')
    expect(getProject('missing')).toBeUndefined()
  })

  it('keeps draft placeholders in the results so pages can show a DraftChip', () => {
    expect(getProjects().every((project) => project.draft)).toBe(true)
    expect(getExperience().some((entry) => entry.draft)).toBe(true)
  })

  it('finds long-form pages by slug', () => {
    expect(getPage('now')?.title).toBe('Now')
    expect(getPage('life/building')?.title).toBe('Building')
    expect(getPage('missing')).toBeUndefined()
  })

  it('sorts races, talks and certifications newest first', () => {
    const races = getRaces().map((race) => race.date)
    expect(races).toEqual([...races].sort().reverse())
    const talks = getTalks().map((talk) => talk.date)
    expect(talks).toEqual([...talks].sort().reverse())
    const years = getCertifications().map((cert) => cert.year)
    expect(years).toEqual([...years].sort((a, b) => b - a))
  })

  it('filters and limits the rest', () => {
    expect(getRecommendations({ limit: 1 })).toHaveLength(1)
    expect(getGallery({ tag: 'life' }).every((image) => image.tag === 'life')).toBe(true)
    expect(getGallery({ tag: 'race' })).toEqual([])
    expect(getUses().length).toBeGreaterThan(0)
    expect(getSite().name).toBe('Francis Aguilar')
  })
})
