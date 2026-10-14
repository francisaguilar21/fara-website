import { Magnetic } from '@/components/motion/Magnetic'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Tag } from '@/components/ui/Tag'

/**
 * The "skip the back-and-forth" card: a 30-minute call on Francis's Google Calendar. It takes the
 * URL from `getBookingUrl()` and is not rendered at all without one.
 */
export function BookingCard({ bookingUrl }: { bookingUrl: string }) {
  return (
    <div className="mt-7 grid gap-3.5 border border-line p-[22px]">
      <Label>Google Calendar · appointment schedule</Label>
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
