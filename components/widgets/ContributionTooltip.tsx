'use client'

import { useEffect, useRef, useState } from 'react'
import { formatDate } from '@/lib/content/format'
import { cellAt, CELL, dateAt, PITCH } from '@/lib/home/heatmap'

type Tip = { text: string; x: number; y: number }

/** Width of one character of the 12px mono text, to keep the tooltip inside its wrapper. */
const CHAR_PX = 7.3

type Props = {
  /** Date of the first cell, `YYYY-MM-DD`. */
  start: string
  /** Contributions per day, `counts[week * 7 + day]`. */
  counts: number[]
}

/**
 * A tooltip for the heatmap: the date and count of the cell under the pointer. It sits next to
 * the SVG inside the same wrapper and reads the pointer position, since the cells are paths of
 * one shape, not elements. Cells can't take keyboard focus (371 tab stops would be unusable), so
 * the heatmap carries its numbers in its text alternative instead.
 */
export function ContributionTooltip({ start, counts }: Props) {
  const anchor = useRef<HTMLSpanElement>(null)
  const [tip, setTip] = useState<Tip | null>(null)

  useEffect(() => {
    const wrapper = anchor.current?.parentElement
    const svg = wrapper?.querySelector('svg')
    if (!wrapper || !svg) return

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const box = svg.getBoundingClientRect()
      // The SVG is drawn at its own size, but divide by the scale in case CSS ever resizes it.
      const scale = box.width / Number(svg.getAttribute('width')) || 1
      const cell = cellAt(
        (event.clientX - box.left) / scale,
        (event.clientY - box.top) / scale,
        counts
      )
      if (!cell) {
        setTip(null)
        return
      }
      const count = counts[cell.index]!
      const text = `${count === 0 ? 'No' : count} contribution${count === 1 ? '' : 's'} on ${formatDate(dateAt(start, cell.index), 'short')}`
      const frame = wrapper.getBoundingClientRect()
      // The tooltip is centered on the cell. Keep it inside the wrapper at either end of the grid.
      const half = (text.length * CHAR_PX + 16) / 2
      const center = box.left - frame.left + (cell.column * PITCH + CELL / 2) * scale
      setTip({
        text,
        x: Math.min(Math.max(center, half), Math.max(half, frame.width - half)),
        y: box.top - frame.top + cell.row * PITCH * scale,
      })
    }
    const onLeave = () => setTip(null)

    svg.addEventListener('pointermove', onMove)
    svg.addEventListener('pointerleave', onLeave)
    return () => {
      svg.removeEventListener('pointermove', onMove)
      svg.removeEventListener('pointerleave', onLeave)
    }
  }, [start, counts])

  return (
    <span ref={anchor} className="contents">
      {tip ? (
        <span
          role="tooltip"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+6px)] rounded-md border border-line bg-surface px-2 py-1.5 font-mono text-xs leading-none whitespace-nowrap"
          style={{ left: tip.x, top: tip.y }}
        >
          {tip.text}
        </span>
      ) : null}
    </span>
  )
}
