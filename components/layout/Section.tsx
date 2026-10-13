import { cn } from '@/lib/cn'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Label } from '@/components/ui/Label'
import { Container } from './Container'

type SectionProps = {
  /** Route-style path shown in the left rail, for example `/work`. */
  eyebrow: string
  /** Mono label under the eyebrow. */
  label?: string
  /** Extra content under the label in the left rail, for example a legend. */
  aside?: React.ReactNode
  className?: string
  children: React.ReactNode
} & Omit<React.ComponentProps<'section'>, 'className' | 'children'>

/**
 * Editorial section: the eyebrow sits in a narrow left rail and the content in the right column.
 * Under 820px they stack. Pass `id` to make it an anchor target.
 */
export function Section({ eyebrow, label, aside, className, children, ...rest }: SectionProps) {
  return (
    <Container as="section" className={cn('py-24 md:py-36', className)} {...rest}>
      <div className="grid gap-8 min-[820px]:grid-cols-[minmax(140px,220px)_minmax(0,1fr)] min-[820px]:gap-x-[clamp(24px,4vw,56px)]">
        <div className="flex flex-col gap-3.5">
          <Eyebrow path={eyebrow} />
          {label ? <Label>{label}</Label> : null}
          {aside}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  )
}
