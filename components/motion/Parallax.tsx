'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { useMotionEnabled } from '@/lib/motion'
import { useScrollProgress, type ScrollWindow } from '@/lib/use-scroll-progress'

type ParallaxProps = {
  /** Largest shift in px, up or down. */
  offset?: number
  className?: string
  /** Classes for the element that moves, for example to make it taller than its frame. */
  innerClassName?: string
  children: React.ReactNode
}

/** From the element's top edge entering at the bottom of the screen to its bottom edge leaving at the top. */
const CROSSING: ScrollWindow = { startAt: 1, endAt: 0 }

/** Moves its content up to `offset`px either way as it crosses the viewport. */
export function Parallax({ offset = 40, className, innerClassName, children }: ParallaxProps) {
  const enabled = useMotionEnabled()
  const ref = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)

  // `offset` px below its place as it enters, `offset` px above as it leaves.
  useScrollProgress(
    ref,
    CROSSING,
    (progress) => {
      if (inner.current) {
        inner.current.style.transform = `translate3d(0, ${offset * (1 - 2 * progress)}px, 0)`
      }
    },
    enabled
  )

  // Back in place when motion is turned off.
  useEffect(() => {
    const element = inner.current
    return () => {
      if (element) element.style.transform = ''
    }
  }, [enabled])

  // The same markup with or without motion, so the layout doesn't depend on it.
  return (
    <div ref={ref} className={className}>
      <div ref={inner} className={cn(enabled && 'will-change-transform', innerClassName)}>
        {children}
      </div>
    </div>
  )
}
