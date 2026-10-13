import { Magnetic } from '@/components/motion/Magnetic'
import { Button } from '@/components/ui/Button'
import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import { Tag } from '@/components/ui/Tag'

/** The "skip the back-and-forth" card: a 30-minute call on Francis's Google Calendar. */
export function BookingCard({ bookingUrl, draft }: { bookingUrl: string; draft?: boolean }) {
  return (
    <div className="mt-7 grid gap-3.5 border border-line p-[22px]">
      <div className="flex items-center justify-between gap-3">
        <Label>Google Calendar · appointment schedule</Label>
        {draft ? <DraftChip>link</DraftChip> : null}
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Call details">
        <li>
          <Tag>30 min</Tag>
        </li>
        <li>
          <Tag>Video call</Tag>
        </li>
        <li>
          <Tag>Asia/Manila (GMT+8)</Tag>
        </li>
      </ul>
      <div>
        <Magnetic>
          <Button href={bookingUrl}>
            Book a 30-min call <span aria-hidden="true">↗</span>
          </Button>
        </Magnetic>
      </div>
    </div>
  )
}
