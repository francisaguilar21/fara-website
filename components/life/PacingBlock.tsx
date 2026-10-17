import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import { Tag } from '@/components/ui/Tag'
import { UnderlineLink } from '@/components/ui/UnderlineLink'
import type { Pacing } from '@/lib/content'

/** The pacing section of `/life/running` (P6-R10): the club, since when, and the paces led. */
export function PacingBlock({ pacing }: { pacing: Pacing }) {
  return (
    <dl className="grid gap-x-12 gap-y-6 border-t border-line pt-6 sm:grid-cols-3">
      <div>
        <Label as="dt">Club</Label>
        <dd className="mt-2">
          {pacing.clubUrl ? (
            <UnderlineLink href={pacing.clubUrl} external>
              {pacing.club}
            </UnderlineLink>
          ) : (
            pacing.club
          )}
          {pacing.draft ? <DraftChip className="ml-1.5" /> : null}
        </dd>
      </div>
      <div>
        <Label as="dt">Pacing since</Label>
        <dd className="mt-2 data text-[1.125rem]">{pacing.since}</dd>
      </div>
      <div>
        <Label as="dt">Paces led</Label>
        <dd className="mt-2">
          <ul className="flex flex-wrap gap-1.5">
            {pacing.pacesLed.map((pace) => (
              <li key={pace}>
                <Tag>{pace}</Tag>
              </li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  )
}
