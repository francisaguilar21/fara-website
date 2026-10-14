import { expect, test } from '@playwright/test'

// P4-AC4: each old URL returns 308 to its new home, in one hop. Playwright follows redirects by
// default for `request`, so turn that off to see the redirect itself. The first five are the 2024
// site's; the `/blog` ones are the blog's move to `/writings` (decision D5).
const REDIRECTS = [
  ['/tags/technology', '/writings/tags/technology'],
  ['/tags', '/writings'],
  ['/blog/page/2', '/writings'],
  ['/about', '/'],
  ['/feed.xml', '/rss.xml'],
  ['/blog', '/writings'],
  ['/blog/tags/fitness', '/writings/tags/fitness'],
  ['/blog/231221-hello-world', '/writings/231221-hello-world'],
  ['/blog/240108-posthog-over-google-analytics', '/writings/240108-posthog-over-google-analytics'],
  ['/blog/240112-a-commitment-to-change', '/writings/240112-a-commitment-to-change'],
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
    expect(xml).toContain(`<link>https://francisaguilar.co/writings/${slug}</link>`)
  }
})

test('/sitemap.xml lists the blog routes and /robots.txt points at it', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const path of ['/writings', '/writings/231221-hello-world', '/writings/tags/fitness']) {
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
  await page.goto('/writings/231221-hello-world')
  await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute(
    'href',
    'https://francisaguilar.co/rss.xml'
  )

  const og = await page.locator('meta[property="og:image"]').getAttribute('content')
  expect(og).toMatch(/^https:\/\/francisaguilar\.co\/writings\/231221-hello-world\/opengraph-image/)
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200')
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630')

  const image = await request.get(new URL(og!).pathname)
  expect(image.status()).toBe(200)
  expect(image.headers()['content-type']).toBe('image/png')
})

test('OG images are 1200x630 PNGs under 100 kB (P4-R11)', async ({ page, request }) => {
  const paths: string[] = []
  for (const url of ['/', '/writings', '/writings/240108-posthog-over-google-analytics']) {
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

test('the old /blog URLs end up on a page that returns 200', async ({ request }) => {
  for (const [from, to] of [
    ['/blog', '/writings'],
    ['/blog/231221-hello-world', '/writings/231221-hello-world'],
    ['/blog/tags/fitness', '/writings/tags/fitness'],
  ] as const) {
    const response = await request.get(from)
    expect(response.status(), from).toBe(200)
    expect(new URL(response.url()).pathname, from).toBe(to)
  }
  // An old URL for a post that doesn't exist redirects, then is a 404.
  expect((await request.get('/blog/not-a-post')).status()).toBe(404)
})

test('every writings page has its own OG image under /writings, so it stays public during maintenance', async ({
  page,
  request,
}) => {
  // `MAINTENANCE_ALLOWED_PATHS=/writings,/rss.xml` matches by prefix, but the site default image at
  // /opengraph-image would be a 503 there.
  for (const url of ['/writings', '/writings/tags/fitness', '/writings/231221-hello-world']) {
    await page.goto(url)
    const og = await page.locator('meta[property="og:image"]').getAttribute('content')
    const path = new URL(og!).pathname
    expect(path, url).toMatch(/^\/writings\/.*opengraph-image/)
    expect((await request.get(path)).status(), path).toBe(200)
  }
})
