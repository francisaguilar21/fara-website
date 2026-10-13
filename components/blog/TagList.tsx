import Link from 'next/link'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/cn'
import { slugifyTag } from '@/lib/content/tags'

/** A post's tags, each linking to `/blog/tags/[tag]`. */
export function TagList({ tags, className }: { tags: string[]; className?: string }) {
  if (tags.length === 0) return null
  return (
    <ul className={cn('flex flex-wrap gap-2', className)} aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag}>
          <Link href={`/blog/tags/${slugifyTag(tag)}`} className="group inline-block rounded-full">
            <Tag className="transition-colors group-hover:border-accent group-hover:text-accent">
              {tag.toLowerCase()}
            </Tag>
          </Link>
        </li>
      ))}
    </ul>
  )
}
