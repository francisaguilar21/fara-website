import { Section } from '@/components/layout/Section'
import type { Project } from '@/lib/content'
import { ProjectList } from './ProjectList'
import { SectionTitle } from './SectionTitle'

/** Section 4, `/projects`: the featured projects as full-width rows. */
export function ProjectsSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  return (
    <Section
      id="projects"
      eyebrow="/projects"
      label="Selected work"
      aria-labelledby="projects-heading"
    >
      <SectionTitle id="projects-heading" title="Things I've built." />
      <ProjectList projects={projects} />
    </Section>
  )
}
