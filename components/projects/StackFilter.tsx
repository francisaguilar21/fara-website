'use client'

import { cn } from '@/lib/cn'
import type { StackOption } from '@/lib/projects/stack'

type StackFilterProps = {
  options: StackOption[]
  /** Slug of the chip that is on. Empty means "All". */
  selected: string
  onSelect: (slug: string) => void
}

/**
 * Chips to filter the projects by stack tag (P6-R7). They are toggle buttons: pressing the one that
 * is on, or "All", clears the filter. The page keeps the choice in `?stack=`.
 */
export function StackFilter({ options, selected, onSelect }: StackFilterProps) {
  if (options.length === 0) return null

  const chip = (slug: string, label: string, count?: number) => {
    const pressed = slug === selected
    return (
      <li key={slug || 'all'}>
        <button
          type="button"
          aria-pressed={pressed}
          onClick={() => onSelect(pressed ? '' : slug)}
          className={cn(
            // 24px is the smallest target WCAG 2.2 allows; the padding makes it taller.
            'cursor-pointer rounded-full border px-3 py-2 font-mono text-xs leading-none transition-colors motion-reduce:transition-none',
            pressed
              ? 'border-accent bg-accent text-accent-ink'
              : 'border-line text-muted hover:border-accent hover:text-accent'
          )}
        >
          {label}
          {count === undefined ? null : <span className="ml-1.5 opacity-70">{count}</span>}
        </button>
      </li>
    )
  }

  return (
    <ul aria-label="Filter by stack" className="flex flex-wrap gap-2">
      {chip('', 'All')}
      {options.map((option) => chip(option.slug, option.label, option.count))}
    </ul>
  )
}
