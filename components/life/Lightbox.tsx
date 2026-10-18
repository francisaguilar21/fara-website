'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useEffectEvent, useRef } from 'react'
import { DraftChip } from '@/components/ui/DraftChip'
import { swipeDirection } from '@/lib/life/gallery'
import type { GalleryPhoto } from './MasonryGallery'

type LightboxProps = {
  photos: GalleryPhoto[]
  /** Index of the photo shown, or `null` while closed. */
  index: number | null
  /** Step to the next or previous photo. The parent applies it to its latest state, so quick key presses never use a stale index. */
  onStep: (direction: 'next' | 'previous') => void
  onClose: () => void
}

const button =
  'inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-black/60 text-white transition-colors hover:border-accent hover:text-accent'

/**
 * A photo at full size in a modal `<dialog>` (P6-R12). The browser makes everything behind it inert
 * and closes it on Esc; on top of that the arrow keys and a swipe on touch move between photos,
 * Tab cycles through the three buttons, and closing hands focus back to the thumbnail that opened it.
 */
export function Lightbox({ photos, index, onStep, onClose }: LightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const swipeStart = useRef<number | null>(null)
  const photo = index === null ? undefined : photos[index]
  const open = photo !== undefined

  // Open and close the native dialog with the state, and keep the page behind from scrolling.
  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()

    if (!open) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [open])

  const go = onStep

  // Keys are heard on the window while open, so they work wherever focus happens to be.
  const handleKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go('next')
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go('previous')
    } else if (event.key === 'Tab') {
      // Wrap around at either end, and pull focus back in if it is somewhere outside.
      const focusable = [...(dialog.current?.querySelectorAll<HTMLElement>('button') ?? [])]
      const first = focusable[0]
      const last = focusable.at(-1)
      const active = document.activeElement
      if (!active || !dialog.current?.contains(active)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first)?.focus()
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first?.focus()
      }
    }
  })

  useEffect(() => {
    if (!open) return
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  return (
    <dialog
      ref={dialog}
      aria-label={photo ? `Photo ${index! + 1} of ${photos.length}` : 'Photo viewer'}
      // `close` fires for Esc and for `close()`, so state follows both.
      onClose={onClose}
      data-lenis-prevent
      className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none bg-transparent p-0 text-white backdrop:bg-black/90"
    >
      {/* The listeners are on a wrapper: keys from the buttons bubble up to it, and a click on the
          dark area around the photo (the wrapper itself) closes the viewer. */}
      <div
        role="presentation"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
        className="flex h-full w-full items-center justify-center"
      >
        {photo ? (
          <figure
            className="relative m-0 flex max-h-full w-full max-w-[min(1400px,100%)] touch-pan-y flex-col items-center gap-4 px-4 py-20"
            onPointerDown={(event) => {
              swipeStart.current = event.clientX
            }}
            onPointerUp={(event) => {
              if (swipeStart.current === null) return
              const direction = swipeDirection(event.clientX - swipeStart.current)
              swipeStart.current = null
              if (direction) go(direction)
            }}
            onPointerCancel={() => {
              swipeStart.current = null
            }}
          >
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="100vw"
              placeholder="blur"
              blurDataURL={photo.blurDataURL}
              draggable={false}
              className="max-h-[70dvh] w-auto max-w-full object-contain select-none"
            />
            <figcaption className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center font-mono text-xs tracking-[0.06em] uppercase">
              <span>
                {index! + 1} / {photos.length}
              </span>
              {photo.caption ? <span>{photo.caption}</span> : null}
              {photo.draft ? <DraftChip /> : null}
            </figcaption>
          </figure>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo viewer"
          className={`${button} absolute top-4 right-4`}
        >
          <X aria-hidden="true" className="size-5" />
        </button>
        {photos.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go('previous')}
              aria-label="Previous photo"
              className={`${button} absolute top-1/2 left-4 -translate-y-1/2`}
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go('next')}
              aria-label="Next photo"
              className={`${button} absolute top-1/2 right-4 -translate-y-1/2`}
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </>
        ) : null}
      </div>
    </dialog>
  )
}
