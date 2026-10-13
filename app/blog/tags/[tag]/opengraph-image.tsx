import { notFound } from 'next/navigation'
import { getTags } from '@/lib/content'
import { renderOgImage } from '@/lib/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Like the page: one image per tag that a published post uses.
export const dynamicParams = false

export function generateStaticParams() {
  return getTags().map(({ slug }) => ({ tag: slug }))
}

export default async function Image({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const label = getTags().find((t) => t.slug === tag)?.label
  if (!label) notFound()

  return renderOgImage({
    eyebrow: 'francisaguilar.co/blog',
    title: `Tagged ${label}`,
  })
}
