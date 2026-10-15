import { expect, test, type Page } from '@playwright/test'

// The homepage as production shows it: `HIDE_DRAFTS=1` and `NEXT_PUBLIC_BOOKING_URL` set. This is
// the second server in `playwright.config.ts`.
test.use({ baseURL: 'http://localhost:3001' })

/** Everything the page logs as an error or throws, apart from the 404s of prefetched routes. */
function collectErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('Failed to load resource')) {
      errors.push(message.text())
    }
  })
  return errors
}

/** The text of every draft chip on the page (the dashed rose box of `<DraftChip />`). */
const chips = (page: Page) => page.locator('main span.border-dashed.border-accent').allInnerTexts()

test.describe('with drafts hidden', () => {
  test('the page renders without errors', async ({ page }) => {
    const errors = collectErrors(page)
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('I build software')
    await page.waitForTimeout(1000)
    expect(errors).toEqual([])
  })

  test('no draft chip is left: the only chips are the sample-data ones', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('region', { name: "What I'm doing now" })).toBeVisible()
    const texts = (await chips(page)).map((text) => text.toLowerCase())
    // Strava, Spotify and GitHub still show their sample data, and say so, until Phase 7.
    expect(texts.length).toBeGreaterThan(0)
    expect(new Set(texts)).toEqual(new Set(['sample']))
    for (const word of ['draft', 'company?', 'copy', 'link', 'placeholder']) {
      await expect(page.locator('main').getByText(word, { exact: true })).toHaveCount(0)
    }
  })

  test('the hero keeps its three roles, without the chip', async ({ page }) => {
    await page.goto('/')
    for (const path of ['/work', '/build', '/run']) {
      await expect(page.locator('main ul li', { hasText: path }).first()).toBeVisible()
    }
    await expect(page.getByText('Senior Software Engineer').first()).toBeVisible()
  })

  test('the strip skips what came from the draft now page, and keeps the live widgets', async ({
    page,
  }) => {
    await page.goto('/')
    const strip = page.getByRole('region', { name: "What I'm doing now" })
    const labels = await strip.locator('ul').first().locator('li b').allInnerTexts()
    expect(labels).toEqual(['LISTENING', 'THIS WEEK'])
  })

  test('with a booking URL set, the hero books a call in a new tab', async ({ page }) => {
    await page.goto('/')
    const book = page.getByRole('link', { name: 'Book a call' })
    await expect(book).toHaveAttribute('href', 'https://calendar.app.google/e2e-test')
    await expect(book).toHaveAttribute('target', '_blank')
    await expect(page.getByRole('link', { name: 'Send a message' })).toHaveCount(0)
  })

  test('every link in the header that points at the page points at something', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000) // the header checks the page after it has rendered
    const hrefs = await page
      .locator('header a[href]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''))
    const anchors = hrefs.filter((href) => href.startsWith('#'))
    expect(anchors.length).toBeGreaterThan(0)
    for (const anchor of anchors) {
      await expect(page.locator(anchor), anchor).toBeAttached()
    }
  })

  test('sections whose content is all drafts are gone, with nothing left in them to link to', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('#projects')).toHaveCount(0)
    await expect(page.locator('#life figure')).toHaveCount(0)
    await expect(page.locator('article', { hasText: '/life/building' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: /Read the story/ })).toHaveCount(0)
  })

  test('the work timeline keeps its real entries, and the life tiles keep the live widgets', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('#work')).toBeAttached()
    expect(await page.locator('#work ol > li').count()).toBeGreaterThan(0)
    const community = page.locator('article', { hasText: '/life/community' })
    await expect(community.locator('ul > li')).toHaveCount(0)
    await expect(community.getByText('Running Up That Hill')).toBeVisible()
    await expect(page.locator('article', { hasText: '/life/running' })).toBeVisible()
  })

  test('with a booking URL set, the contact section has its booking card', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('#contact')
    await expect(section.getByText('Google Calendar · appointment schedule')).toBeVisible()
    const book = section.getByRole('link', { name: /Book a 30-min call/ })
    await expect(book).toHaveAttribute('href', 'https://calendar.app.google/e2e-test')
    await expect(book).toHaveAttribute('target', '_blank')
    await expect(book).toHaveAttribute('rel', /noopener/)
    await expect(section.getByRole('button', { name: /Send message/ })).toBeVisible()
  })

  test('the posts section and its index link survive: posts are not drafts', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#writing ul > li a')).toHaveCount(3)
    await expect(page.getByRole('link', { name: /All posts/ })).toBeVisible()
  })
})
