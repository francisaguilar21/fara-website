'use client'

import { useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { useRef } from 'react'
import { useMotionEnabled } from '@/lib/motion'
import { useWriteTransform } from '@/lib/use-write-transform'
import portrait from '@/public/static/images/fara-dp.webp'

/**
 * The hero portrait: grayscale that turns to color on hover, a rose slash across it, and a gentle
 * parallax. The photo is 12% taller than its frame so it can drift without showing an edge.
 */
export function HeroPortrait() {
  const enabled = useMotionEnabled()
  const frame = useRef<HTMLDivElement>(null)
  const photo = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: frame, offset: ['start end', 'end start'] })
  // 5% of the photo is 5.6% of the frame, which stays inside the 6% of spare height per side.
  const transform = useTransform(scrollYProgress, [0, 1], ['translateY(5%)', 'translateY(-5%)'])
  useWriteTransform(photo, transform, enabled)

  return (
    <div ref={frame} className="group relative aspect-[4/5] max-w-full overflow-hidden bg-surface">
      <div ref={photo} className="absolute inset-x-0 top-[-6%] h-[112%] will-change-transform">
        <Image
          src={portrait}
          alt="Francis Aguilar smiling, in a black blazer and a red shirt"
          fill
          sizes="(min-width: 761px) 320px, 220px"
          preload
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
