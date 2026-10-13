import { cn } from '@/lib/cn'
import type { Theme } from '@/lib/design/tokens'

// Forces a theme on a subtree. The tokens are defined per [data-theme], so nesting works. Used by
// /styleguide to show everything in both themes side by side.
export function ThemePanel({
  theme,
  className,
  children,
}: {
  theme: Theme
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      data-theme={theme}
      className={cn('min-w-0 border border-line bg-bg p-6 text-fg', className)}
    >
      <p className="mb-4 label">{theme}</p>
      {children}
    </div>
  )
}
