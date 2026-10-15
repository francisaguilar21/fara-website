'use client'

import { LazyMotion, m } from 'motion/react'
import { Children } from 'react'
import { EASE_OUT_QUINT, useMotionEnabled } from '@/lib/motion'

type RevealProps = {
  /** Seconds to wait before this element animates. */
  delay?: number
  /** Seconds between each direct child. Each child is wrapped in its own reveal. */
  stagger?: number
  className?: string
  children: React.ReactNode
}

// The animation features are a separate chunk, fetched when the first Reveal mounts.
const loadFeatures = () => import('./features').then((module) => module.default)

// The resting state is visible (never opacity 0), so nothing is hidden while JavaScript loads.
const from = { opacity: 0.6, y: 16 }
const to = { opacity: 1, y: 0 }
const transition = { duration: 0.6, ease: EASE_OUT_QUINT }

/** Fades and lifts its content into place once, when it scrolls into view. */
export function Reveal({ delay = 0, stagger, className, children }: RevealProps) {
  const enabled = useMotionEnabled()

  // Reduced motion: render the element static, with no animation at all.
  if (!enabled) return <div className={className}>{children}</div>

  if (stagger !== undefined) {
    return (
      <LazyMotion features={loadFeatures}>
        <div className={className}>
          {Children.map(children, (child, index) => (
            <m.div
              initial={from}
              whileInView={to}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ ...transition, delay: delay + index * stagger }}
            >
              {child}
            </m.div>
          ))}
        </div>
      </LazyMotion>
    )
  }

  return (
    <LazyMotion features={loadFeatures}>
      <m.div
        className={className}
        initial={from}
        whileInView={to}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ ...transition, delay }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
