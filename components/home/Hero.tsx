import { Container } from '@/components/layout/Container'
import { Magnetic } from '@/components/motion/Magnetic'
import { Button } from '@/components/ui/Button'
import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import { UnderlineLink } from '@/components/ui/UnderlineLink'
import { shouldHideDrafts } from '@/lib/content/visibility'
import { splitHeadline } from '@/lib/home/headline'
import { HERO_ROLES } from './hero-roles'
import { HeroPortrait } from './HeroPortrait'

// City-level, not a home location (phase 5 open question).
const COORDINATES = '14.60°N 120.98°E'

type HeroProps = {
  name: string
  headline: string
  intro: string
  location: string
  /** The booking page (`getBookingUrl()`). Without one the second button points at the contact form. */
  bookingUrl?: string
}

/** Section 1: the only `h1` on the page. A server component. */
export function Hero({ name, headline, intro, location, bookingUrl }: HeroProps) {
  const lines = splitHeadline(headline)
  // A draft chip is for reviewing placeholders. It never shows where drafts are hidden.
  const showChips = !shouldHideDrafts()

  return (
    <Container
      as="section"
      aria-labelledby="hero-heading"
      className="pt-[clamp(48px,9vw,112px)] pb-[clamp(40px,6vw,72px)]"
    >
      <div className="grid items-end gap-[clamp(24px,5vw,64px)] min-[761px]:grid-cols-[minmax(0,1fr)_clamp(200px,26vw,320px)]">
        <div>
          <div className="mb-7 flex flex-wrap gap-x-5 gap-y-2">
            <Label>{name}</Label>
            <Label>
              {location} · {COORDINATES}
            </Label>
          </div>

          <h1 id="hero-heading" className="display-xl">
            {lines.map((line, index) => (
              <span
                key={index}
                className="block animate-rise"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {index > 0 ? ' ' : null}
                {line.map((segment, position) =>
                  segment.underline ? (
                    <span key={position} className="headline-under">
                      {segment.text}
                    </span>
                  ) : (
                    segment.text
                  )
                )}
              </span>
            ))}
          </h1>

          <p className="mt-8 max-w-[52ch] text-[1.1875rem] text-muted">{intro}</p>

          <ul className="mt-9 grid max-w-[640px] border-t border-line">
            {HERO_ROLES.map((role) => (
              <li
                key={role.path}
                className="grid grid-cols-[76px_1fr] items-baseline gap-3 border-b border-line py-3"
              >
                <span className="font-mono text-[0.8125rem] leading-none font-medium text-accent">
                  {role.path}
                </span>
                <span>
                  {role.text}
                  {role.link ? (
                    <UnderlineLink href={role.link.href} external>
                      {role.link.label}
                    </UnderlineLink>
                  ) : null}
                  {role.draft && showChips ? (
                    <DraftChip className="ml-1.5">{role.draft}</DraftChip>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Magnetic>
              <Button href="#work">
                See my work <span aria-hidden="true">↓</span>
              </Button>
            </Magnetic>
            <Magnetic>
              {/* Without a booking page there is nothing to book: send them to the form instead. */}
              <Button href={bookingUrl ?? '#contact'} variant="ghost">
                {bookingUrl ? 'Book a call' : 'Send a message'}
              </Button>
            </Magnetic>
          </div>
        </div>

        <div className="max-[760px]:order-first max-[760px]:max-w-[220px]">
          <HeroPortrait />
          <div className="mt-2.5 flex justify-between gap-2">
            <Label>Hover for color</Label>
            <Label>2023</Label>
          </div>
        </div>
      </div>
    </Container>
  )
}
