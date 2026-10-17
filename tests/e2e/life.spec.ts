import { expect, test, type Page } from '@playwright/test'

const dates = (page: Page) =>
  page
    .locator('tbody tr td:first-child time')
    .evaluateAll((cells) => cells.map((cell) => cell.getAttribute('datetime')))

test.describe('/life', () => {
  test('shows four cards, each linking to its page', async ({ page }) => {
    const response = await page.goto('/life')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    const hrefs = await page
      .locator('main article h2 a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')))
    expect(hrefs).toEqual(['/life/running', '/life/community', '/life/gallery', '/life/building'])
  })

  test('teases the week in km, the latest talk, three photos and a quote', async ({ page }) => {
    await page.goto('/life')
    await expect(page.getByText('km this week')).toBeVisible()
    await expect(page.locator('main article img')).toHaveCount(3)
    await expect(page.locator('main blockquote')).toHaveCount(1)
  })
})

test.describe('/life/running', () => {
  test('shows the Strava summary, the race log and the pacing block', async ({ page }) => {
    const response = await page.goto('/life/running')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: 'Running' })).toBeVisible()
    await expect(page.getByText('Year to date')).toBeVisible()
    await expect(page.getByRole('img', { name: /Weekly running distance/ })).toBeVisible()
    await expect(page.getByRole('table')).toBeVisible()
    await expect(page.getByText('Paces led')).toBeVisible()
  })

  test('has no maps', async ({ page }) => {
    await page.goto('/life/running')
    await expect(page.locator('iframe, canvas, [class*="map"]')).toHaveCount(0)
  })

  test('starts newest first and sorts by a column with the mouse', async ({ page }) => {
    await page.goto('/life/running')
    const date = page.getByRole('columnheader', { name: /Date/ })
    await expect(date).toHaveAttribute('aria-sort', 'descending')
    expect(await dates(page)).toEqual(['2026-01-01', '2025-01-01', '2024-01-01'])

    const distance = page.getByRole('columnheader', { name: /Distance/ })
    // The first press can land before hydration has attached the handler: press until it takes.
    await expect(async () => {
      await distance.getByRole('button').click()
      await expect(distance).toHaveAttribute('aria-sort', 'descending')
    }).toPass()
    expect(await dates(page)).toEqual(['2024-01-01', '2026-01-01', '2025-01-01'])
    await expect(date).toHaveAttribute('aria-sort', 'none')

    await distance.getByRole('button').click()
    await expect(distance).toHaveAttribute('aria-sort', 'ascending')
    expect(await dates(page)).toEqual(['2025-01-01', '2026-01-01', '2024-01-01'])
  })

  test('sorts by every column with the keyboard', async ({ page }) => {
    await page.goto('/life/running')
    for (const name of ['Race', 'Distance', 'Time', 'Pace', 'Role', 'Date']) {
      const header = page.getByRole('columnheader', { name: new RegExp(name) })
      const button = header.getByRole('button')
      await expect(async () => {
        await button.focus()
        await page.keyboard.press('Enter')
        await expect(header).not.toHaveAttribute('aria-sort', 'none')
      }).toPass()
      await page.keyboard.press('Space')
      await expect(header).toHaveAttribute('aria-sort', /ascending|descending/)
    }
  })

  test('highlights PRs in rose with a PR badge', async ({ page }) => {
    await page.goto('/life/running')
    const pr = page.locator('tbody tr[data-pr="true"]')
    await expect(pr).toHaveCount(1)
    await expect(pr.getByText('PR', { exact: true })).toBeVisible()
    await expect(pr.locator('td').nth(3)).toHaveCSS('color', 'rgb(244, 63, 94)')
    await expect(
      page.locator('tbody tr[data-pr="false"]').first().locator('td').nth(3)
    ).not.toHaveCSS('color', 'rgb(244, 63, 94)')
  })

  test('scrolls the table sideways at 360px without scrolling the page', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await page.goto('/life/running')
    const region = page.getByRole('region', { name: 'Race table, scrollable' })
    await expect(region).toBeVisible()
    const metrics = await region.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }))
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth)
    const page_ = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(page_.scrollWidth).toBeLessThanOrEqual(page_.clientWidth)
    // Focusable, so the keyboard can scroll it.
    await region.focus()
    await expect(region).toBeFocused()
  })

  test('goes back to /life and describes the trail in BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto('/life/running')
    await expect(page.getByRole('link', { name: 'Life', exact: true }).first()).toHaveAttribute(
      'href',
      '/life'
    )
    const data = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent!)))
    const crumbs = data.find((item) => item['@type'] === 'BreadcrumbList')
    expect(crumbs.itemListElement.map((item: { item: string }) => item.item)).toEqual([
      'https://francisaguilar.co',
      'https://francisaguilar.co/life',
      'https://francisaguilar.co/life/running',
    ])
  })
})

test.describe('/life/community', () => {
  test('groups the talks by year, newest first', async ({ page }) => {
    const response = await page.goto('/life/community')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: 'Community' })).toBeVisible()
    await expect(page.locator('main section h2').filter({ hasText: /^20\d\d$/ })).toHaveText([
      '2026',
      '2025',
      '2024',
    ])
  })

  test('links the Pacing block to /life/running', async ({ page }) => {
    await page.goto('/life/community')
    await expect(page.getByRole('link', { name: /Pacing and race log/ })).toHaveAttribute(
      'href',
      '/life/running'
    )
  })
})

test('the sitemap lists the life pages', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  for (const path of ['/life', '/life/running', '/life/community']) {
    expect(xml).toContain(`<loc>https://francisaguilar.co${path}</loc>`)
  }
})

for (const path of ['/life', '/life/running', '/life/community']) {
  test(`${path} has its own title, canonical URL and social image`, async ({ page, request }) => {
    await page.goto(path)
    await expect(page).toHaveTitle(/ · Francis Aguilar$/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://francisaguilar.co${path}`
    )
    const image = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(image).toContain(`${path}/opengraph-image`)
    const response = await request.get(new URL(image!).pathname)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toBe('image/png')
  })
}
