// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getCertifications,
  getExperience,
  getGallery,
  getPage,
  getPosts,
  getProject,
  getProjects,
  getRaces,
  getRecommendations,
  getSite,
  getTalks,
  getUses,
} from '@/lib/content'
import { shouldHideDrafts } from '@/lib/content/visibility'

/** The environment of a visitor to production, of a preview, and of `pnpm dev`. */
const env = (vercel: string, hide: string) => {
  vi.stubEnv('VERCEL_ENV', vercel)
  vi.stubEnv('HIDE_DRAFTS', hide)
}

afterEach(() => vi.unstubAllEnvs())

describe('shouldHideDrafts', () => {
  it('hides drafts in production', () => {
    env('production', '')
    expect(shouldHideDrafts()).toBe(true)
  })

  it('hides them on a preview or locally only when HIDE_DRAFTS=1', () => {
    env('preview', '1')
    expect(shouldHideDrafts()).toBe(true)
    env('', '1')
    expect(shouldHideDrafts()).toBe(true)
    for (const value of ['', '0', 'true']) {
      env('preview', value)
      expect(shouldHideDrafts()).toBe(false)
    }
  })

  it('shows them on a preview and in local development', () => {
    env('preview', '')
    expect(shouldHideDrafts()).toBe(false)
    env('development', '')
    expect(shouldHideDrafts()).toBe(false)
    env('', '')
    expect(shouldHideDrafts()).toBe(false)
  })

  it('ignores NODE_ENV: a production build on a laptop still shows drafts', () => {
    env('', '')
    vi.stubEnv('NODE_ENV', 'production')
    expect(shouldHideDrafts()).toBe(false)
  })
})

describe('getters while drafts are shown (a preview, or local)', () => {
  it('return the placeholders, so pages can chip them', () => {
    env('preview', '')
    expect(getProjects().length).toBeGreaterThan(0)
    expect(getProjects().every((project) => project.draft)).toBe(true)
    expect(getExperience().some((entry) => entry.draft)).toBe(true)
    expect(getCertifications().length).toBeGreaterThan(0)
    expect(getRecommendations().length).toBeGreaterThan(0)
    expect(getRaces().length).toBeGreaterThan(0)
    expect(getTalks().length).toBeGreaterThan(0)
    expect(getGallery().length).toBeGreaterThan(0)
    expect(getUses().length).toBeGreaterThan(0)
    expect(getPage('now')?.draft).toBe(true)
    expect(getProject('fitscovery')?.title).toBe('Fitscovery')
  })
})

describe.each([
  ['in production', () => env('production', '')],
  ['with HIDE_DRAFTS=1', () => env('preview', '1')],
])('getters %s', (_name, hide) => {
  it('return no draft entry from any of them', () => {
    hide()
    const lists = {
      posts: getPosts(),
      projects: getProjects(),
      'featured projects': getProjects({ featured: true }),
      experience: getExperience(),
      'featured experience': getExperience({ featured: true, limit: 6 }),
      certifications: getCertifications(),
      recommendations: getRecommendations(),
      races: getRaces(),
      talks: getTalks(),
      gallery: getGallery(),
      uses: getUses(),
    }
    for (const [name, entries] of Object.entries(lists)) {
      expect(
        entries.filter((entry) => (entry as { draft?: boolean }).draft),
        name
      ).toEqual([])
    }
  })

  it('leave out the draft pages and projects, by slug as well as in lists', () => {
    hide()
    expect(getPage('now')).toBeUndefined()
    expect(getPage('life/building')).toBeUndefined()
    expect(getProject('fitscovery')).toBeUndefined()
    expect(getProjects()).toEqual([])
  })

  it('keep what is not a draft', () => {
    hide()
    const experience = getExperience()
    expect(experience.length).toBeGreaterThan(0)
    expect(experience.length).toBeLessThan(6)
    expect(getPosts().length).toBeGreaterThan(0)
  })

  it('still return the site, even though it is marked as a draft', () => {
    hide()
    expect(getSite().draft).toBe(true)
    expect(getSite().name).toBe('Francis Aguilar')
  })
})
