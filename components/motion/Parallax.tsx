'use client'

import { useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { cn } from '@/lib/cn'
import { useMotionEnabled } from '@/lib/motion'
import { useWriteTransform } from '@/lib/use-write-transform'

type ParallaxProps = {
  /** Largest shift in px, up or down. */
  offset?: number
  className?: string
  /** Classes for the element that moves, for example to make it taller than its frame. */
  innerClassName?: string
  children: React.ReactNode
}

/** Moves its content up to `offset`px either way as it crosses the viewport. */
export function Parallax({ offset = 40, className, innerClassName, children }: ParallaxProps) {
  const enabled = useMotionEnabled()
  const ref = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    [`translate3d(0, ${offset}px, 0)`, `translate3d(0, ${-offset}px, 0)`]
  )
  useWriteTransform(inner, transform, enabled)

  // The same markup with or without motion, so the layout doesn't depend on it.
  return (
    <div ref={ref} className={className}>
      <div ref={inner} className={cn(enabled && 'will-change-transform', innerClassName)}>
        {children}
      </div>
    </div>
  )
}
