import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getImageMetadata } from 'velite'

// Build-time image handling for MDX, used by `velite.config.ts` only.
//
// Post images keep their `/static/images/...` paths (P4-R6). Their size is read from `public/` while
// the content is built and written onto the `<img>`, so `<Figure />` can reserve the space before the
// image loads and the page doesn't shift.

type HastNode = {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

/** True for a path served from `public/`, as opposed to `https://...` or a relative path. */
const isPublicPath = (src: unknown): src is string =>
  typeof src === 'string' && src.startsWith('/') && !src.startsWith('//')

/** Intrinsic size of an image in `public/`. Throws if the file is missing or isn't an image. */
export async function readImageSize(src: string): Promise<{ width: number; height: number }> {
  let buffer: Buffer
  try {
    buffer = await readFile(join(process.cwd(), 'public', src))
  } catch {
    throw new Error(`Image not found: public${src}`)
  }
  const metadata = await getImageMetadata(buffer)
  if (!metadata) throw new Error(`Could not read the size of public${src}`)
  return { width: metadata.width, height: metadata.height }
}

const isBlank = (node: HastNode) => node.type === 'text' && !node.value?.trim()

/**
 * rehype plugin that, for every local `<img>`:
 *
 * - sets `width` and `height` from the file;
 * - unwraps it from a paragraph that holds nothing else, because `<Figure />` renders a
 *   `<figure>` and that can't be inside a `<p>`;
 * - marks it `priority` when it is the first thing in the document, as it is the likely LCP.
 */
export function rehypeImages() {
  return async (tree: HastNode) => {
    const sizes: Promise<void>[] = []

    const visit = (node: HastNode) => {
      if (node.type === 'element' && node.tagName === 'img' && isPublicPath(node.properties?.src)) {
        const properties = node.properties!
        sizes.push(
          readImageSize(properties.src as string).then(({ width, height }) => {
            properties.width = width
            properties.height = height
          })
        )
      }
      node.children?.forEach(visit)
    }
    visit(tree)

    const unwrap = (node: HastNode) => {
      if (!node.children) return
      node.children = node.children.map((child) => {
        if (child.type === 'element' && child.tagName === 'p') {
          const content = child.children?.filter((c) => !isBlank(c)) ?? []
          const only = content.length === 1 ? content[0] : undefined
          if (only?.type === 'element' && only.tagName === 'img') return only
        }
        return child
      })
      node.children.forEach(unwrap)
    }
    unwrap(tree)

    const first = tree.children?.find((child) => !isBlank(child))
    if (first?.type === 'element' && first.tagName === 'img' && first.properties) {
      first.properties.priority = true
    }

    await Promise.all(sizes)
  }
}
