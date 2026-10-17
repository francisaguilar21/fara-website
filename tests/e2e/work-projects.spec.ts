import { expect, test, type Page } from '@playwright/test'

const jsonLd = async (page: Page) =>
  (
    await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) => scripts.map((script) => script.textContent))
  ).map((text) => JSON.parse(text!))

test.describe('/work', () => {
  test('returns 200 with one h1, the /work eyebrow and the full timeline', async ({ page }) => {
    const response = await page.goto('/work')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.locator('main').getByText('/work', { exact: true }).first()).toBeVisible()
    await expect(page.getByTestId('timeline')).toBeVisible()
    // More than the homepage's six featured entries is not guaranteed, but every entry is here.
    expect(await page.getByTestId('timeline').locator('li').count()).toBeGreaterThanOrEqual(6)
  })

  test('shows every recommendation as a grid, not a carousel', async ({ page }) => {
    await page.goto('/work')
    await expect(page.getByRole('tablist')).toHaveCount(0)
    expect(await page.locator('main blockquote').count()).toBeGreaterThanOrEqual(2)
  })

  test('describes the person in JSON-LD', async ({ page }) => {
    await page.goto('/work')
    const person = (await jsonLd(page)).find((data) => data['@type'] === 'Person')
    expect(person).toMatchObject({ name: 'Francis Aguilar' })
    expect(person.sameAs).toContain('https://github.com/francisaguilar21')
  })

  test('leaves out the résumé link until the PDF exists', async ({ page }) => {
    await page.goto('/work')
    await expect(page.getByRole('link', { name: /Résumé/ })).toHaveCount(0)
  })
})

test.describe('/projects', () => {
  test('lists every project as a row', async ({ page }) => {
    const response = await page.goto('/projects')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.locator('main ul > li > a[href^="/projects/"]')).toHaveCount(3)
  })

  test('filters by stack tag and keeps the choice in ?stack=', async ({ page }) => {
    await page.goto('/projects')
    const chip = page.getByRole('button', { name: /^Next\.js/ })
    await chip.click()
    await expect(page).toHaveURL(/\?stack=next-js$/)
    await expect(chip).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('main ul > li > a[href^="/projects/"]')).toHaveCount(1)

    // Pressing it again clears the filter.
    await chip.click()
    await expect(page).not.toHaveURL(/stack=/)
    await expect(page.locator('main ul > li > a[href^="/projects/"]')).toHaveCount(3)
  })

  test('opens already filtered from a link, and ignores a tag nobody uses', async ({ page }) => {
    await page.goto('/projects?stack=next-js')
    await expect(page.locator('main ul > li > a[href^="/projects/"]')).toHaveCount(1)
    await page.goto('/projects?stack=cobol')
    await expect(page.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('main ul > li > a[href^="/projects/"]')).toHaveCount(3)
  })
})

test.describe('/projects/[slug]', () => {
  test('follows Problem, Role, What we built, Outcome, Stack', async ({ page }) => {
    const response = await page.goto('/projects/francisaguilar-co')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/francisaguilar\.co/)
    await expect(page.locator('.prose h2')).toHaveText([
      'Problem',
      'Role',
      'What we built',
      'Outcome',
      'Stack',
    ])
    const details = page.getByRole('complementary', { name: 'Project details' })
    await expect(details).toContainText('2026')
    await expect(details).toContainText('Next.js')
  })

  test('links back to /projects, and to the next and previous project', async ({ page }) => {
    await page.goto('/projects/francisaguilar-co')
    await expect(page.getByRole('link', { name: 'Projects', exact: true }).first()).toHaveAttribute(
      'href',
      '/projects'
    )
    await expect(page.getByRole('link', { name: /Previous project/ })).toHaveAttribute(
      'href',
      '/projects/fitscovery'
    )
    await expect(page.getByRole('link', { name: /Next project/ })).toHaveAttribute(
      'href',
      '/projects/sample-project'
    )
  })

  test('describes the trail in BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto('/projects/fitscovery')
    const crumbs = (await jsonLd(page)).find((data) => data['@type'] === 'BreadcrumbList')
    expect(crumbs.itemListElement.map((item: { item: string }) => item.item)).toEqual([
      'https://francisaguilar.co',
      'https://francisaguilar.co/projects',
      'https://francisaguilar.co/projects/fitscovery',
    ])
  })

  test('returns 404 for an unknown project', async ({ page }) => {
    const response = await page.goto('/projects/does-not-exist')
    expect(response?.status()).toBe(404)
  })
})

test('the sitemap lists the new pages', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  for (const path of ['/work', '/projects', '/projects/fitscovery']) {
    expect(xml).toContain(`<loc>https://francisaguilar.co${path}</loc>`)
  }
})

for (const path of ['/work', '/projects', '/projects/fitscovery']) {
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
