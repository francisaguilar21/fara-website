import { expect, test } from '@playwright/test'

// Every route of Phase 6 (P6-AC1), plus the pages that came with it.
const ROUTES = [
  '/work',
  '/projects',
  '/projects/fitscovery',
  '/life',
  '/life/running',
  '/life/community',
  '/life/gallery',
  '/life/building',
  '/now',
  '/uses',
  '/contact',
]

test.describe('every inner route', () => {
  for (const path of ROUTES) {
    test(`${path} returns 200, has one h1 and is in the sitemap`, async ({ page, request }) => {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      const xml = await (await request.get('/sitemap.xml')).text()
      expect(xml).toContain(`<loc>https://francisaguilar.co${path}</loc>`)
    })
  }

  for (const path of ROUTES) {
    test(`${path} has its own title, canonical URL and social image`, async ({ page, request }) => {
      await page.goto(path)
      await expect(page).toHaveTitle(/ · Francis Aguilar$/)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://francisaguilar.co${path}`
      )
      const image = await page.locator('meta[property="og:image"]').getAttribute('content')
      expect(image).toContain(`${path}/opengraph-image`)
      expect((await request.get(new URL(image!).pathname)).status()).toBe(200)
    })
  }

  test('the titles and descriptions are all different', async ({ page }) => {
    const titles = new Set<string>()
    const descriptions = new Set<string>()
    for (const path of ROUTES) {
      await page.goto(path)
      titles.add(await page.title())
      descriptions.add((await page.locator('meta[name="description"]').getAttribute('content'))!)
    }
    expect(titles.size).toBe(ROUTES.length)
    expect(descriptions.size).toBe(ROUTES.length)
  })
})

test.describe('/now', () => {
  test('shows when it was updated, and no staleness note while it is fresh', async ({ page }) => {
    await page.goto('/now')
    await expect(page.getByText(/Updated on October 13, 2026/)).toBeVisible()
    await expect(page.getByTestId('stale-note')).toHaveCount(0)
  })

  test('shows the Strava week and the Spotify card as samples', async ({ page }) => {
    await page.goto('/now')
    await expect(page.getByText('This week', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Year to date')).toBeVisible()
    await expect(page.getByText(/Now playing|Last played/)).toBeVisible()
    await expect(page.getByText('sample').first()).toBeVisible()
  })

  test('links to nownownow.com in a footnote', async ({ page }) => {
    await page.goto('/now')
    const link = page.getByRole('link', { name: '/now page' })
    await expect(link).toHaveAttribute('href', 'https://nownownow.com/about')
    await expect(link).toHaveAttribute('target', '_blank')
  })
})

test.describe('/uses', () => {
  test('lists every group with its notes and links', async ({ page }) => {
    await page.goto('/uses')
    const headings = await page.locator('main section h2').allInnerTexts()
    expect(headings.map((text) => text.replace(/\s*draft$/i, '').trim())).toEqual([
      'Languages',
      'Frontend',
      'Backend',
      'Cloud',
      'Product',
      'On the road',
    ])
    await expect(page.getByText('Strict mode on, everywhere.')).toBeVisible()
    await expect(page.getByRole('link', { name: /PostHog/ })).toHaveAttribute(
      'href',
      'https://posthog.com'
    )
  })
})

test.describe('/contact', () => {
  test('has the form and the socials, and no booking card without a booking URL', async ({
    page,
  }) => {
    await page.goto('/contact')
    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.locator('main').getByRole('link', { name: /GitHub/ })).toHaveAttribute(
      'href',
      'https://github.com/francisaguilar21'
    )
    await expect(page.getByRole('link', { name: /Book a 30-min call/ })).toHaveCount(0)
  })

  test('validates the form like the homepage does', async ({ page }) => {
    await page.goto('/contact')
    await page.getByRole('button', { name: /send/i }).click()
    await expect(page.getByText('Add your name.')).toBeVisible()
  })

  test('puts the booking card before the form on a phone', async ({ page }) => {
    // Port 3001 is the server that has a booking URL (see playwright.config.ts).
    await page.setViewportSize({ width: 390, height: 800 })
    await page.goto('http://localhost:3001/contact')
    const booking = await page.getByRole('link', { name: /Book a 30-min call/ }).boundingBox()
    const form = await page.locator('form').boundingBox()
    expect(booking).not.toBeNull()
    expect(booking!.y).toBeLessThan(form!.y)
  })
})

test.describe('404', () => {
  test('an unknown route returns 404 with the branded page', async ({ page }) => {
    const response = await page.goto('/nope')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText("This path doesn't exist")
    await expect(page.getByTestId('requested-path')).toHaveText('/nope')
    const main = page.locator('main')
    await expect(main.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    await expect(main.getByRole('link', { name: 'Writings' })).toHaveAttribute('href', '/writings')
    await expect(main.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/work')
  })

  test('an unknown project returns 404 with the branded page and its path', async ({ page }) => {
    const response = await page.goto('/projects/does-not-exist')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText("This path doesn't exist")
    await expect(page.getByTestId('requested-path')).toHaveText('/projects/does-not-exist')
  })

  test('shows rose on black, in the light theme too', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'light'))
    await page.goto('/nope')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    const panel = page.locator('[data-theme="dark"]').filter({ has: page.getByRole('heading') })
    await expect(panel).toHaveCSS('background-color', 'rgb(11, 10, 11)')
    await expect(page.getByTestId('requested-path')).toHaveCSS('color', 'rgb(244, 63, 94)')
  })

  test('is not indexed', async ({ page }) => {
    await page.goto('/nope')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  })
})

test('the 404 page logs no errors, and hydrates with the real path', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('Failed to load resource')) {
      errors.push(message.text())
    }
  })
  await page.goto('/some/deep/missing/path')
  await expect(page.getByTestId('requested-path')).toHaveText('/some/deep/missing/path')
  expect(errors).toEqual([])
})

// The site as production shows it: drafts hidden, so there is no content yet (port 3001, see
// playwright.config.ts). The pages still have to stand up.
test.describe('with drafts hidden', () => {
  const HIDDEN = 'http://localhost:3001'

  for (const path of ['/work', '/projects', '/life', '/life/running', '/life/community']) {
    test(`${path} still renders`, async ({ page }) => {
      expect((await page.goto(`${HIDDEN}${path}`))?.status()).toBe(200)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    })
  }

  for (const path of ['/now', '/uses', '/contact', '/life/gallery']) {
    test(`${path} still renders, with no draft chips`, async ({ page }) => {
      expect((await page.goto(`${HIDDEN}${path}`))?.status()).toBe(200)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      await expect(page.locator('main span.border-dashed.border-accent')).toHaveCount(
        path === '/now' ? 2 : 0
      )
    })
  }

  test('/life/building is a 404 while its page is a draft, and is not in the sitemap', async ({
    page,
    request,
  }) => {
    expect((await page.goto(`${HIDDEN}/life/building`))?.status()).toBe(404)
    const xml = await (await request.get(`${HIDDEN}/sitemap.xml`)).text()
    expect(xml).not.toContain('/life/building')
    expect(xml).toContain('<loc>https://francisaguilar.co/now</loc>')
  })
})
