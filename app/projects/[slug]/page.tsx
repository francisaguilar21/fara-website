import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { MDXContent } from '@/components/mdx/MDXContent'
import { CaseStudyLayout } from '@/components/projects/CaseStudyLayout'
import { getAdjacentProjects, getProject, getProjects } from '@/lib/content'
import { getBlurDataURL } from '@/lib/images'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

// Every case study is known at build time; any other slug is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return getProjects().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}

  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
  })
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const { previous, next } = getAdjacentProjects(slug)
  const coverBlur = project.cover ? await getBlurDataURL(project.cover) : undefined

  return (
    <Container as="article" className="py-16 md:py-24">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Projects', path: '/projects' },
          { name: project.title, path: `/projects/${project.slug}` },
        ]}
      />
      <CaseStudyLayout project={project} coverBlur={coverBlur} previous={previous} next={next}>
        <MDXContent code={project.body} />
      </CaseStudyLayout>
    </Container>
  )
}
