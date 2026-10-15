import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { TagList } from '@/components/blog/TagList'
import { Container } from '@/components/layout/Container'
import { MDXContent } from '@/components/mdx/MDXContent'
import { Figure } from '@/components/mdx/Figure'
import { DraftChip } from '@/components/ui/DraftChip'
import { getAdjacentPosts, getPost, getPosts } from '@/lib/content'
import { formatDate, formatReadingTime } from '@/lib/content/format'
import { pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

// Every post is known at build time; any other slug is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}

  return pageMetadata({
    title: post.title,
    description: post.summary,
    path: post.permalink,
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.lastmod ?? post.date,
      tags: post.tags,
      images: post.cover
        ? [{ url: post.cover.src, width: post.cover.width, height: post.cover.height }]
        : undefined,
    },
  })
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const { previous, next } = getAdjacentPosts(slug)
  // Same-day edits aren't worth a second date.
  const updated = post.lastmod && post.lastmod.slice(0, 10) > post.date.slice(0, 10)

  return (
    <Container as="article" className="py-16 md:py-24">
      <Link
        href="/writings"
        className="inline-flex items-center gap-2 label transition-colors hover:text-accent"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        All posts
      </Link>

      <header className="mt-10 max-w-[68ch]">
        <TagList tags={post.tags} />
        <h1 className="mt-5 h1">
          {post.title}
          {post.draft ? (
            <>
              {' '}
              <DraftChip />
            </>
          ) : null}
        </h1>
        <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 label">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {updated ? (
            <span>
              Updated <time dateTime={post.lastmod}>{formatDate(post.lastmod!)}</time>
            </span>
          ) : null}
          <span>{formatReadingTime(post.metadata.readingTime)}</span>
        </p>
      </header>

      {post.cover && !post.cover.inBody ? (
        <div className="mt-10 max-w-[68ch]">
          <Figure
            src={post.cover.src}
            alt=""
            width={post.cover.width}
            height={post.cover.height}
            priority
          />
        </div>
      ) : null}

      <div className="prose mt-10">
        <MDXContent code={post.body} />
      </div>

      <nav
        aria-label="More posts"
        className="mt-20 grid max-w-[68ch] gap-6 border-t border-line pt-8 sm:grid-cols-2"
      >
        {previous ? (
          <Link href={previous.permalink} rel="prev" className="group block">
            <span className="label">Previous</span>
            <span className="mt-2 block font-display text-lg leading-snug font-medium group-hover:text-accent">
              {previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={next.permalink} rel="next" className="group block sm:text-right">
            <span className="label">Next</span>
            <span className="mt-2 block font-display text-lg leading-snug font-medium group-hover:text-accent">
              {next.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </Container>
  )
}
