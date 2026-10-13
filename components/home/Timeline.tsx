'use client'

import { useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { activeEntries, entrySub, entryYear } from '@/lib/home/timeline'
import { useMotionEnabled } from '@/lib/motion'
import { useWriteTransform } from '@/lib/use-write-transform'
import { TimelineItem, type TimelineEntry } from './TimelineItem'
import { TimelineYear } from './TimelineYear'

/** The reading line: an entry lights up when its top passes 55% of the viewport height. */
const LINE = 0.55

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
 * the scroll through a spring, a dot per entry that lights up past the reading line, and (on
 * desktop) a sticky year that follows the active entry.
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

  // Fill: how far the timeline has scrolled through the window, from `start 70%` to `end 50%`.
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start 70%', 'end 50%'] })
  const spring = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  // The spring overshoots a little. The fill must not run past the track.
  const transform = useTransform(spring, (value) => `scaleY(${Math.min(1, Math.max(0, value))})`)
  useWriteTransform(fill, transform, animated)

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

  // The observer watches the line (a band of zero height at 55%), so it fires whenever an entry's
  // edge crosses it. A jump in scroll position can carry the line over entries without any of them
  // touching it afterwards, so a change in scroll progress measures too.
  useEffect(() => {
    if (!animated) return

    const observer = new IntersectionObserver(measure, { rootMargin: '-55% 0px -45% 0px' })
    items.current.forEach((item) => item && observer.observe(item))
    window.addEventListener('resize', measure)
    measure()
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [animated, entries.length, measure])

  useMotionValueEvent(scrollYProgress, 'change', () => {
    if (animated) measure()
  })

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
