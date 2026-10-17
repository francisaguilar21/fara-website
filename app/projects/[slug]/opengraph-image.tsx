import { notFound } from 'next/navigation'
import { getProject, getProjects } from '@/lib/content'
import { renderPageOg } from '@/lib/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Like the page: one image per case study at build time, and 404 for anything else.
export const dynamicParams = false

export function generateStaticParams() {
  return getProjects().map(({ slug }) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return renderPageOg({
    path: `/projects/${project.slug}`,
    title: project.title,
    subtitle: project.summary,
  })
}
