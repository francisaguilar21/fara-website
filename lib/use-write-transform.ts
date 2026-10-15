'use client'

import { useMotionValueEvent, type MotionValue } from 'motion/react'
import { useEffect, type RefObject } from 'react'

/**
 * Writes a motion value of CSS transform strings to an element's inline style.
 *
 * Scroll-linked values go through here rather than `<m.div style={{ y }}>`: an `m` component only
 * applies motion values once the animation features have loaded, so until then (and for anything
 * that never loads them) the element stays at its start position. Writing the style directly needs
 * no features and no extra chunk.
 */
export function useWriteTransform(
  ref: RefObject<HTMLElement | null>,
  transform: MotionValue<string>,
  enabled = true
) {
  useMotionValueEvent(transform, 'change', (value) => {
    if (enabled && ref.current) ref.current.style.transform = value
  })

  useEffect(() => {
    const element = ref.current
    if (!enabled || !element) return
    element.style.transform = transform.get()
    return () => {
      element.style.transform = ''
    }
  }, [enabled, ref, transform])
}
