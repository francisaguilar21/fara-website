import Link from 'next/link'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { cn } from '@/lib/cn'

type LifeCardProps = {
  /** Where the card goes, and the route-style label on it. */
  href: string
  title: string
  /** A live or fallback teaser: a number, a talk, photos or a quote. */
  children: React.ReactNode
  className?: string
}

/**
 * One of the four large cards of the `/life` hub (P6-R9). The title is the link, stretched over the
 * whole card, so there is one link per card for assistive tech and the whole card is clickable.
 */
export function LifeCard({ href, title, children, className }: LifeCardProps) {
  return (
    <article
      data-cursor="View"
      className={cn(
        'group relative flex min-w-0 flex-col gap-5 border border-line bg-bg p-[clamp(20px,3vw,36px)] transition-colors duration-300 focus-within:border-accent hover:border-accent motion-reduce:transition-none',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <Eyebrow path={href} />
        <span
          aria-hidden="true"
          className="font-display text-2xl transition-[rotate,color] duration-[350ms] ease-out-quint group-hover:text-accent motion-safe:group-hover:-rotate-45 motion-reduce:transition-none"
        >
          →
        </span>
      </div>
      <h2 className="h2">
        <Link
          href={href}
          className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
        >
          {title}
        </Link>
      </h2>
      <div className="mt-auto">{children}</div>
    </article>
  )
}
