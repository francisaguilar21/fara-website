import { Container } from '@/components/layout/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { BookingCard } from './BookingCard'
import { ContactForm } from './ContactForm'

type ContactSectionProps = {
  bookingUrl: string
  /** The booking link is still a placeholder. */
  draft?: boolean
}

/**
 * Section 10, `/contact`: the big question, a booking card and the form. The layout is the
 * mockup's own, not the editorial rail the other sections share, so it is not wrapped in
 * `<Section>`.
 */
export function ContactSection({ bookingUrl, draft }: ContactSectionProps) {
  return (
    <Container
      as="section"
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-line py-24 md:py-36"
    >
      <div className="grid gap-x-[clamp(32px,6vw,88px)] gap-y-10 min-[861px]:grid-cols-2">
        <div>
          <Eyebrow path="/contact" />
          <h2
            id="contact-heading"
            className="mt-[18px] font-display text-[clamp(2.5rem,6.6vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.045em]"
          >
            Got something
            <br />
            in <span className="text-accent">mind?</span>
          </h2>
          <p className="mt-6 max-w-[42ch] text-muted">
            Hiring, a project, a talk, or a long run. Send a note, or skip the back-and-forth and
            grab 30 minutes on my calendar.
          </p>
          <BookingCard bookingUrl={bookingUrl} draft={draft} />
        </div>
        <ContactForm />
      </div>
    </Container>
  )
}
