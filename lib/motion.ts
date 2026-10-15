'use client'

import { createContext, useContext, useSyncExternalStore } from 'react'

export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const
export const DURATION = { fast: 0.18, base: 0.4, slow: 0.7 } as const

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false
  )
}

/** False on the server and during hydration, true afterwards. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

/** Runs `callback` once the browser is idle (or after 200ms where it can't tell). Returns the cancel. */
export function whenIdle(callback: () => void): () => void {
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout: 2000 })
    return () => window.cancelIdleCallback(id)
  }
  const id = setTimeout(callback, 200)
  return () => clearTimeout(id)
}

/**
 * Lets /styleguide pretend the visitor prefers reduced motion. The real media query is still
 * respected when this is `null`.
 */
export const SimulatedReducedMotion = createContext<boolean | null>(null)

export function usePrefersReducedMotion(): boolean {
  const simulated = useContext(SimulatedReducedMotion)
  const real = useMediaQuery('(prefers-reduced-motion: reduce)')
  return simulated ?? real
}

/** True for a mouse or trackpad. False on touch devices (`pointer: coarse`). */
export function useFinePointer(): boolean {
  return useMediaQuery('(pointer: fine)')
}

/**
 * Whether motion should play. Off for `prefers-reduced-motion: reduce`. Pass
 * `{ pointer: 'fine' }` for effects that only make sense with a mouse (cursor, magnetic pull).
 * Phase 7 adds the `motion-rich` PostHog kill switch here.
 */
export function useMotionEnabled({ pointer }: { pointer?: 'fine' } = {}): boolean {
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()
  return !reduced && (pointer !== 'fine' || fine)
}
