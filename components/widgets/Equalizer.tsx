import { cn } from '@/lib/cn'

/** Three green bars that bounce while music plays. Still, at 40% height, for reduced motion. */
export function Equalizer({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex h-3 items-end gap-0.5', className)}
      data-testid="equalizer"
    >
      <i className="h-full w-[3px] animate-equalize bg-ok" />
      <i className="h-full w-[3px] animate-equalize bg-ok [animation-delay:200ms]" />
      <i className="h-full w-[3px] animate-equalize bg-ok [animation-delay:400ms]" />
    </span>
  )
}
