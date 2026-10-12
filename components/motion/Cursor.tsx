'use client'

import { lazy, Suspense, useEffect, useState } from 'react'
import { useMotionEnabled } from '@/lib/motion'

// The overlay (and the Motion springs it uses) is a separate chunk, fetched only once the browser
// is idle and only for visitors who can see it.
const CursorOverlay = lazy(() => import('./CursorOverlay'))

/**
 * Rose dot plus a ring that follows with a spring. The ring grows over links and buttons, and to
 * 64px with a label over elements marked `data-cursor="View"`. Off for touch and reduced motion.
 */
export function Cursor() {
  const enabled = useMotionEnabled({ pointer: 'fine' })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const hasIdle = 'requestIdleCallback' in window
    const id = hasIdle
      ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
      : window.setTimeout(() => setReady(true), 200)
    return () => {
      setReady(false)
      if (hasIdle) window.cancelIdleCallback(id)
      else window.clearTimeout(id)
    }
  }, [enabled])

  if (!enabled || !ready) return null
  return (
    <Suspense fallback={null}>
      <CursorOverlay />
    </Suspense>
  )
}
