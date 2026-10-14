import type { Project } from '@/lib/content'
import { getBlurDataURL } from '@/lib/images'
import { CursorPeek } from './CursorPeek'
import { ProjectRow } from './ProjectRow'

/** The rows, plus the cover preview that follows the cursor over them (desktop mouse only). */
export async function ProjectList({ projects }: { projects: Project[] }) {
  const covers = await Promise.all(
    projects.flatMap((project) =>
      project.cover
        ? [
            getBlurDataURL(project.cover).then((blurDataURL) => ({
              slug: project.slug,
              src: project.cover!,
              blurDataURL,
            })),
          ]
        : []
    )
  )

  return (
    <>
      <ul className="border-t border-line">
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </ul>
      <CursorPeek covers={covers} />
    </>
  )
}
