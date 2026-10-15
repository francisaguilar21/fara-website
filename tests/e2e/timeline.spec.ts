import { expect, test, type Page } from '@playwright/test'

const items = (page: Page) => page.locator('[data-testid="timeline"] li[data-lit]')

/** `data-lit` of every entry, top to bottom, as booleans. */
const litState = (page: Page) =>
  items(page).evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-lit') === 'true'))

const fillScale = (page: Page) =>
  page
    .locator('[data-testid="timeline-fill"]')
    .evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).d)

/** Scrolls to the timeline's top, then down in steps, like a visitor reading. */
async function scrollThrough(page: Page, onStep: () => Promise<void>) {
  const box = (await page.getByTestId('timeline').boundingBox())!
  const top = box.y + (await page.evaluate(() => window.scrollY))
  for (let offset = -500; offset <= box.height; offset += 150) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, top + offset))
    await page.waitForTimeout(120)
    await onStep()
  }
}

test.describe('timeline', () => {
  test('scrolling lights up the dots in order and the fill follows', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('timeline')).toHaveAttribute('data-animated', 'true')
    const count = await items(page).count()
    expect(count).toBeGreaterThan(2)

    let lastLit = 0
    let lastFill = -1
    await scrollThrough(page, async () => {
      const state = await litState(page)
      // Lit entries always form a run from the top: nothing lights out of order.
      const lit = state.filter(Boolean).length
      expect(state.slice(0, lit).every(Boolean)).toBe(true)
      expect(state.slice(lit).some(Boolean)).toBe(false)
      expect(lit).toBeGreaterThanOrEqual(lastLit)
      lastLit = lit
      const fill = await fillScale(page)
      expect(fill).toBeGreaterThanOrEqual(lastFill - 0.02) // the spring may lag a hair
      lastFill = fill
    })
    expect(lastLit).toBe(count)
    await expect.poll(() => fillScale(page)).toBeGreaterThan(0.98)
  })

  test('scrolling back up turns the later dots off again', async ({ page }) => {
    await page.goto('/')
    const box = (await page.getByTestId('timeline').boundingBox())!
    const top = box.y + (await page.evaluate(() => window.scrollY))
    await page.evaluate((y) => window.scrollTo(0, y), top + box.height)
    await expect.poll(async () => (await litState(page)).every(Boolean)).toBe(true)
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, top - 600))
    await expect.poll(async () => (await litState(page)).filter(Boolean).length).toBe(1)
  })

  test('the sticky year follows the active entry on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    const year = page.getByTestId('timeline-year')
    await expect(year).toBeVisible()
    const first = await year.innerText()
    const years = new Set([first])
    await scrollThrough(page, async () => {
      years.add(await year.innerText())
    })
    expect(years.size).toBeGreaterThan(2)
    // It sticks at 40% of the viewport while the timeline scrolls.
    const timeline = (await page.getByTestId('timeline').boundingBox())!
    const scrollY = await page.evaluate(() => window.scrollY)
    await page.evaluate((y) => window.scrollTo(0, y), scrollY + timeline.y + 200)
    await page.waitForTimeout(300)
    const box = (await year.boundingBox())!
    expect(box.y).toBeGreaterThan(900 * 0.3)
    expect(box.y).toBeLessThan(900 * 0.5)
  })

  test('the legend explains the dots, and "Full timeline" links to /work', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Work', { exact: true })).toBeVisible()
    await expect(page.getByText('Life', { exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: /Full timeline/ })).toHaveAttribute('href', '/work')
  })

  test('on a phone the years are inline and the sticky year is gone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expect(page.getByTestId('timeline-year')).toBeHidden()
    await expect(
      items(page)
        .first()
        .getByText(/→ Now|\d{4}/)
        .first()
    ).toBeVisible()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the timeline is fully drawn with every entry in place', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('timeline')).toHaveAttribute('data-animated', 'false')
    expect((await litState(page)).every(Boolean)).toBe(true)
    // No transform at all means the fill is at its full height.
    await expect(page.getByTestId('timeline-fill')).toHaveCSS('transform', 'none')
    // Scrolling doesn't change anything.
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(300)
    expect((await litState(page)).every(Boolean)).toBe(true)
  })
})

test.describe('JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false })

  test('the timeline is fully drawn', async ({ page }) => {
    await page.goto('/')
    expect((await litState(page)).every(Boolean)).toBe(true)
    await expect(page.getByTestId('timeline-fill')).toHaveCSS('transform', 'none')
    await expect(items(page).last()).toBeAttached()
  })
})
