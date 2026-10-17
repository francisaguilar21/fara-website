'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { ProjectRow } from '@/components/home/ProjectRow'
import type { ProjectSummary } from '@/lib/content'
import { filterByStack, stackOptions } from '@/lib/projects/stack'
import { StackFilter } from './StackFilter'

function Rows({ projects }: { projects: ProjectSummary[] }) {
  return (
    <ul className="border-t border-line">
      {projects.map((project) => (
        <ProjectRow key={project.slug} project={project} />
      ))}
    </ul>
  )
}

function Filtered({ projects }: { projects: ProjectSummary[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const options = stackOptions(projects)

  // A `?stack=` that matches no project is ignored, so a stale link still shows everything.
  const requested = searchParams.get('stack') ?? ''
  const selected = options.find((option) => option.slug === requested)?.slug ?? ''
  const shown = filterByStack(projects, selected)

  const select = (slug: string) => {
    const next = new URLSearchParams(searchParams)
    if (slug) next.set('stack', slug)
    else next.delete('stack')
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <div>
      <StackFilter options={options} selected={selected} onSelect={select} />
      <p className="mt-6 mb-4 label" role="status">
        {shown.length === projects.length
          ? `${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`
          : `${shown.length} of ${projects.length} projects`}
      </p>
      <Rows projects={shown} />
    </div>
  )
}

/**
 * Every project as rows, with the stack filter (P6-R7). The filter reads `?stack=` in the browser,
 * so the page itself stays static: the server HTML (and the page without JavaScript) lists all
 * projects, and the filter takes over once it has hydrated.
 */
export function ProjectsBrowser({ projects }: { projects: ProjectSummary[] }) {
  return (
    <Suspense fallback={<Rows projects={projects} />}>
      <Filtered projects={projects} />
    </Suspense>
  )
}
