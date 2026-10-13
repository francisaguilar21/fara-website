'use client'

import { createContext, useCallback, useContext, useRef } from 'react'
import { flushSync } from 'react-dom'
import { usePrefersReducedMotion } from '@/lib/motion'

const DURATION_MS = 900

type Play = (onMidpoint: () => void) => void

const SlashWipeContext = createContext<Play | null>(null)

/**
 * Plays the wipe and runs `onMidpoint` while the screen is covered, so the page can change
 * underneath it (theme, menu, route). Without a provider it just runs the callback.
 */
export function useSlashWipe(): Play {
  return useContext(SlashWipeContext) ?? ((onMidpoint) => onMidpoint())
}

const SLASH = 'skewX(-17deg)'

/**
 * Full-screen `--accent` panel skewed -17° that travels left → center → right over 0.9s, using the
 * Web Animations API (no animation library in the initial bundle). With reduced motion the panel
 * is skipped and the change cross-fades in 0.2s (View Transitions API), or happens straight away
 * where that isn't supported.
 */
export function SlashWipeProvider({ children }: { children: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const reduced = usePrefersReducedMotion()

  const play = useCallback<Play>(
    (onMidpoint) => {
      const el = panel.current
      if (busy.current) return

      if (reduced || !el) {
        if (typeof document.startViewTransition === 'function') {
          document.startViewTransition(() => flushSync(onMidpoint))
        } else {
          onMidpoint()
        }
        return
      }

      busy.current = true
      const timer = window.setTimeout(onMidpoint, DURATION_MS / 2)
      const animation = el.animate(
        [
          { transform: `translateX(-130%) ${SLASH}`, offset: 0 },
          { transform: `translateX(0) ${SLASH}`, offset: 0.45 },
          { transform: `translateX(0) ${SLASH}`, offset: 0.55 },
          { transform: `translateX(130%) ${SLASH}`, offset: 1 },
        ],
        // ease-out-quint on each segment
        { duration: DURATION_MS, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      )
      const done = () => {
        window.clearTimeout(timer)
        busy.current = false
      }
      animation.onfinish = done
      animation.oncancel = done
    },
    [reduced]
  )

  return (
    <SlashWipeContext.Provider value={play}>
      {children}
      <div
        ref={panel}
        aria-hidden="true"
        data-testid="slash-wipe"
        className="pointer-events-none fixed -inset-x-[20vw] -inset-y-[10vh] z-[90] bg-accent"
        style={{ transform: `translateX(-130%) ${SLASH}` }}
      />
    </SlashWipeContext.Provider>
  )
}
