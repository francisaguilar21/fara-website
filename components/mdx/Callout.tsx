import { cn } from '@/lib/cn'

type CalloutProps = {
  /** `warning` swaps the rose rule for the error color. */
  type?: 'note' | 'warning'
  title?: string
  children: React.ReactNode
}

/** A boxed aside in a post: `<Callout title="Heads up">…</Callout>`. */
export function Callout({ type = 'note', title, children }: CalloutProps) {
  return (
    <aside
      className={cn(
        'my-8 border border-l-2 border-line bg-surface px-5 py-4',
        type === 'warning' ? 'border-l-error' : 'border-l-accent'
      )}
    >
      {title ? <p className="mb-2 label text-fg">{title}</p> : null}
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
    </aside>
  )
}
