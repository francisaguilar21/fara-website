import { cn } from '@/lib/cn'

/** A single 17° slash that replaces a horizontal rule between major sections. */
export function SlashDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('relative mx-auto h-12 max-w-site', className)}>
      <span className="absolute inset-y-0 left-1/2 w-0.5 -skew-x-[17deg] bg-line" />
    </div>
  )
}
