import { BookingCard } from '@/components/home/BookingCard'
import { ContactForm } from '@/components/home/ContactForm'
import { Socials } from '@/components/contact/Socials'
import { Container } from '@/components/layout/Container'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { getBookingUrl } from '@/lib/booking'
import { getSite } from '@/lib/content'
import { contactBlurb } from '@/lib/home/contact'
import { pageMetadata } from '@/lib/seo'

const DESCRIPTION =
  'Get in touch about hiring, a project, a talk or a long run: send a note or book a 30-minute call.'

export const metadata = pageMetadata({
  title: 'Contact',
  description: DESCRIPTION,
  path: '/contact',
})

/**
 * The full-page version of the homepage contact section (P6-R16). The booking card sits before the
 * form in the markup, so on a phone it comes first; on a wide screen the form moves beside it.
 */
export default function ContactPage() {
  const site = getSite()
  const bookingUrl = getBookingUrl()

  return (
    <Container className="py-16 md:py-24">
      <div className="grid gap-x-[clamp(32px,6vw,88px)] gap-y-10 min-[861px]:grid-cols-2">
        <div>
          <Eyebrow path="/contact" />
          <h1 className="mt-[18px] font-display text-[clamp(2.5rem,6.6vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.045em]">
            Got something
            <br />
            in <span className="text-accent">mind?</span>
          </h1>
          <p className="mt-6 max-w-[42ch] text-muted">{contactBlurb(Boolean(bookingUrl))}</p>
          {bookingUrl ? <BookingCard bookingUrl={bookingUrl} /> : null}
          <Socials socials={site.socials} email={site.email} />
        </div>
        <ContactForm />
      </div>
    </Container>
  )
}
