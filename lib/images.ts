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
