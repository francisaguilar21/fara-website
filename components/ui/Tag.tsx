import { cn } from '@/lib/cn'

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full border border-line px-[9px] py-1.5 font-mono text-xs leading-none text-muted',
        className
      )}
    >
      {children}
    </span>
  )
}
