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
// Draft **posts** are hidden in production (pages, feeds, sitemap). Every other draft is a
// placeholder that stays in the results, so the page can render it with a `<DraftChip />`.

type ListOptions = { limit?: number }

const isProduction = () => process.env.NODE_ENV === 'production'

const take = <T>(items: T[], limit?: number) =>
  limit === undefined ? items : items.slice(0, limit)

/** Newest first. Ties (same day) fall back to the slug, which is date-prefixed for older posts. */
const byNewest = (a: Post, b: Post) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug)

function publishedPosts(): Post[] {
  const visible = isProduction() ? posts.filter((post) => !post.draft) : posts
  return [...visible].sort(byNewest)
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
  const matching =
    featured === undefined ? projects : projects.filter((p) => p.featured === featured)
  return take(
    [...matching].sort((a, b) => a.order - b.order || b.year - a.year),
    limit
  )
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

/** A long-form page: `now` or `life/building`. */
export function getPage(slug: string): Page | undefined {
  return pages.find((page) => page.slug === slug)
}

/** Newest first. A role with no `end` is current, so it leads the roles that started the same month. */
export function getExperience({
  featured,
  kind,
  limit,
}: ListOptions & { featured?: boolean; kind?: Experience['kind'] } = {}): Experience[] {
  const matching = experience.filter(
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
    [...certifications].sort((a, b) => b.year - a.year),
    limit
  )
}

/** In the order they are written in `content/recommendations.ts`. */
export function getRecommendations({ limit }: ListOptions = {}): Recommendation[] {
  return take(recommendations, limit)
}

/** Newest first. */
export function getRaces({ limit }: ListOptions = {}): Race[] {
  return take(
    [...races].sort((a, b) => b.date.localeCompare(a.date)),
    limit
  )
}

/** Newest first. */
export function getTalks({ limit }: ListOptions = {}): Talk[] {
  return take(
    [...talks].sort((a, b) => b.date.localeCompare(a.date)),
    limit
  )
}

/** In the order they are written in `content/gallery.ts`, optionally for one `tag`. */
export function getGallery({
  tag,
  limit,
}: ListOptions & { tag?: GalleryImage['tag'] } = {}): GalleryImage[] {
  return take(tag ? gallery.filter((image) => image.tag === tag) : gallery, limit)
}

export function getUses(): UsesGroup[] {
  return uses
}

export function getSite(): Site {
  return site
}
