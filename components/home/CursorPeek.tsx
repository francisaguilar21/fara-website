'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { useMotionEnabled } from '@/lib/motion'
import { createSpring2D } from '@/lib/spring'

export type PeekCover = { slug: string; src: string; blurDataURL: string }

// The preview is 280×210. It sits 170px to the right of the pointer, centered vertically.
const WIDTH = 280
const HEIGHT = 210
const OFFSET_X = 170

/**
 * A cover image that follows the pointer while it is over a row marked `data-peek="<slug>"`.
 * Mouse and trackpad only: it is not rendered for touch (`pointer: coarse`) or reduced motion, and
 * keyboard users get the focus style on the row instead. Decorative, so hidden from assistive tech.
 */
export function CursorPeek({ covers }: { covers: PeekCover[] }) {
  const enabled = useMotionEnabled({ pointer: 'fine' })
  const frame = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const element = frame.current
    if (!enabled || !element) return

    const spring = createSpring2D((x, y) => {
      element.style.transform = `translate3d(${x - WIDTH / 2}px, ${y - HEIGHT / 2}px, 0)`
    })
    const pointer = { x: -1000, y: -1000 }
    let showing = false

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      pointer.x = event.clientX + OFFSET_X
      pointer.y = event.clientY
      if (showing) spring.set(pointer.x, pointer.y)
    }
    const onOver = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const row = (event.target as Element | null)?.closest<HTMLElement>('[data-peek]')
      const slug = row?.dataset.peek ?? null
      // Start from the pointer, not from wherever the preview was last left.
      if (slug && !showing) spring.jump(pointer.x, pointer.y)
      showing = slug !== null
      setActive(slug)
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      spring.stop()
    }
  }, [enabled])

  if (!enabled || covers.length === 0) return null

  return (
    <div
      ref={frame}
      aria-hidden="true"
      data-testid="cursor-peek"
      className="pointer-events-none fixed top-0 left-0 z-30"
      // Parked off-screen until the first row is hovered. The spring takes over `transform`.
      style={{ width: WIDTH, height: HEIGHT, transform: 'translate3d(-1000px, -1000px, 0)' }}
    >
      <div
        className={cn(
          'relative size-full overflow-hidden border border-line bg-surface transition-[opacity,scale] duration-[350ms] ease-out-quint',
          active ? 'scale-100 opacity-100' : 'scale-[.85] opacity-0'
        )}
      >
        {covers.map((cover) => (
          <Image
            key={cover.slug}
            src={cover.src}
            alt=""
            fill
            sizes={`${WIDTH}px`}
            placeholder="blur"
            blurDataURL={cover.blurDataURL}
            className={cn(
              'object-cover transition-opacity duration-200',
              active === cover.slug ? 'opacity-100' : 'opacity-0'
            )}
          />
        ))}
      </div>
    </div>
  )
}
