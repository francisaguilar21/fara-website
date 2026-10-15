import { cn } from '@/lib/cn'

// The F/A mark, hand-built from straight strokes (the slash sits at about 17°). Letters use
// `currentColor`; with `accent` the slash switches to the rose `--accent` token. The paths are
// exported so the generated OG images (`lib/og.tsx`) draw the same mark.
export const LOGO_LETTERS =
  'M2.9 12.2 L35.3 12.2 L35.3 21.3 L12.9 21.3 L12.9 34.3 L33.1 34.3 L33.1 43.0 L12.9 43.0 L12.9 63.5 L2.9 63.5 Z M86.3 12.2 L99.6 12.2 L117.1 63.5 L106.9 63.5 L102.8 51.6 L82.8 51.6 L78.8 63.5 L68.8 63.5 Z M92.8 22.2 L85.8 43.0 L99.8 43.0 Z'
export const LOGO_SLASH = 'M57.2 9.2 L66.4 9.2 L47.2 70.8 L38.0 70.8 Z'

export function Logo({
  accent = false,
  title,
  className,
}: {
  /** Draw the slash in the accent color. */
  accent?: boolean
  /** Accessible name. Leave it out when the logo sits inside a labelled link. */
  title?: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="currentColor"
      fillRule="evenodd"
      className={cn('h-6 w-auto', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={LOGO_LETTERS} />
      <path d={LOGO_SLASH} fill={accent ? 'var(--accent)' : undefined} />
    </svg>
  )
}
