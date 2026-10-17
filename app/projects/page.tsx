import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { ProjectsBrowser } from '@/components/projects/ProjectsBrowser'
import { getProjects, toProjectSummary } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

const DESCRIPTION =
  'Products and side projects I have designed, built and shipped, with case studies.'

export const metadata = pageMetadata({
  title: 'Projects',
  description: DESCRIPTION,
  path: '/projects',
})

export default function ProjectsPage() {
  // Drafts are left out in production by the getter; on previews they show with a chip.
  const projects = getProjects().map(toProjectSummary)

  return (
    <Container className="py-16 md:py-24">
      <PageHeader path="/projects" title="Things I've built." description={DESCRIPTION} />
      <div className="mt-[clamp(40px,6vw,72px)]">
        {projects.length > 0 ? (
          <ProjectsBrowser projects={projects} />
        ) : (
          <p className="text-muted">Case studies are on the way.</p>
        )}
      </div>
    </Container>
  )
}
