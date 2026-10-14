import { pages, projects } from '#site/content'
import { HERO_ROLES } from '@/components/home/hero-roles'
import { certifications } from '@/content/certifications'
import { experience } from '@/content/experience'
import { gallery } from '@/content/gallery'
import { races } from '@/content/races'
import { recommendations } from '@/content/recommendations'
import { site } from '@/content/site'
import { talks } from '@/content/talks'
import { uses } from '@/content/uses'
import { getBookingUrl } from '@/lib/booking'
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
 * It reads the raw content, not the getters in `lib/content`, because those leave drafts out where
 * drafts are hidden (production, `HIDE_DRAFTS=1`) and this has to list them everywhere. Draft blog
 * posts are not listed: they are never shown in production, so they never reach a visitor. It also
 * reports a missing `NEXT_PUBLIC_BOOKING_URL`, since the booking button needs it.
 */
export function findDrafts(): DraftItem[] {
  const drafts: DraftItem[] = []
  const add = (source: string, label: string, draft?: boolean) => {
    if (draft) drafts.push({ source, label })
  }

  add('site', site.name, site.draft)
  HERO_ROLES.forEach((role) => add('hero roles', `${role.path} ${role.text.trim()}`, !!role.draft))
  experience.forEach((entry) => add('experience', `${entry.role} · ${entry.org}`, entry.draft))
  projects.forEach((project) => add('projects', project.title, project.draft))
  certifications.forEach((cert) =>
    add('certifications', `${cert.name} · ${cert.issuer} ${cert.year}`, cert.draft)
  )
  recommendations.forEach((rec) =>
    add('recommendations', `${rec.name} · ${rec.role}, ${rec.company}`, rec.draft)
  )
  races.forEach((race) => add('races', `${race.name} (${race.date})`, race.draft))
  talks.forEach((talk) => add('talks', `${talk.title} · ${talk.event}`, talk.draft))
  gallery.forEach((image) => add('gallery', image.src, image.draft))
  uses.forEach((group) => add('uses', group.category, group.draft))
  pages.forEach((page) => add('pages', page.slug, page.draft))
  add('env', 'NEXT_PUBLIC_BOOKING_URL is not set', getBookingUrl() === undefined)

  for (const [name, sample] of Object.entries(SAMPLES) as [
    keyof typeof SAMPLES,
    { isSample: boolean },
  ][]) {
    add('sample', SAMPLE_LABELS[name], sample.isSample)
  }

  return drafts
}
