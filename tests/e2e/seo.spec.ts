import { expect, test } from '@playwright/test'

// P4-AC4: each 2024 URL returns 308 to its new home. Playwright follows redirects by default for
// `request`, so turn that off to see the redirect itself.
const REDIRECTS = [
  ['/tags/technology', '/blog/tags/technology'],
  ['/tags', '/blog'],
  ['/blog/page/2', '/blog'],
  ['/about', '/'],
  ['/feed.xml', '/rss.xml'],
] as const

for (const [from, to] of REDIRECTS) {
  test(`${from} redirects permanently to ${to}`, async ({ request }) => {
    const response = await request.get(from, { maxRedirects: 0 })
    expect(response.status()).toBe(308)
    expect(new URL(response.headers().location!, 'http://localhost').pathname).toBe(to)
  })
}

test('/rss.xml is served as an RSS 2.0 feed with every published post', async ({ request }) => {
  const response = await request.get('/rss.xml')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/rss+xml')
  const xml = await response.text()
  expect(xml).toContain('<rss version="2.0"')
  expect(xml.match(/<item>/g)).toHaveLength(3)
  for (const slug of [
    '231221-hello-world',
    '240108-posthog-over-google-analytics',
    '240112-a-commitment-to-change',
  ]) {
    expect(xml).toContain(`<link>https://francisaguilar.co/blog/${slug}</link>`)
  }
})

test('/sitemap.xml lists the blog routes and /robots.txt points at it', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const path of ['/blog', '/blog/231221-hello-world', '/blog/tags/fitness']) {
    expect(sitemap).toContain(`<loc>https://francisaguilar.co${path}</loc>`)
  }
  expect(sitemap).toContain('<lastmod>')

  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toMatch(/User-Agent: \*\s+Allow: \//i)
  expect(robots).toContain('Sitemap: https://francisaguilar.co/sitemap.xml')
})

test('the head links to the feed and the post has a canonical and a generated OG image', async ({
  page,
  request,
}) => {
  await page.goto('/blog/231221-hello-world')
  await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute(
    'href',
    'https://francisaguilar.co/rss.xml'
  )

  const og = await page.locator('meta[property="og:image"]').getAttribute('content')
  expect(og).toMatch(/^https:\/\/francisaguilar\.co\/blog\/231221-hello-world\/opengraph-image/)
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200')
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630')

  const image = await request.get(new URL(og!).pathname)
  expect(image.status()).toBe(200)
  expect(image.headers()['content-type']).toBe('image/png')
})

test('OG images are 1200x630 PNGs under 100 kB (P4-R11)', async ({ page, request }) => {
  const paths: string[] = []
  for (const url of ['/', '/blog', '/blog/240108-posthog-over-google-analytics']) {
    await page.goto(url)
    const og = await page.locator('meta[property="og:image"]').getAttribute('content')
    paths.push(new URL(og!).pathname)
  }
  // The site default, the blog index (also used by tag pages) and one per post.
  expect(new Set(paths).size).toBe(3)

  for (const path of paths) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    const body = await response.body()
    expect(body.length, path).toBeLessThan(100_000)
    // PNG header: 8-byte signature, then IHDR with width and height as big-endian uint32.
    expect(body.subarray(1, 4).toString(), path).toBe('PNG')
    expect([body.readUInt32BE(16), body.readUInt32BE(20)], path).toEqual([1200, 630])
  }
})

test('every blog page has its own OG image under /blog, so it stays public during maintenance', async ({
  page,
  request,
}) => {
  // `MAINTENANCE_ALLOWED_PATHS=/blog,/rss.xml` matches by prefix, but the site default image at
  // /opengraph-image would be a 503 there.
  for (const url of ['/blog', '/blog/tags/fitness', '/blog/231221-hello-world']) {
    await page.goto(url)
    const og = await page.locator('meta[property="og:image"]').getAttribute('content')
    const path = new URL(og!).pathname
    expect(path, url).toMatch(/^\/blog\/.*opengraph-image/)
    expect((await request.get(path)).status(), path).toBe(200)
  }
})
