import { Eyebrow } from '@/components/ui/Eyebrow'
import { cn } from '@/lib/cn'

type PageHeaderProps = {
  /** Route-style path above the title, for example `/work` (P6-R1). */
  path: string
  /** The page's one `h1`. */
  title: React.ReactNode
  description?: React.ReactNode
  /** Shown to the right of the title on wide screens, for example a button. */
  actions?: React.ReactNode
  className?: string
}

/** The top of every inner page: eyebrow path, `h1`, a line under it and optional actions. */
export function PageHeader({ path, title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-wrap items-end justify-between gap-6', className)}>
      <div>
        <Eyebrow path={path} />
        <h1 className="mt-5 h1">{title}</h1>
        {description ? <p className="mt-5 max-w-[56ch] text-lg text-muted">{description}</p> : null}
      </div>
      {actions}
    </header>
  )
}
