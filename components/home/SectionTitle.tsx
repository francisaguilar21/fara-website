import { Magnetic } from '@/components/motion/Magnetic'
import { Button } from '@/components/ui/Button'

type SectionTitleProps = {
  /** Id of the `h2`. The section points at it with `aria-labelledby`. */
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  /** A ghost button aligned to the right of the title. */
  more?: { href: string; label: string }
}

/** The `h2`, the line under it and an optional link, shared by every homepage section. */
export function SectionTitle({ id, title, description, more }: SectionTitleProps) {
  return (
    <div className="mb-[clamp(32px,4vw,56px)] flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 id={id} className="h2">
          {title}
        </h2>
        {description ? <p className="mt-3.5 max-w-[46ch] text-muted">{description}</p> : null}
      </div>
      {more ? (
        <Magnetic>
          <Button href={more.href} variant="ghost" size="sm">
            {more.label} <span aria-hidden="true">→</span>
          </Button>
        </Magnetic>
      ) : null}
    </div>
  )
}
