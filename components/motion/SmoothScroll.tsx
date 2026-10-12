'use client'

import { useEffect } from 'react'
import { useMotionEnabled } from '@/lib/motion'

type Idle = (callback: () => void) => () => void

const whenIdle: Idle = (callback) => {
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout: 2000 })
    return () => window.cancelIdleCallback(id)
  }
  const id = setTimeout(callback, 200)
  return () => clearTimeout(id)
}

/**
 * Lenis smooth scrolling (`lerp: 0.1`), stepped from requestAnimationFrame. Lenis is imported
 * after the browser is idle, so it never competes with first paint. Off for reduced motion.
 */
export function SmoothScroll() {
  const enabled = useMotionEnabled()

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    let destroy: (() => void) | undefined

    const cancelIdle = whenIdle(async () => {
      const { default: Lenis } = await import('lenis')
      if (cancelled) return
      const lenis = new Lenis({ lerp: 0.1, autoRaf: false })

      // Step Lenis only while there is input to smooth. A loop that runs forever keeps the main
      // thread busy for nothing and shows up in Lighthouse as blocking time.
      let frame = 0
      let quietFrames = 0
      const step = (time: number) => {
        lenis.raf(time)
        quietFrames = lenis.isScrolling ? 0 : quietFrames + 1
        frame = quietFrames > 30 ? 0 : requestAnimationFrame(step)
      }
      const wake = () => {
        quietFrames = 0
        if (!frame) frame = requestAnimationFrame(step)
      }
      const wakeEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
      wakeEvents.forEach((name) => window.addEventListener(name, wake, { passive: true }))

      destroy = () => {
        wakeEvents.forEach((name) => window.removeEventListener(name, wake))
        cancelAnimationFrame(frame)
        lenis.destroy()
      }
    })

    return () => {
      cancelled = true
      cancelIdle()
      destroy?.()
    }
  }, [enabled])

  return null
}
