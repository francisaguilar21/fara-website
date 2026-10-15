'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useMotionEnabled } from '@/lib/motion'
import { useScrollProgress } from '@/lib/use-scroll-progress'
import portrait from '@/public/static/images/fara-dp.webp'

/**
 * The hero portrait: grayscale that turns to color on hover, a rose slash across it, and a gentle
 * parallax. The photo is 12% taller than its frame so it can drift without showing an edge.
 */
export function HeroPortrait() {
  const enabled = useMotionEnabled()
  const frame = useRef<HTMLDivElement>(null)
  const photo = useRef<HTMLDivElement>(null)

  // From 5% down to 5% up as the frame crosses the screen. 5% of the photo is 5.6% of the frame,
  // which stays inside the 6% of spare height per side.
  useScrollProgress(
    frame,
    { startAt: 1, endAt: 0 },
    (progress) => {
      if (photo.current) photo.current.style.transform = `translateY(${5 - 10 * progress}%)`
    },
    enabled
  )
  useEffect(() => {
    const element = photo.current
    return () => {
      if (element) element.style.transform = ''
    }
  }, [enabled])

  return (
    <div ref={frame} className="group relative aspect-[4/5] max-w-full overflow-hidden bg-surface">
      <div ref={photo} className="absolute inset-x-0 top-[-6%] h-[112%] will-change-transform">
        <Image
          src={portrait}
          alt="Francis Aguilar smiling, in a black blazer and a red shirt"
          fill
          sizes="(min-width: 761px) 320px, 220px"
          preload
          // The portrait is the largest thing above the fold, so it must not queue behind the fonts
          // and scripts for bandwidth (images are low priority by default).
          fetchPriority="high"
          placeholder="blur"
          className="object-cover object-[50%_20%] contrast-[1.05] grayscale transition-[filter] duration-[600ms] ease-out-quint group-hover:grayscale-0"
        />
      </div>
      {/* The slash: the one recurring motif, here at its 17° angle. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[10%] right-[18%] -bottom-[10%] w-2.5 -skew-x-[17deg] bg-accent"
      />
    </div>
  )
}
