import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// The 2024 post URLs must keep working (P4-R4).
const POSTS = [
  { slug: '231221-hello-world', title: 'Hello World! 👋', images: 3 },
  {
    slug: '240108-posthog-over-google-analytics',
    title: 'Why I chose PostHog over Google Analytics',
    images: 3,
  },
  {
    slug: '240112-a-commitment-to-change',
    title: 'A Commitment to a Better Self: A Year of Change',
    images: 2,
  },
]

for (const { slug, title, images } of POSTS) {
  test(`/blog/${slug} returns 200 and renders the post`, async ({ page }) => {
    const response = await page.goto(`/blog/${slug}`)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
    await expect(page.getByRole('link', { name: 'All posts' })).toHaveAttribute('href', '/blog')

    // Each image carries its intrinsic size, so the page doesn't shift as they load (P4-R6).
    const pictures = page.locator('.prose img')
    await expect(pictures).toHaveCount(images)
    for (const img of await pictures.all()) {
      await expect(img).toHaveAttribute('width', /^\d+$/)
      await expect(img).toHaveAttribute('height', /^\d+$/)
    }
  })

  test(`/blog/${slug} has no axe violations`, async ({ page }) => {
    await page.goto(`/blog/${slug}`)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })
}

test('a post page reserves space for images: no layout shift while scrolling through it', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __cls: number }
    w.__cls = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as unknown as {
        value: number
        hadRecentInput: boolean
      }[]) {
        if (!entry.hadRecentInput) w.__cls += entry.value
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })
  await page.goto('/blog/240108-posthog-over-google-analytics')
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 400) {
    await page.evaluate((top) => window.scrollTo(0, top), y)
    await page.waitForTimeout(100)
  }
  await page.waitForFunction(() => [...document.images].every((img) => img.complete))
  expect(await page.evaluate(() => (window as unknown as { __cls: number }).__cls)).toBeLessThan(
    0.05
  )
})

test('/blog lists the published posts, newest first, without the template', async ({ page }) => {
  const response = await page.goto('/blog')
  expect(response?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1, name: 'Writing' })).toBeVisible()
  await expect(page.locator('main article h2')).toHaveText([
    'A Commitment to a Better Self: A Year of Change',
    'Why I chose PostHog over Google Analytics',
    'Hello World! 👋',
  ])
  await expect(page.getByText('Blog Template')).toHaveCount(0)
})

test('/blog and /blog/tags/[tag] have no axe violations', async ({ page }) => {
  for (const path of ['/blog', '/blog/tags/fitness']) {
    await page.goto(path)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze()
    expect(results.violations, path).toEqual([])
  }
})

test('/blog/tags/[tag] filters by tag, and unknown tags are 404', async ({ page }) => {
  const response = await page.goto('/blog/tags/fitness')
  expect(response?.status()).toBe(200)
  await expect(page.locator('main article h2')).toHaveText([
    'A Commitment to a Better Self: A Year of Change',
    'Hello World! 👋',
  ])
  expect((await page.goto('/blog/tags/not-a-tag'))?.status()).toBe(404)
  expect((await page.goto('/blog/not-a-post'))?.status()).toBe(404)
})

test('tag links on a post point at the lowercase, hyphenated tag page', async ({ page }) => {
  await page.goto('/blog/240108-posthog-over-google-analytics')
  await expect(page.getByRole('link', { name: 'analytics' })).toHaveAttribute(
    'href',
    '/blog/tags/analytics'
  )
})

test('post pages link to the previous and next posts', async ({ page }) => {
  await page.goto('/blog/240108-posthog-over-google-analytics')
  const nav = page.getByRole('navigation', { name: 'More posts' })
  await expect(nav.getByRole('link', { name: /Hello World/ })).toHaveAttribute(
    'href',
    '/blog/231221-hello-world'
  )
  await expect(nav.getByRole('link', { name: /A Commitment to a Better Self/ })).toHaveAttribute(
    'href',
    '/blog/240112-a-commitment-to-change'
  )
})

test('external links in a post open in a new tab with rel=noopener', async ({ page }) => {
  await page.goto('/blog/240108-posthog-over-google-analytics')
  const link = page.locator('.prose a', { hasText: 'Measurement Protocol' })
  await expect(link).toHaveAttribute('target', '_blank')
  await expect(link).toHaveAttribute('rel', /noopener/)
})

test.describe('code blocks', () => {
  test('are highlighted at build time and follow the site theme', async ({ page }) => {
    await page.goto('/blog/240108-posthog-over-google-analytics')
    const block = page.locator('pre[data-language="javascript"]').first()
    await expect(block).toBeVisible()
    const keyword = block.locator('span', { hasText: /^import$/ }).first()

    const color = () => keyword.evaluate((el) => getComputedStyle(el).color)
    const dark = await color()
    await page.evaluate(() => localStorage.setItem('theme', 'light'))
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    const light = await color()

    // Highlighted (not the plain text color), and different in each theme.
    expect(dark).not.toBe('rgb(245, 242, 243)')
    expect(light).not.toBe('rgb(20, 17, 18)')
    expect(dark).not.toBe(light)
  })

  test('highlight the javascript and http fences', async ({ page }) => {
    await page.goto('/blog/240108-posthog-over-google-analytics')
    await expect(page.locator('pre[data-language="http"]')).toHaveCount(1)
    await expect(page.locator('pre[data-language="javascript"]')).toHaveCount(3)
  })
})

test('post metadata: title template, description and canonical URL', async ({ page }) => {
  await page.goto('/blog/231221-hello-world')
  await expect(page).toHaveTitle('Hello World! 👋 · Francis Aguilar')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'A quick intro on why I created my own website and decided to blog.'
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://francisaguilar.co/blog/231221-hello-world'
  )
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article')
})
