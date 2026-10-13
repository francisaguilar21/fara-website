'use client'

import Image from 'next/image'
import { useId, useRef, useState, useSyncExternalStore } from 'react'
import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import { cn } from '@/lib/cn'

export type Quote = {
  quote: string
  name: string
  role: string
  company: string
  relationship: string
  /** Path under `public/`. Without one the avatar is a dashed placeholder circle. */
  avatar?: string
  /** Blur placeholder for `avatar`, made on the server. */
  blurDataURL?: string
  draft?: boolean
}

const SWIPE_PX = 48

const noop = () => () => {}
const useIsClient = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false
  )

/**
 * Recommendations, one at a time: dots below, a cross-fade between them, a swipe or drag on touch
 * and mouse, and the arrow keys (plus Home and End) on the dots, which follow the tabs pattern:
 * the dots are the tabs, the quote the panel. Without JavaScript every quote is shown in a list.
 */
export function QuoteCarousel({ quotes }: { quotes: Quote[] }) {
  const id = useId()
  const enhanced = useIsClient()
  const [index, setIndex] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const swipeStart = useRef<number | null>(null)

  if (quotes.length === 0) return null
  const last = quotes.length - 1

  const select = (next: number, { focus = false } = {}) => {
    const wrapped = (next + quotes.length) % quotes.length
    setIndex(wrapped)
    if (focus) tabs.current[wrapped]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: last,
    }
    const next = moves[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next, { focus: true })
  }

  return (
    <div>
      {/* `touch-pan-y` keeps vertical scrolling while we read the horizontal swipe. */}
      <div
        className={cn(enhanced ? 'grid touch-pan-y' : 'grid gap-10')}
        onPointerDown={(event) => {
          swipeStart.current = event.clientX
        }}
        onPointerUp={(event) => {
          if (swipeStart.current === null) return
          const distance = event.clientX - swipeStart.current
          swipeStart.current = null
          if (Math.abs(distance) >= SWIPE_PX) select(distance < 0 ? index + 1 : index - 1)
        }}
        onPointerCancel={() => {
          swipeStart.current = null
        }}
      >
        {quotes.map((item, position) => {
          const active = !enhanced || position === index
          return (
            <blockquote
              key={`${item.name}-${position}`}
              id={`${id}-panel-${position}`}
              role={enhanced ? 'tabpanel' : undefined}
              aria-labelledby={enhanced ? `${id}-tab-${position}` : undefined}
              aria-hidden={active ? undefined : true}
              // The quotes share one grid cell, so the box is as tall as the longest and nothing
              // jumps. The ones not shown fade out, and cannot be selected.
              className={cn(
                'm-0 border-l-2 border-accent pl-[clamp(16px,3vw,28px)]',
                enhanced &&
                  'col-start-1 row-start-1 transition-opacity duration-[180ms] motion-reduce:transition-none',
                enhanced && !active && 'pointer-events-none opacity-0 select-none'
              )}
            >
              <p className="font-display text-[clamp(1.25rem,2.4vw,1.75rem)] leading-[1.35] tracking-[-0.01em]">
                {item.quote}
              </p>
              <footer className="mt-[18px] flex items-center gap-3">
                {item.avatar ? (
                  <Image
                    src={item.avatar}
                    alt=""
                    width={40}
                    height={40}
                    sizes="40px"
                    placeholder={item.blurDataURL ? 'blur' : 'empty'}
                    blurDataURL={item.blurDataURL}
                    className="size-10 flex-none rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="size-10 flex-none rounded-full border border-dashed border-muted bg-surface"
                  />
                )}
                <div>
                  <div>
                    {item.name}
                    {item.draft ? <DraftChip className="ml-1.5" /> : null}
                  </div>
                  <Label>
                    {item.role} · {item.company} · {item.relationship}
                  </Label>
                </div>
              </footer>
            </blockquote>
          )
        })}
      </div>

      {enhanced && quotes.length > 1 ? (
        <div role="tablist" aria-label="Recommendations" className="mt-6 flex gap-1.5">
          {quotes.map((item, position) => (
            <button
              key={`${item.name}-${position}`}
              ref={(node) => {
                tabs.current[position] = node
              }}
              id={`${id}-tab-${position}`}
              type="button"
              role="tab"
              aria-label={`Recommendation ${position + 1} of ${quotes.length}, from ${item.name}`}
              aria-selected={position === index}
              aria-controls={`${id}-panel-${position}`}
              tabIndex={position === index ? 0 : -1}
              onClick={() => select(position)}
              onKeyDown={onKeyDown}
              // A 22×4 bar is the design; the padding makes the target at least 24px tall.
              className="group cursor-pointer py-2.5"
            >
              <span
                className={cn(
                  'block h-1 w-[22px] transition-colors motion-reduce:transition-none',
                  position === index ? 'bg-accent' : 'bg-line group-hover:bg-muted'
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
