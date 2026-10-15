import { expect, test } from '@playwright/test'

test.describe('motion on (mouse, no reduced motion)', () => {
  test('smooth scroll and the custom cursor start once the browser is idle', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/lenis/)
    await expect(page.getByTestId('cursor-dot')).toBeAttached()
    await expect(page.locator('body')).toHaveClass(/has-cursor/)
  })

  test('theme toggle: the wipe plays, the theme switches, and it survives a reload', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    await page.getByRole('button', { name: 'Switch theme' }).click()
    // The theme changes at the midpoint (~450ms), not immediately.
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light', { timeout: 3000 })

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })

  test('the mobile menu opens through the wipe', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 })
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Open menu' })
    await toggle.click()
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible({ timeout: 3000 })
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible()
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('turns off smooth scroll, cursor and the wipe', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(800)
    await expect(page.locator('html')).not.toHaveClass(/lenis/)
    await expect(page.getByTestId('cursor-dot')).toHaveCount(0)
    await expect(page.locator('body')).not.toHaveClass(/has-cursor/)

    // No wipe: the theme changes straight away.
    await page.getByRole('button', { name: 'Switch theme' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light', { timeout: 400 })
    // The panel never moved: it is still parked fully off-screen to the left.
    const box = await page.getByTestId('slash-wipe').boundingBox()
    expect(box && box.x + box.width).toBeLessThan(0)
  })
})

test.describe('touch device (pointer: coarse)', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 800 } })

  test('has no custom cursor', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(800)
    await expect(page.getByTestId('cursor-dot')).toHaveCount(0)
    await expect(page.locator('body')).not.toHaveClass(/has-cursor/)
  })
})

test.describe('components', () => {
  test('Reveal fades in from a visible resting state when scrolled into view', async ({ page }) => {
    await page.goto('/styleguide')
    const item = page.getByText('Three', { exact: true })
    await item.scrollIntoViewIfNeeded()
    // Resting state is never opacity 0 (P3-R10), and it ends fully opaque.
    await expect
      .poll(async () => item.evaluate((el) => Number(getComputedStyle(el.parentElement!).opacity)))
      .toBe(1)
  })

  test('Magnetic pulls its child toward the pointer and lets go on leave', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(800) // let the idle-time setup run
    const cta = page.getByRole('link', { name: "Let's talk" }).first()
    const box = (await cta.boundingBox())!
    await page.mouse.move(box.x + box.width - 2, box.y + box.height / 2)
    const wrapper = cta.locator('xpath=..')
    await expect
      .poll(() => wrapper.evaluate((el) => (el as HTMLElement).style.transform))
      .toContain('translate3d')
    await page.mouse.move(5, 400)
    await expect.poll(() => wrapper.evaluate((el) => (el as HTMLElement).style.transform)).toBe('')
  })

  test('the cursor ring grows and shows a label over data-cursor elements', async ({ page }) => {
    await page.goto('/styleguide')
    await page.waitForTimeout(800)
    const target = page.locator('[data-cursor="View"]')
    await target.scrollIntoViewIfNeeded()
    await target.hover()
    await expect(page.getByTestId('cursor-ring')).toHaveText('View')
    await expect
      .poll(async () => (await page.getByTestId('cursor-ring').boundingBox())?.width)
      .toBe(64)
  })

  test('client-side navigation works with route transitions', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/')
    await page.getByRole('link', { name: 'Francis Aguilar, home' }).click()
    await page.goto('/styleguide')
    await page.getByRole('link', { name: 'Francis Aguilar, home' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText('I build software')
    expect(errors).toEqual([])
  })
})
