import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import { UnderlineLink } from '@/components/ui/UnderlineLink'
import type { Talk } from '@/lib/content'
import { formatDate } from '@/lib/content/format'
import { groupByYear } from '@/lib/life/group'

/** Talks and events grouped by year, newest first, each with its slides and video links (P6-R11). */
export function TalkList({ talks }: { talks: Talk[] }) {
  return (
    <div className="grid gap-12">
      {groupByYear(talks).map(({ year, items }) => (
        <section
          key={year}
          aria-labelledby={`talks-${year}`}
          className="grid gap-x-12 gap-y-4 min-[760px]:grid-cols-[120px_minmax(0,1fr)]"
        >
          <h2 id={`talks-${year}`} className="data text-[1.5rem] leading-none">
            {year}
          </h2>
          <ul className="border-t border-line">
            {items.map((talk) => (
              <li key={`${talk.date}-${talk.title}`} className="border-b border-line py-5">
                <Label>
                  <time dateTime={talk.date}>{formatDate(talk.date, 'short')}</time>
                  {talk.location ? ` · ${talk.location}` : ''}
                </Label>
                <h3 className="mt-2 h3">
                  {talk.title}
                  {talk.draft ? <DraftChip className="ml-2" /> : null}
                </h3>
                <p className="mt-1 text-muted">{talk.event}</p>
                {talk.slidesUrl || talk.videoUrl ? (
                  <p className="mt-3 flex gap-5">
                    {talk.slidesUrl ? (
                      <UnderlineLink href={talk.slidesUrl} external>
                        Slides ↗
                      </UnderlineLink>
                    ) : null}
                    {talk.videoUrl ? (
                      <UnderlineLink href={talk.videoUrl} external>
                        Video ↗
                      </UnderlineLink>
                    ) : null}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
