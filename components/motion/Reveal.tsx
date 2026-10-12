'use client'

import { LazyMotion, m } from 'motion/react'
import { Children } from 'react'
import { DURATION, EASE_OUT_QUINT, useMotionEnabled } from '@/lib/motion'

const tags = {
  div: m.div,
  section: m.section,
  article: m.article,
  header: m.header,
  p: m.p,
  span: m.span,
  ul: m.ul,
  ol: m.ol,
  li: m.li,
  h1: m.h1,
  h2: m.h2,
  h3: m.h3,
} as const

type RevealProps = {
  as?: keyof typeof tags
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
export function Reveal({ as = 'div', delay = 0, stagger, className, children }: RevealProps) {
  const enabled = useMotionEnabled()
  const Tag = tags[as]
  // Reduced motion: render the element static, with no animation at all.
  const Static = as as React.ElementType

  if (!enabled) return <Static className={className}>{children}</Static>

  if (stagger !== undefined) {
    return (
      <LazyMotion features={loadFeatures}>
        <Static className={className}>
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
        </Static>
      </LazyMotion>
    )
  }

  return (
    <LazyMotion features={loadFeatures}>
      <Tag
        className={className}
        initial={from}
        whileInView={to}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ ...transition, delay }}
      >
        {children}
      </Tag>
    </LazyMotion>
  )
}

export { DURATION }
