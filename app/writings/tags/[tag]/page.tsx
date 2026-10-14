import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostListItem } from '@/components/blog/PostListItem'
import { Container } from '@/components/layout/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { getPosts, getTags } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ tag: string }> }

// Only tags that a published post uses exist. Anything else is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return getTags().map(({ slug }) => ({ tag: slug }))
}

export async function generateMetadata({ params }: Props) {
  const { tag } = await params
  const label = getTags().find((t) => t.slug === tag)?.label ?? tag
  return pageMetadata({
    title: `Posts tagged ${label}`,
    description: `Posts about ${label}.`,
    path: `/writings/tags/${tag}`,
  })
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const label = getTags().find((t) => t.slug === tag)?.label
  const posts = getPosts({ tag })
  if (!label || posts.length === 0) notFound()

  return (
    <Container className="py-16 md:py-24">
      <Eyebrow path="/writings" />
      <h1 className="mt-4 h1">
        <span className="text-muted">Tagged </span>
        {label}
      </h1>
      <p className="mt-6 text-muted">
        {posts.length} {posts.length === 1 ? 'post' : 'posts'}.{' '}
        <Link href="/writings" className="underline-grow text-fg">
          All posts
        </Link>
      </p>

      <ul className="mt-16 max-w-[68ch]">
        {posts.map((post) => (
          <PostListItem key={post.slug} post={post} />
        ))}
      </ul>
    </Container>
  )
}
