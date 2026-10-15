import Image from 'next/image'

type FigureProps = React.ComponentProps<'img'> & { priority?: boolean }

/**
 * MDX `img`. The build writes the intrinsic `width` and `height` onto it (see
 * `lib/content/rehype-images.ts`), so the browser reserves the space and nothing shifts when the
 * image loads (P4-R6). A markdown title (`![alt](src "caption")`) becomes the caption.
 */
export function Figure({ src, alt = '', width, height, title, priority }: FigureProps) {
  if (typeof src !== 'string') return null

  const image =
    width && height ? (
      <Image
        src={src}
        alt={alt}
        width={Number(width)}
        height={Number(height)}
        priority={priority}
        sizes="(min-width: 768px) 720px, 100vw"
        className="h-auto w-full border border-line"
      />
    ) : (
      // Remote images have no size at build time: fall back to a plain <img>.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} loading="lazy" className="h-auto w-full border border-line" />
    )

  return (
    <figure className="my-8">
      {image}
      {title ? (
        <figcaption className="mt-3 text-center text-sm text-muted">{title}</figcaption>
      ) : null}
    </figure>
  )
}
