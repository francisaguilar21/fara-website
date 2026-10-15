import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/cn'
import { formatRange } from '@/lib/home/timeline'

export type TimelineEntry = {
  role: string
  org: string
  /** `YYYY-MM`. */
  start: string
  /** `YYYY-MM`. Empty while it is ongoing. */
  end?: string
  kind: 'work' | 'life'
  summary: string
  tags: string[]
  draft?: boolean
}

type TimelineItemProps = {
  entry: TimelineEntry
  /** The line has reached this entry: its dot is on and its card is in place. */
  lit: boolean
  ref?: React.Ref<HTMLLIElement>
}

/**
 * One milestone. Work dots fill with rose when they light up, life dots only gain a rose ring.
 * Unlit entries sit 10px to the left with a muted title, and slide into place when lit. They are
 * dimmed by color rather than with `opacity`: fading the muted summary and tags to 60% takes them
 * below the 4.5:1 contrast of WCAG AA (axe reports it), and unlit text is still text.
 */
export function TimelineItem({ entry, lit, ref }: TimelineItemProps) {
  return (
    <li ref={ref} data-kind={entry.kind} data-lit={lit} className="relative">
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-1.5 -left-9 size-4 rounded-full border-2 border-line bg-bg transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out-quint motion-reduce:transition-none',
          lit &&
            'scale-[1.15] border-accent shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent)_22%,transparent)]',
          lit && entry.kind === 'work' && 'bg-accent'
        )}
      />
      <div
        className={cn(
          'transition-transform duration-[600ms] ease-out-quint motion-reduce:transition-none',
          !lit && '-translate-x-2.5'
        )}
      >
        <div className="mb-2 flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
          <Label>{formatRange(entry)}</Label>
          {entry.draft ? <DraftChip /> : null}
        </div>
        <h3
          className={cn(
            'text-[clamp(1.25rem,2.2vw,1.625rem)] leading-tight font-medium transition-colors duration-[600ms] ease-out-quint motion-reduce:transition-none',
            !lit && 'text-muted'
          )}
        >
          {entry.role} <span className="font-normal text-muted">· {entry.org}</span>
        </h3>
        <p className="mt-2 max-w-[60ch] text-muted">{entry.summary}</p>
        {entry.tags.length ? (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
            {entry.tags.slice(0, 3).map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  )
}
