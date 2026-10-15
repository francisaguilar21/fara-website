import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Label } from '@/components/ui/Label'
import type { Post } from '@/lib/content'
import { formatPostDate, formatReadMinutes } from '@/lib/home/format'
import { SectionTitle } from './SectionTitle'

/**
 * Section 8, `/writing`: the latest posts as rows (date, title, summary, reading time). The title
 * slides right on hover and focus. Nothing renders while there are no published posts.
 */
export function LatestPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null

  // The index is the parent of the posts' permalinks, so the route's name (`/blog`, `/writings`)
  // lives in one place, the content config, and not here.
  const first = posts[0]!.permalink
  const indexPath = first.slice(0, first.lastIndexOf('/')) || '/'

  return (
    <Section id="writing" eyebrow="/writing" label="Latest posts" aria-labelledby="writing-heading">
      <SectionTitle
        id="writing-heading"
        title="Notes from the work & the road."
        more={{ href: indexPath, label: 'All posts' }}
      />
      <ul className="border-t border-line">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={post.permalink}
              data-cursor="Read"
              className="group grid grid-cols-[120px_minmax(0,1fr)_90px] items-baseline gap-5 border-b border-line py-[22px] max-[640px]:grid-cols-1 max-[640px]:gap-1.5"
            >
              <Label>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              </Label>
              <div>
                <h3 className="h3 transition-[translate,color] duration-[350ms] ease-out-quint group-hover:text-accent group-focus-visible:text-accent motion-safe:group-hover:translate-x-2 motion-safe:group-focus-visible:translate-x-2 motion-reduce:transition-none">
                  {post.title}
                </h3>
                <p className="mt-1 text-[0.9375rem] text-muted">{post.summary}</p>
              </div>
              <Label className="justify-self-end max-[640px]:justify-self-start">
                {formatReadMinutes(post.metadata.readingTime)}
              </Label>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
