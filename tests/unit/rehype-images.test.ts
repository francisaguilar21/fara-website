// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { readImageSize, rehypeImages } from '@/lib/content/rehype-images'

type Node = {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: Node[]
}

const img = (src: string): Node => ({
  type: 'element',
  tagName: 'img',
  properties: { src, alt: 'x' },
})
const p = (...children: Node[]): Node => ({
  type: 'element',
  tagName: 'p',
  properties: {},
  children,
})
const text = (value: string): Node => ({ type: 'text', value })
const root = (...children: Node[]): Node => ({ type: 'root', children })

const BANNER = '/static/images/2401/2401-08-banner.webp'

describe('readImageSize', () => {
  it('reads the intrinsic size of an image in public/', async () => {
    expect(await readImageSize(BANNER)).toEqual({ width: 1500, height: 500 })
  })

  it('fails loudly for a missing file, naming it', async () => {
    await expect(readImageSize('/static/images/nope.webp')).rejects.toThrow(
      'Image not found: public/static/images/nope.webp'
    )
  })
})

describe('rehypeImages', () => {
  it('sets width and height on local images', async () => {
    const image = img(BANNER)
    await rehypeImages()(root(p(text('Hi'), image)))
    expect(image.properties).toMatchObject({ width: 1500, height: 500 })
  })

  it('unwraps an image that is alone in its paragraph, and leaves mixed paragraphs alone', async () => {
    const alone = img(BANNER)
    const inText = img('/static/images/2401/2401-08-posthog-image.webp')
    const tree = root(p(alone), p(text('See '), inText))
    await rehypeImages()(tree)
    expect(tree.children?.[0]).toBe(alone)
    expect(tree.children?.[1]?.tagName).toBe('p')
  })

  it('marks only an image that opens the document as priority', async () => {
    const first = img(BANNER)
    const later = img('/static/images/2401/2401-08-posthog-image.webp')
    await rehypeImages()(root(p(first), p(text('Text')), p(later)))
    expect(first.properties?.priority).toBe(true)
    expect(later.properties?.priority).toBeUndefined()

    const afterText = img(BANNER)
    await rehypeImages()(root(p(text('Text')), p(afterText)))
    expect(afterText.properties?.priority).toBeUndefined()
  })

  it('skips remote images and fails the build on a missing local one', async () => {
    const remote = img('https://example.com/a.png')
    await rehypeImages()(root(p(remote)))
    expect(remote.properties).not.toHaveProperty('width')
    await expect(rehypeImages()(root(p(img('/static/images/missing.webp'))))).rejects.toThrow(
      'Image not found'
    )
  })
})
