import { expect, test } from '@playwright/test'
import { viewTransitionDone } from './helpers'

test.describe('hero and now strip', () => {
  test('the hero shows the label row, three roles and both calls to action', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Manila, PH · 14.60°N 120.98°E')).toBeVisible()
    for (const path of ['/work', '/build', '/run']) {
      await expect(page.locator('main ul li', { hasText: path }).first()).toBeVisible()
    }
    await expect(page.getByRole('link', { name: /See my work/ })).toHaveAttribute('href', '#work')
    // No booking page is set in this build, so there is no "Book a call": the button points at the
    // contact form instead. (`hidden-drafts.spec.ts` covers the build that has one.)
    await expect(page.getByRole('link', { name: 'Book a call' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Send a message' })).toHaveAttribute(
      'href',
      '#contact'
    )
  })

  test('the header links to the sections that are on the page, and to the pages for the rest', async ({
    page,
  }) => {
    await page.goto('/')
    const links = [
      ...['work', 'life', 'writing', 'now'].map((id) => ({ id, name: new RegExp(`${id}$`) })),
      { id: 'contact', name: /Let's talk/ },
    ]
    for (const { id, name } of links) {
      const link = page.locator('header').getByRole('link', { name }).first()
      const present = (await page.locator(`#${id}`).count()) > 0
      // The header looks at the page once it has rendered, so a link may settle after a moment.
      if (present) await expect(link, id).toHaveAttribute('href', `#${id}`)
      else await expect(link, id).not.toHaveAttribute('href', /^#/)
    }
    // The strip is always there, so at least that link is an anchor.
    await expect(
      page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /now$/ })
    ).toHaveAttribute('href', '#now')
  })

  test('the portrait is grayscale and turns to color on hover', async ({ page }) => {
    await page.goto('/')
    const photo = page.getByRole('img', { name: /Francis Aguilar smiling/ })
    await expect(photo).toHaveCSS('filter', /grayscale\(1\)/)
    // A hover that starts during the page's reveal on load never reaches the photo.
    await viewTransitionDone(page)
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
