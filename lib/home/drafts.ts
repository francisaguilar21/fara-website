import { HERO_ROLES } from '@/components/home/hero-roles'
import {
  getCertifications,
  getExperience,
  getGallery,
  getPage,
  getProjects,
  getRaces,
  getRecommendations,
  getSite,
  getTalks,
  getUses,
} from '@/lib/content'
import { SAMPLES } from '@/lib/integrations/fallbacks'

export type DraftItem = {
  /** Where it lives: `experience`, `projects`, `sample`, … */
  source: string
  /** How to find it: a title, a name or a position. */
  label: string
}

const SAMPLE_LABELS: Record<keyof typeof SAMPLES, string> = {
  strava: 'Strava week (STRAVA_SAMPLE)',
  nowPlaying: 'Now playing (NOW_PLAYING_SAMPLE)',
  contributions: 'GitHub contributions (CONTRIBUTIONS_SAMPLE)',
}

/**
 * Everything on the site that is still a placeholder (P5-R2): content entries with
 * `draft: true`, hero roles with a `draft` note, and live-data fallbacks flagged `isSample`.
 *
 * Draft blog posts are not listed. They are hidden in production by design, so they never
 * reach a visitor.
 */
export function findDrafts(): DraftItem[] {
  const drafts: DraftItem[] = []
  const add = (source: string, label: string, draft?: boolean) => {
    if (draft) drafts.push({ source, label })
  }

  const site = getSite()
  add('site', site.name, site.draft)
  HERO_ROLES.forEach((role) => add('hero roles', `${role.path} ${role.text.trim()}`, !!role.draft))
  getExperience().forEach((entry) => add('experience', `${entry.role} · ${entry.org}`, entry.draft))
  getProjects().forEach((project) => add('projects', project.title, project.draft))
  getCertifications().forEach((cert) =>
    add('certifications', `${cert.name} · ${cert.issuer} ${cert.year}`, cert.draft)
  )
  getRecommendations().forEach((rec) =>
    add('recommendations', `${rec.name} · ${rec.role}, ${rec.company}`, rec.draft)
  )
  getRaces().forEach((race) => add('races', `${race.name} (${race.date})`, race.draft))
  getTalks().forEach((talk) => add('talks', `${talk.title} · ${talk.event}`, talk.draft))
  getGallery().forEach((image) => add('gallery', image.src, image.draft))
  getUses().forEach((group) => add('uses', group.category, group.draft))
  for (const slug of ['now', 'life/building']) {
    const page = getPage(slug)
    add('pages', slug, page?.draft)
  }

  for (const [name, sample] of Object.entries(SAMPLES) as [
    keyof typeof SAMPLES,
    { isSample: boolean },
  ][]) {
    add('sample', SAMPLE_LABELS[name], sample.isSample)
  }

  return drafts
}
