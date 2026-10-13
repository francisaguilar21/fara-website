import Image from 'next/image'
import { Parallax } from '@/components/motion/Parallax'
import { DraftChip } from '@/components/ui/DraftChip'
import { cn } from '@/lib/cn'
import type { GalleryImage } from '@/lib/content'
import { getBlurDataURL } from '@/lib/images'

// Where each photo sits in the 4-column grid on desktop: the first and fourth are tall, the fifth
// is wide. `sizes` follows from that (column fractions of the 1240px container).
const SLOTS = [
  { span: 'min-[761px]:row-span-2', sizes: '(min-width: 761px) 30vw, 50vw' },
  { span: '', sizes: '(min-width: 761px) 25vw, 50vw' },
  { span: '', sizes: '(min-width: 761px) 25vw, 50vw' },
  { span: 'min-[761px]:row-span-2', sizes: '(min-width: 761px) 30vw, 50vw' },
  { span: 'col-span-2', sizes: '(min-width: 761px) 50vw, 100vw' },
]

/** Tile 3: five photos with captions and a slow parallax, edge to edge in the grid. */
export async function GalleryStrip({ images }: { images: GalleryImage[] }) {
  const shown = images.slice(0, SLOTS.length)
  const blurs = await Promise.all(shown.map((image) => getBlurDataURL(image.src)))

  return (
    <div className="col-span-12 grid auto-rows-[160px] grid-cols-2 gap-3 min-[761px]:h-[clamp(320px,42vw,520px)] min-[761px]:auto-rows-auto min-[761px]:grid-cols-[1.2fr_1fr_1fr_1.2fr] min-[761px]:grid-rows-2">
      {shown.map((image, index) => {
        const slot = SLOTS[index]!
        return (
          <figure
            key={image.src}
            className={cn('group relative m-0 min-w-0 overflow-hidden bg-surface', slot.span)}
          >
            <Parallax
              offset={18}
              className="absolute inset-0"
              innerClassName="absolute inset-x-0 -top-[12.5%] h-[125%]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={slot.sizes}
                placeholder="blur"
                blurDataURL={blurs[index]}
                className="object-cover saturate-[.85] transition-[filter] duration-500 group-hover:saturate-[1.1]"
              />
            </Parallax>
            {image.caption ? (
              <figcaption className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-bg px-2 py-1.5 font-mono text-[0.6875rem] leading-none font-medium tracking-[0.06em] uppercase">
                {image.caption}
                {image.draft ? <DraftChip /> : null}
              </figcaption>
            ) : null}
          </figure>
        )
      })}
    </div>
  )
}
