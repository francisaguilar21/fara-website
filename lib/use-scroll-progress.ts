'use client'

import { useEffect, useRef, type RefObject } from 'react'

/**
 * Where on the screen the element starts and ends, as fractions of the viewport height measured
 * from the top. Progress is 0 when the element's top edge is at `startAt`, and 1 when its bottom
 * edge is at `endAt`. These are the same two numbers as Motion's `['start 70%', 'end 50%']`.
 */
export type ScrollWindow = { startAt: number; endAt: number }

/** How far through its window an element is: 0 before it, 1 after it, linear in between. */
export function scrollProgress(
  rect: { top: number; height: number },
  viewportHeight: number,
  { startAt, endAt }: ScrollWindow
): number {
  const start = startAt * viewportHeight
  const distance = rect.height + (startAt - endAt) * viewportHeight
  if (distance <= 0) return rect.top <= start ? 1 : 0
  return Math.min(1, Math.max(0, (start - rect.top) / distance))
}

/**
 * Calls `onProgress` with how far `ref`'s element has scrolled through `range`, once on mount and
 * then on every frame in which the page scrolls or the element resizes. The measuring is plain DOM
 * reads on the next animation frame, so there is no animation library behind it and the home
 * route doesn't pay for one.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  range: ScrollWindow,
  onProgress: (progress: number) => void,
  enabled = true
) {
  // The latest callback, without re-subscribing every render.
  const callback = useRef(onProgress)
  useEffect(() => {
    callback.current = onProgress
  })
  const { startAt, endAt } = range

  useEffect(() => {
    const element = ref.current
    if (!enabled || !element) return

    let frame = 0
    const measure = () => {
      frame = 0
      callback.current(
        scrollProgress(element.getBoundingClientRect(), globalThis.innerHeight, { startAt, endAt })
      )
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    globalThis.addEventListener('scroll', schedule, { passive: true })
    globalThis.addEventListener('resize', schedule)
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule)
    observer?.observe(element)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      globalThis.removeEventListener('scroll', schedule)
      globalThis.removeEventListener('resize', schedule)
      observer?.disconnect()
    }
  }, [ref, enabled, startAt, endAt])
}
