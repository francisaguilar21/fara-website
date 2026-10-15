'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSlashWipe } from '@/components/motion/SlashWipe'

/**
 * Sun/moon icon button. Both icons are always in the DOM and CSS picks one from `data-theme`, so
 * there is no hydration mismatch and no flash of the wrong icon.
 */
export function ThemeToggle() {
  const { setTheme } = useTheme()
  const wipe = useSlashWipe()

  return (
    <button
      type="button"
      aria-label="Switch theme"
      className="grid size-[38px] cursor-pointer place-items-center rounded-full border border-line bg-transparent text-fg transition-colors hover:border-accent hover:text-accent"
      onClick={() => {
        // Read the DOM rather than state: it's always what the visitor currently sees.
        const isLight = document.documentElement.dataset.theme === 'light'
        // The theme switches at the midpoint, while the wipe covers the page.
        wipe(() => setTheme(isLight ? 'dark' : 'light'))
      }}
    >
      <Sun className="size-4 light:hidden" aria-hidden="true" />
      <Moon className="hidden size-4 light:block" aria-hidden="true" />
    </button>
  )
}
