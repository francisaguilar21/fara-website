import Image from 'next/image'
import { Parallax } from '@/components/motion/Parallax'
import portrait from '@/public/static/images/fara-dp.webp'

/**
 * The hero portrait: grayscale that turns to color on hover, a rose slash across it, and a gentle
 * parallax. The photo is 12% taller than its frame so it can drift without showing an edge.
 */
export function HeroPortrait() {
  return (
    <div className="group relative aspect-[4/5] max-w-full overflow-hidden bg-surface">
      {/* 14px of drift stays inside the 6% of spare height per side (16px at the smallest size). */}
      <Parallax
        offset={14}
        className="absolute inset-0"
        innerClassName="absolute inset-x-0 top-[-6%] h-[112%]"
      >
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
      </Parallax>
      {/* The slash: the one recurring motif, here at its 17° angle. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[10%] right-[18%] -bottom-[10%] w-2.5 -skew-x-[17deg] bg-accent"
      />
    </div>
  )
}
