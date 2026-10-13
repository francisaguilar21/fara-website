import Link from 'next/link'
import { Section } from '@/components/layout/Section'
import { Magnetic } from '@/components/motion/Magnetic'
import { Button } from '@/components/ui/Button'
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

  return (
    <Section id="writing" eyebrow="/writing" label="Latest posts" aria-labelledby="writing-heading">
      <SectionTitle
        id="writing-heading"
        title="Notes from the work & the road."
        action={
          <Magnetic>
            <Button href="/blog" variant="ghost" size="sm">
              All posts <span aria-hidden="true">→</span>
            </Button>
          </Magnetic>
        }
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
                <h3 className="h3 transition-[translate,color] duration-[350ms] ease-out-quint group-hover:translate-x-2 group-hover:text-accent group-focus-visible:translate-x-2 group-focus-visible:text-accent motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0">
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
