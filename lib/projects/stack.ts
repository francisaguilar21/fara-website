import { slugifyTag } from '@/lib/content/tags'

export type StackOption = { slug: string; label: string; count: number }

/**
 * The stack tags of the projects, for the filter chips: one per tag (`Next.js` and `next.js` are
 * the same), most used first, then by name. `slug` is what goes in `?stack=`.
 */
export function stackOptions(projects: { stack: string[] }[]): StackOption[] {
  const options = new Map<string, StackOption>()
  for (const project of projects) {
    // A project that lists a tag twice still counts once.
    for (const slug of new Set(project.stack.map(slugifyTag))) {
      if (!slug) continue
      const label = project.stack.find((tag) => slugifyTag(tag) === slug)!
      const option = options.get(slug)
      if (option) option.count += 1
      else options.set(slug, { slug, label, count: 1 })
    }
  }
  return [...options.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

/** The projects that use the tag with this slug. An unknown or empty slug keeps them all. */
export function filterByStack<T extends { stack: string[] }>(
  projects: T[],
  slug: string | null | undefined
): T[] {
  const wanted = slug ? slugifyTag(slug) : ''
  if (!wanted) return projects
  return projects.filter((project) => project.stack.some((tag) => slugifyTag(tag) === wanted))
}
