import { expect, test } from '@playwright/test'

test.describe('hero and now strip', () => {
  test('the hero shows the label row, three roles and both calls to action', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Manila, PH · 14.60°N 120.98°E')).toBeVisible()
    for (const path of ['/work', '/build', '/run']) {
      await expect(page.locator('main ul li', { hasText: path }).first()).toBeVisible()
    }
    await expect(page.getByRole('link', { name: /See my work/ })).toHaveAttribute('href', '#work')
    await expect(page.getByRole('link', { name: 'Book a call' })).toBeVisible()
  })

  test('the header links to the sections on the homepage', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Primary' })
    for (const id of ['work', 'life', 'writing', 'now']) {
      await expect(nav.getByRole('link', { name: new RegExp(`${id}$`) })).toHaveAttribute(
        'href',
        `#${id}`
      )
    }
    await expect(page.getByRole('link', { name: "Let's talk" }).first()).toHaveAttribute(
      'href',
      '#contact'
    )
  })

  test('the portrait is grayscale and turns to color on hover', async ({ page }) => {
    await page.goto('/')
    const photo = page.getByRole('img', { name: /Francis Aguilar smiling/ })
    await expect(photo).toHaveCSS('filter', /grayscale\(1\)/)
    await photo.hover()
    await expect(photo).toHaveCSS('filter', /grayscale\(0\)/, { timeout: 2000 })
  })

  test('the portrait drifts as the page scrolls', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)
    const photo = page.getByRole('img', { name: /Francis Aguilar smiling/ }).locator('xpath=..')
    const before = await photo.evaluate((el) => (el as HTMLElement).style.transform)
    await page.mouse.wheel(0, 300)
    await expect
      .poll(() => photo.evaluate((el) => (el as HTMLElement).style.transform))
      .not.toBe(before)
  })

  test('the strip repeats its items and only the first copy is exposed to assistive tech', async ({
    page,
  }) => {
    await page.goto('/')
    const strip = page.getByRole('region', { name: "What I'm doing now" })
    await expect(strip.getByRole('listitem')).toHaveCount(5)
    await expect(strip.locator('ul[aria-hidden="true"]')).not.toHaveCount(0)
    // It moves, and stops while hovered.
    const track = strip.locator('> div')
    const animation = () => track.evaluate((el) => getComputedStyle(el).animationPlayState)
    await expect.poll(animation).toBe('running')
    await strip.hover()
    await expect.poll(animation).toBe('paused')
  })

  test('the strip shows draft and sample chips', async ({ page }) => {
    await page.goto('/')
    const strip = page.getByRole('region', { name: "What I'm doing now" })
    await expect(strip.getByRole('listitem').getByText('sample')).toHaveCount(2)
    await expect(strip.getByRole('listitem').getByText('draft').first()).toBeVisible()
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the strip stops and becomes a static row, with no repeated copies', async ({ page }) => {
    await page.goto('/')
    const strip = page.getByRole('region', { name: "What I'm doing now" })
    await expect(strip.locator('> div')).toHaveCSS('animation-name', 'none')
    await expect(strip.locator('ul[aria-hidden="true"]').first()).toBeHidden()
    await expect(strip.getByRole('listitem')).toHaveCount(5)
  })

  test('the headline is in place with its underline drawn', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1 .headline-under').first()).toBeVisible()
    await expect(page.locator('h1 > span').first()).toHaveCSS('animation-name', 'none')
  })
})

test.describe('JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false })

  test('the hero and strip are fully readable', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'I build software & run long distances.'
    )
    const strip = page.getByRole('region', { name: "What I'm doing now" })
    await expect(strip.getByRole('listitem')).toHaveCount(5)
    await expect(strip.getByText('LISTENING').first()).toBeVisible()
  })
})

test('no horizontal page scroll at 360px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  await page.goto('/')
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  )
  expect(overflow).toBeLessThanOrEqual(0)
})
