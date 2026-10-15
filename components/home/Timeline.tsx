'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { activeEntries, entrySub, entryYear } from '@/lib/home/timeline'
import { useMotionEnabled } from '@/lib/motion'
import { createSpring2D, type Spring2D } from '@/lib/spring'
import { useScrollProgress, type ScrollWindow } from '@/lib/use-scroll-progress'
import { TimelineItem, type TimelineEntry } from './TimelineItem'
import { TimelineYear } from './TimelineYear'

/** The reading line: an entry lights up when its top passes 55% of the viewport height. */
const LINE = 0.55

/** The fill starts when the timeline's top reaches 70% of the viewport, and ends at its bottom at 50%. */
const DRAWING: ScrollWindow = { startAt: 0.7, endAt: 0.5 }

/** The spring runs on thousandths, so it settles to well under a pixel (see `lib/spring.ts`). */
const SCALE = 1000

const noop = () => () => {}
/** False on the server and during hydration, true afterwards. */
const useIsClient = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false
  )

/**
 * The scroll-drawn timeline (DESIGN §7.2). A 2px track in `--line` with a rose fill that follows
 * the scroll through a spring (stiffness 120, damping 30), a dot per entry that lights up past the
 * reading line, and (on desktop) a sticky year that follows the active entry.
 *
 * It renders fully drawn with every entry in place: that is what you get with JavaScript off, with
 * reduced motion, and in the server HTML. Scroll-linked drawing only takes over once the client
 * is running and motion is allowed.
 */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const isClient = useIsClient()
  const motionEnabled = useMotionEnabled()
  const animated = isClient && motionEnabled
  const wrap = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLLIElement | null)[]>([])
  const [state, setState] = useState(() => ({ lit: entries.map(() => true), active: 0 }))

  // Fill: how far the timeline has scrolled through the window. It jumps to the right place the
  // first time, so it doesn't animate in from nothing, and follows by spring after that.
  const spring = useRef<Spring2D | null>(null)
  const primed = useRef(false)
  useEffect(() => {
    const element = fill.current
    if (!animated || !element) return
    spring.current = createSpring2D(
      (value) => {
        element.style.transform = `scaleY(${Math.min(1, Math.max(0, value / SCALE))})`
      },
      { stiffness: 120, damping: 30, mass: 1 }
    )
    return () => {
      spring.current?.stop()
      spring.current = null
      primed.current = false
      element.style.transform = ''
    }
  }, [animated])

  // Which entries have passed the reading line: measure every entry's top against it.
  const measure = useCallback(() => {
    const tops = items.current.map((item) => item?.getBoundingClientRect().top ?? Infinity)
    const next = activeEntries(tops, window.innerHeight * LINE)
    setState((previous) =>
      previous.active === next.active && previous.lit.every((value, i) => value === next.lit[i])
        ? previous
        : next
    )
  }, [])

  // Every frame the page scrolls: move the fill and look at the entries. Measuring on scroll,
  // rather than only when an entry crosses the line, also gets a jump right (an anchor link or the
  // End key can carry the line over entries that never touch it afterwards).
  useScrollProgress(
    wrap,
    DRAWING,
    (progress) => {
      if (spring.current) {
        if (primed.current) spring.current.set(progress * SCALE, 0)
        else {
          spring.current.jump(progress * SCALE, 0)
          primed.current = true
        }
      }
      measure()
    },
    animated
  )

  const lit = animated ? state.lit : entries.map(() => true)
  const active = entries[animated ? state.active : 0]

  return (
    <div
      ref={wrap}
      className="relative grid gap-x-10 min-[821px]:grid-cols-[160px_minmax(0,1fr)]"
      data-testid="timeline"
      data-animated={animated}
    >
      {active ? <TimelineYear year={entryYear(active)} sub={entrySub(active)} /> : null}

      <div className="relative min-w-0 pl-9">
        <div aria-hidden="true" className="absolute top-1.5 bottom-1.5 left-[7px] w-0.5 bg-line" />
        <div
          ref={fill}
          aria-hidden="true"
          data-testid="timeline-fill"
          className="absolute top-1.5 bottom-1.5 left-[7px] w-0.5 origin-top bg-accent"
        />
        <ol className="grid gap-[clamp(36px,5vw,64px)]">
          {entries.map((entry, index) => (
            <TimelineItem
              key={`${entry.start}-${entry.role}`}
              entry={entry}
              lit={lit[index] ?? true}
              ref={(node) => {
                items.current[index] = node
              }}
            />
          ))}
        </ol>
      </div>
    </div>
  )
}
