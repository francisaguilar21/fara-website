'use client'

import { useEffect, useRef } from 'react'
import { createSpring2D } from '@/lib/spring'
import { useMotionEnabled } from '@/lib/motion'

type MagneticProps = {
  /** Largest pull toward the pointer, in px. */
  strength?: number
  className?: string
  children: React.ReactNode
}

/**
 * Pulls its child toward the pointer and springs back on leave. The wrapper is always rendered, so
 * its children never remount. Off for touch devices and reduced motion.
 */
export function Magnetic({ strength = 12, className, children }: MagneticProps) {
  const enabled = useMotionEnabled({ pointer: 'fine' })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return

    const spring = createSpring2D((x, y) => {
      el.style.transform = x === 0 && y === 0 ? '' : `translate3d(${x}px, ${y}px, 0)`
    })
    const clamp = (value: number) => Math.max(-1, Math.min(1, value))

    const move = (event: PointerEvent) => {
      const box = el.getBoundingClientRect()
      const dx = (event.clientX - (box.left + box.width / 2)) / (box.width / 2)
      const dy = (event.clientY - (box.top + box.height / 2)) / (box.height / 2)
      spring.set(clamp(dx) * strength, clamp(dy) * strength)
    }
    const leave = () => spring.set(0, 0)

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      spring.stop()
      el.style.transform = ''
    }
  }, [enabled, strength])

  return (
    <div ref={ref} className={className ?? 'inline-flex'}>
      {children}
    </div>
  )
}
