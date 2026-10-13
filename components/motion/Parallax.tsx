'use client'

import { m, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useMotionEnabled } from '@/lib/motion'

type ParallaxProps = {
  /** Largest shift in px, up or down. */
  offset?: number
  className?: string
  children: React.ReactNode
}

/** Moves its content up to `offset`px either way as it crosses the viewport. */
export function Parallax({ offset = 40, className, children }: ParallaxProps) {
  const enabled = useMotionEnabled()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  if (!enabled) return <div className={className}>{children}</div>

  return (
    <div ref={ref} className={className}>
      <m.div style={{ y }} className="will-change-transform">
        {children}
      </m.div>
    </div>
  )
}
