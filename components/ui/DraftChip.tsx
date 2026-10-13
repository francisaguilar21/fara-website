import { cn } from '@/lib/cn'

/** Marks placeholder content that is waiting for the real thing (Phase 5 draft policy). */
export function DraftChip({
  children = 'draft',
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-block border border-dashed border-accent px-[5px] py-[3px] align-middle font-mono text-[0.625rem] leading-none font-medium tracking-[0.08em] text-accent uppercase',
        className
      )}
    >
      {children}
    </span>
  )
}
