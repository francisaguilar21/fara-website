'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { DraftChip } from '@/components/ui/DraftChip'
import { cn } from '@/lib/cn'
import type { GalleryImage } from '@/lib/content'
import {
  filterGallery,
  galleryTags,
  nextIndex,
  previousIndex,
  type GalleryTag,
} from '@/lib/life/gallery'
import { Lightbox } from './Lightbox'

/** A gallery image with what the page measured for it at build time. */
export type GalleryPhoto = GalleryImage & {
  width: number
  height: number
  blurDataURL: string
}

const TAG_LABELS: Record<GalleryTag, string> = {
  race: 'Races',
  travel: 'Travel',
  event: 'Events',
  life: 'Life',
}

/**
 * The photo gallery (P6-R12): filter chips by tag, a masonry grid in CSS columns (each photo keeps
 * its own shape, and its box is reserved up front), blur placeholders, lazy loading, and the
 * lightbox. A thumbnail is a button, so Enter and Space open it as well as a click.
 */
export function MasonryGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [tag, setTag] = useState<GalleryTag | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const thumbnails = useRef(new Map<string, HTMLButtonElement>())
  // The photo that opened the lightbox, so focus can go back to it when the lightbox closes.
  const opener = useRef<string | null>(null)

  const tags = galleryTags(photos)
  const shown = filterGallery(photos, tag)

  const close = () => {
    setOpen(null)
    // Focus goes back to the thumbnail that opened it, even after the arrows moved to other photos.
    const src = opener.current
    if (src) requestAnimationFrame(() => thumbnails.current.get(src)?.focus())
  }

  return (
    <div>
      {tags.length > 1 ? (
        <ul aria-label="Filter by tag" className="mb-8 flex flex-wrap gap-2">
          {[null, ...tags].map((value) => {
            const pressed = value === tag
            return (
              <li key={value ?? 'all'}>
                <button
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setTag(value)}
                  className={cn(
                    'cursor-pointer rounded-full border px-3 py-2 font-mono text-xs leading-none transition-colors motion-reduce:transition-none',
                    pressed
                      ? 'border-accent bg-accent text-accent-ink'
                      : 'border-line text-muted hover:border-accent hover:text-accent'
                  )}
                >
                  {value ? TAG_LABELS[value] : 'All'}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}

      <ul className="columns-1 gap-4 min-[560px]:columns-2 min-[960px]:columns-3">
        {shown.map((photo, index) => (
          <li key={photo.src} className="mb-4 break-inside-avoid">
            <button
              type="button"
              ref={(node) => {
                if (node) thumbnails.current.set(photo.src, node)
                else thumbnails.current.delete(photo.src)
              }}
              onClick={() => {
                opener.current = photo.src
                setOpen(index)
              }}
              aria-haspopup="dialog"
              data-cursor="View"
              className="group relative block w-full cursor-pointer overflow-hidden bg-surface"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 960px) 33vw, (min-width: 560px) 50vw, 100vw"
                placeholder="blur"
                blurDataURL={photo.blurDataURL}
                className="h-auto w-full saturate-[.85] transition-[filter] duration-500 group-hover:saturate-[1.1] motion-reduce:transition-none"
              />
              {photo.caption ? (
                <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-bg px-2 py-1.5 font-mono text-[0.6875rem] leading-none font-medium tracking-[0.06em] uppercase">
                  {photo.caption}
                  {photo.draft ? <DraftChip /> : null}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        photos={shown}
        index={open}
        onStep={(direction) =>
          setOpen((current) =>
            current === null
              ? null
              : direction === 'next'
                ? nextIndex(current, shown.length)
                : previousIndex(current, shown.length)
          )
        }
        onClose={close}
      />
    </div>
  )
}
