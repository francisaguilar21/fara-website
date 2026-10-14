import { pages, posts, projects, type Page, type Post, type Project } from '#site/content'
import { certifications } from '@/content/certifications'
import { experience } from '@/content/experience'
import { gallery } from '@/content/gallery'
import { races } from '@/content/races'
import { recommendations } from '@/content/recommendations'
import { site } from '@/content/site'
import { talks } from '@/content/talks'
import { uses } from '@/content/uses'
import { slugifyTag } from './tags'
import { shouldHideDrafts } from './visibility'
import type {
  Certification,
  Experience,
  GalleryImage,
  Race,
  Recommendation,
  Site,
  Talk,
  UsesGroup,
} from './schemas'

export type { Page, Post, Project }
export type {
  Certification,
  Experience,
  GalleryImage,
  Race,
  Recommendation,
  Site,
  Talk,
  UsesGroup,
} from './schemas'

// Typed getters over the content. Pages import from here, never from `.velite` or `content/`.
//
// Drafts are placeholders (or posts not ready to publish). Every getter below leaves them out when
// `shouldHideDrafts()` is true (production, or `HIDE_DRAFTS=1`), and keeps them otherwise so the
// page can render them with a `<DraftChip />`. The one exception is `getSite()`: a draft `site` is
// still returned, because the site itself is not optional.

type ListOptions = { limit?: number }

/** The entries that should be on the page: all of them, minus the drafts when those are hidden. */
function shown<T extends { draft?: boolean }>(items: T[]): T[] {
  return shouldHideDrafts() ? items.filter((item) => !item.draft) : items
}

const take = <T>(items: T[], limit?: number) =>
  limit === undefined ? items : items.slice(0, limit)

/** Newest first. Ties (same day) fall back to the slug, which is date-prefixed for older posts. */
const byNewest = (a: Post, b: Post) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug)

function publishedPosts(): Post[] {
  return [...shown(posts)].sort(byNewest)
}

/** Published posts, newest first. `tag` is a tag slug (see {@link slugifyTag}). */
export function getPosts({ limit, tag }: ListOptions & { tag?: string } = {}): Post[] {
  const all = publishedPosts()
  const matching = tag ? all.filter((post) => post.tags.some((t) => slugifyTag(t) === tag)) : all
  return take(matching, limit)
}

export function getPost(slug: string): Post | undefined {
  return publishedPosts().find((post) => post.slug === slug)
}

/** The posts around `slug`: `previous` is the next older one, `next` the next newer one. */
export function getAdjacentPosts(slug: string): { previous?: Post; next?: Post } {
  const all = publishedPosts()
  const index = all.findIndex((post) => post.slug === slug)
  if (index === -1) return {}
  return { previous: all[index + 1], next: all[index - 1] }
}

/** Tags of the published posts: `slug` for URLs, `label` for display. Most used first. */
export function getTags(): { slug: string; label: string; count: number }[] {
  const tags = new Map<string, { slug: string; label: string; count: number }>()
  for (const post of publishedPosts()) {
    for (const label of post.tags) {
      const slug = slugifyTag(label)
      if (!slug) continue
      const entry = tags.get(slug)
      if (entry) entry.count += 1
      else tags.set(slug, { slug, label: label.toLowerCase(), count: 1 })
    }
  }
  return [...tags.values()].sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug))
}

/** Case studies: by `order`, then newest year first. */
export function getProjects({
  featured,
  limit,
}: ListOptions & { featured?: boolean } = {}): Project[] {
  const all = shown(projects)
  const matching = featured === undefined ? all : all.filter((p) => p.featured === featured)
  return take(
    [...matching].sort((a, b) => a.order - b.order || b.year - a.year),
    limit
  )
}

export function getProject(slug: string): Project | undefined {
  return shown(projects).find((project) => project.slug === slug)
}

/** A long-form page: `now` or `life/building`. */
export function getPage(slug: string): Page | undefined {
  return shown(pages).find((page) => page.slug === slug)
}

/** Newest first. A role with no `end` is current, so it leads the roles that started the same month. */
export function getExperience({
  featured,
  kind,
  limit,
}: ListOptions & { featured?: boolean; kind?: Experience['kind'] } = {}): Experience[] {
  const matching = shown(experience).filter(
    (entry) =>
      (featured === undefined || entry.featured === featured) &&
      (kind === undefined || entry.kind === kind)
  )
  const endKey = (entry: Experience) => entry.end || '9999-12'
  return take(
    [...matching].sort(
      (a, b) => b.start.localeCompare(a.start) || endKey(b).localeCompare(endKey(a))
    ),
    limit
  )
}

/** Newest year first. */
export function getCertifications({ limit }: ListOptions = {}): Certification[] {
  return take(
    [...shown(certifications)].sort((a, b) => b.year - a.year),
    limit
  )
}

/** In the order they are written in `content/recommendations.ts`. */
export function getRecommendations({ limit }: ListOptions = {}): Recommendation[] {
  return take(shown(recommendations), limit)
}

/** Newest first. */
export function getRaces({ limit }: ListOptions = {}): Race[] {
  return take(
    [...shown(races)].sort((a, b) => b.date.localeCompare(a.date)),
    limit
  )
}

/** Newest first. */
export function getTalks({ limit }: ListOptions = {}): Talk[] {
  return take(
    [...shown(talks)].sort((a, b) => b.date.localeCompare(a.date)),
    limit
  )
}

/** In the order they are written in `content/gallery.ts`, optionally for one `tag`. */
export function getGallery({
  tag,
  limit,
}: ListOptions & { tag?: GalleryImage['tag'] } = {}): GalleryImage[] {
  const all = shown(gallery)
  return take(tag ? all.filter((image) => image.tag === tag) : all, limit)
}

export function getUses(): UsesGroup[] {
  return shown(uses)
}

/** Always returned, even while `site.draft` is set: that flag only means the copy isn't final. */
export function getSite(): Site {
  return site
}
