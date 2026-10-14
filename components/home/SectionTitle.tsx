import { cn } from '@/lib/cn'

type SectionTitleProps = {
  /** Id of the `h2`. The section points at it with `aria-labelledby`. */
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  /** A button or link aligned to the right of the title. */
  action?: React.ReactNode
  className?: string
}

/** The `h2`, the line under it and an optional action, shared by every homepage section. */
export function SectionTitle({ id, title, description, action, className }: SectionTitleProps) {
  return (
    <div
      className={cn(
        'mb-[clamp(32px,4vw,56px)] flex flex-wrap items-end justify-between gap-4',
        className
      )}
    >
      <div>
        <h2 id={id} className="h2">
          {title}
        </h2>
        {description ? <p className="mt-3.5 max-w-[46ch] text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
