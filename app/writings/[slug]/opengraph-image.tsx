import { notFound } from 'next/navigation'
import { getPost, getPosts } from '@/lib/content'
import { renderOgImage } from '@/lib/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Like the page, one image per published post at build time and 404 for anything else.
export const dynamicParams = false

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return renderOgImage({ eyebrow: 'francisaguilar.co/writings', title: post.title })
}
