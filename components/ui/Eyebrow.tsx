import { cn } from '@/lib/cn'

/** Route-style section label, for example `/work`. */
export function Eyebrow({ path, className }: { path: string; className?: string }) {
  return (
    <span className={cn('font-mono text-sm leading-none font-medium text-accent', className)}>
      {path}
    </span>
  )
}
