import Link from 'next/link'
import { DraftChip } from '@/components/ui/DraftChip'
import { formatDate, formatReadingTime } from '@/lib/content/format'
import type { Post } from '@/lib/content'
import { TagList } from './TagList'

/** One row of the blog index: date, title, summary, reading time and tags. */
export function PostListItem({ post }: { post: Post }) {
  return (
    <li className="border-t border-line py-10 first:border-t-0 first:pt-0">
      <article>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 label">
          <time dateTime={post.date}>{formatDate(post.date, 'short')}</time>
          <span>{formatReadingTime(post.metadata.readingTime)}</span>
          {post.draft ? <DraftChip /> : null}
        </p>
        <h2 className="mt-3 font-display text-2xl leading-tight font-medium tracking-tight text-balance md:text-3xl">
          <Link href={post.permalink} className="underline-grow">
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 max-w-[60ch] text-muted">{post.summary}</p>
        <TagList tags={post.tags} className="mt-5" />
      </article>
    </li>
  )
}
