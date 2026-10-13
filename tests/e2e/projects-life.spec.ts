import { expect, test } from '@playwright/test'

const rows = (page: import('@playwright/test').Page) => page.locator('#projects ul > li')

test.describe('projects', () => {
  test('shows three featured projects as rows that link to their case study', async ({ page }) => {
    await page.goto('/')
    await expect(rows(page)).toHaveCount(3)
    const hrefs = await rows(page)
      .locator('a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')))
    expect(hrefs).toEqual([
      '/projects/fitscovery',
      '/projects/francisaguilar-co',
      '/projects/sample-project',
    ])
    await expect(page.getByRole('heading', { level: 2, name: /Things I.ve built/ })).toBeVisible()
  })

  test('hovering a row shifts the title right in rose, and a cover follows the pointer', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForTimeout(500) // client components hydrate
    const row = rows(page).first().locator('a')
    const title = row.locator('h3')
    await row.scrollIntoViewIfNeeded()

    const peek = page.getByTestId('cursor-peek')
    await expect(peek).toBeAttached()
    const frame = peek.locator('> div')
    await expect(frame).toHaveCSS('opacity', '0')

    const box = (await row.boundingBox())!
    await page.mouse.move(box.x + 100, box.y + box.height / 2)
    await expect(frame).toHaveCSS('opacity', '1')
    await expect.poll(() => title.evaluate((el) => getComputedStyle(el).translate)).toBe('10px')
    await expect(title).toHaveCSS('color', 'rgb(244, 63, 94)')

    // It follows the pointer: 170px to its right, centered on it.
    await page.mouse.move(box.x + 300, box.y + box.height / 2)
    await expect
      .poll(async () => {
        const peekBox = (await frame.boundingBox())!
        return Math.round(peekBox.x + peekBox.width / 2 - (box.x + 300))
      })
      .toBe(170)

    await page.mouse.move(5, 5)
    await expect(frame).toHaveCSS('opacity', '0')
  })

  test('the arrow turns 45° up on hover', async ({ page }) => {
    await page.goto('/')
    const row = rows(page).first().locator('a')
    await row.scrollIntoViewIfNeeded()
    await row.hover()
    await expect
      .poll(() => row.locator('span[aria-hidden]').evaluate((el) => getComputedStyle(el).rotate))
      .toBe('-45deg')
  })

  test('rows are keyboard focusable with a visible focus style', async ({ page }) => {
    await page.goto('/')
    const row = rows(page).first().locator('a')
    await row.focus()
    await expect(row).toBeFocused()
    await expect(row).toHaveCSS('outline-style', 'solid')
    await expect(row).toHaveCSS('outline-width', '2px')
    // The title responds to focus as it does to hover.
    await expect(row.locator('h3')).toHaveCSS('color', 'rgb(244, 63, 94)')
  })

  test.describe('touch device', () => {
    test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })

    test('has no cursor preview', async ({ page }) => {
      await page.goto('/')
      await page.waitForTimeout(500)
      await expect(page.getByTestId('cursor-peek')).toHaveCount(0)
    })
  })

  test.describe('reduced motion', () => {
    test.use({ reducedMotion: 'reduce' })

    test('has no cursor preview and the title does not move', async ({ page }) => {
      await page.goto('/')
      await page.waitForTimeout(500)
      await expect(page.getByTestId('cursor-peek')).toHaveCount(0)
      const row = rows(page).first().locator('a')
      await row.scrollIntoViewIfNeeded()
      await row.hover()
      await expect(row.locator('h3')).toHaveCSS('translate', /^(none|0px)/)
    })
  })
})

test.describe('life', () => {
  test('running tile: three stats, a chart with a text alternative, and the last run', async ({
    page,
  }) => {
    await page.goto('/')
    const tile = page.locator('article', { hasText: '/life/running' })
    await expect(tile.getByText('This week', { exact: true })).toBeVisible()
    await expect(tile.getByText('Year to date')).toBeVisible()
    await expect(tile.getByText('Avg pace')).toBeVisible()
    await expect(tile.getByText('sample').first()).toBeVisible()
    const chart = tile.getByRole('img', { name: /Weekly running distance.*last 12 weeks/ })
    await expect(chart).toBeVisible()
    await expect(chart.locator('rect')).toHaveCount(12)
    await expect(chart.locator('rect.fill-accent')).toHaveCount(1)
    await expect(tile.getByText('Last run')).toBeVisible()
  })

  test('the chart bars are drawn to scale', async ({ page }) => {
    await page.goto('/')
    const heights = await page
      .locator('article', { hasText: '/life/running' })
      .locator('svg rect')
      .evaluateAll((bars) => bars.map((bar) => Number(bar.getAttribute('height'))))
    // 41.2 km (this week) against 18.4 km (12 weeks ago).
    expect(heights.at(-1)! / heights[0]!).toBeCloseTo(41.2 / 18.4, 2)
  })

  test('community tile: three talks and the Spotify card', async ({ page }) => {
    await page.goto('/')
    const tile = page.locator('article', { hasText: '/life/community' })
    await expect(tile.locator('ul > li')).toHaveCount(3)
    await expect(tile.getByText('Now playing')).toBeVisible()
    await expect(tile.getByText('Running Up That Hill')).toBeVisible()
  })

  test('gallery: five photos with captions, each with alt text', async ({ page }) => {
    await page.goto('/')
    const figures = page.locator('#life figure')
    await expect(figures).toHaveCount(5)
    await expect(figures.locator('figcaption')).toHaveCount(5)
    const alts = await figures
      .locator('img')
      .evaluateAll((images) => images.map((image) => image.getAttribute('alt') ?? ''))
    expect(alts.every((alt) => alt.length >= 10)).toBe(true)
  })

  test('gallery photos drift as the page scrolls', async ({ page }) => {
    await page.goto('/')
    const figure = page.locator('#life figure').first()
    await figure.scrollIntoViewIfNeeded()
    const inner = figure.locator('img').locator('xpath=..')
    await expect
      .poll(() => inner.evaluate((el) => (el as HTMLElement).style.transform))
      .toContain('translate3d')
    const before = await inner.evaluate((el) => (el as HTMLElement).style.transform)
    await page.mouse.wheel(0, 200)
    await expect
      .poll(() => inner.evaluate((el) => (el as HTMLElement).style.transform))
      .not.toBe(before)
  })

  test('building tile: a draft pull quote and a link to the story', async ({ page }) => {
    await page.goto('/')
    const tile = page.locator('article', { hasText: '/life/building' })
    await expect(tile.locator('blockquote em')).toHaveCSS('color', 'rgb(244, 63, 94)')
    await expect(tile.getByText('copy', { exact: true })).toBeVisible()
    await expect(tile.getByRole('link', { name: /Read the story/ })).toHaveAttribute(
      'href',
      '/life/building'
    )
  })

  test('at 360px nothing scrolls the page sideways', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await page.goto('/')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(overflow).toBeLessThanOrEqual(0)
    // The tiles stack on one column.
    const running = (await page.locator('article', { hasText: '/life/running' }).boundingBox())!
    const community = (await page.locator('article', { hasText: '/life/community' }).boundingBox())!
    expect(community.y).toBeGreaterThan(running.y + running.height - 1)
  })
})
