import { readFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const cache = new Map<string, Promise<string>>()

/**
 * A tiny blurred copy of an image from `public/`, as a data URL, for `next/image`'s
 * `placeholder="blur"`. Images imported statically get one automatically; images named by a path
 * in the content files (gallery, project covers) do not, so it is made here. Server only: it reads
 * the file, and runs once per image at build time.
 *
 * @param src a path under `public/`, for example `/static/images/gallery/road.webp`
 */
export function getBlurDataURL(src: string): Promise<string> {
  let blur = cache.get(src)
  if (!blur) {
    blur = readFile(path.join(process.cwd(), 'public', src))
      .then((file) => sharp(file).resize(16).webp({ quality: 40 }).toBuffer())
      .then((buffer) => `data:image/webp;base64,${buffer.toString('base64')}`)
    cache.set(src, blur)
  }
  return blur
}

const sizes = new Map<string, Promise<{ width: number; height: number }>>()

/**
 * Intrinsic size of an image in `public/`, read once at build time. Masonry needs it to reserve
 * each photo's box before the image loads. Server only.
 *
 * @param src a path under `public/`, for example `/static/images/gallery/road.webp`
 */
export function getImageSize(src: string): Promise<{ width: number; height: number }> {
  let size = sizes.get(src)
  if (!size) {
    size = readFile(path.join(process.cwd(), 'public', src))
      .then((file) => sharp(file).metadata())
      .then(({ width, height }) => {
        if (!width || !height) throw new Error(`Could not read the size of public${src}`)
        return { width, height }
      })
    sizes.set(src, size)
  }
  return size
}
