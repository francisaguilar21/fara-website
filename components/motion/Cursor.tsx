'use client'

import { lazy, Suspense, useEffect, useState } from 'react'
import { useMotionEnabled, whenIdle } from '@/lib/motion'

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
    const cancel = whenIdle(() => setReady(true))
    return () => {
      setReady(false)
      cancel()
    }
  }, [enabled])

  if (!enabled || !ready) return null
  return (
    <Suspense fallback={null}>
      <CursorOverlay />
    </Suspense>
  )
}
