'use client'

import { useEffect, useRef } from 'react'
import { createSpring2D } from '@/lib/spring'

const RING = 34
const RING_LINK = 48
const RING_LARGE = 64

export default function CursorOverlay() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const dotEl = dot.current
    const ringEl = ring.current
    const labelEl = label.current
    if (!dotEl || !ringEl || !labelEl) return

    document.body.classList.add('has-cursor')

    const place = (el: HTMLElement) => (x: number, y: number) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    }
    const dotSpring = createSpring2D(place(dotEl), { stiffness: 900, damping: 50 })
    const ringSpring = createSpring2D(place(ringEl), { stiffness: 260, damping: 28, mass: 0.5 })
    let shown = false

    const onMove = (event: PointerEvent) => {
      if (!shown) {
        dotSpring.jump(event.clientX, event.clientY)
        ringSpring.jump(event.clientX, event.clientY)
        dotEl.style.opacity = '1'
        ringEl.style.opacity = '0.5'
        shown = true
      }
      dotSpring.set(event.clientX, event.clientY)
      ringSpring.set(event.clientX, event.clientY)
    }

    const grow = (size: number, text: string | null) => {
      ringEl.style.width = ringEl.style.height = `${size}px`
      ringEl.dataset.active = text === null ? 'false' : 'true'
      ringEl.style.opacity = text === null ? '0.5' : '1'
      labelEl.textContent = text
    }
    const onOver = (event: PointerEvent) => {
      const el = event.target instanceof Element ? event.target : null
      const labelled = el?.closest<HTMLElement>('[data-cursor]')
      if (labelled) grow(RING_LARGE, labelled.dataset.cursor ?? '')
      else if (el?.closest('a, button')) grow(RING_LINK, null)
      else grow(RING, null)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      dotSpring.stop()
      ringSpring.stop()
    }
  }, [])

  return (
    <>
      <div
        ref={dot}
        aria-hidden="true"
        data-testid="cursor-dot"
        className="pointer-events-none fixed top-0 left-0 z-[100] size-1.5 rounded-full bg-accent opacity-0"
      />
      <div
        ref={ring}
        aria-hidden="true"
        data-testid="cursor-ring"
        className="pointer-events-none fixed top-0 left-0 z-[100] grid place-items-center rounded-full border border-fg font-mono text-[0.625rem] leading-none font-medium tracking-[0.08em] text-accent-ink uppercase opacity-0 transition-[width,height,background-color,border-color,opacity] duration-300 ease-out-quint data-[active=true]:border-accent data-[active=true]:bg-accent"
        style={{ width: RING, height: RING }}
      >
        <span ref={label} />
      </div>
    </>
  )
}
