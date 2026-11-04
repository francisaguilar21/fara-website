import { expect, test } from '@playwright/test'
import { hydratedAt, viewTransitionDone } from './helpers'

const THUMB = 'main ul li button[aria-haspopup="dialog"]'

const thumbnails = (page: import('@playwright/test').Page) =>
  page.locator('main ul li button[aria-haspopup="dialog"]')

test.describe('/life/gallery', () => {
  test('lists every photo with alt text, lazy-loaded below the fold', async ({ page }) => {
    const response = await page.goto('/life/gallery')
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1, name: 'Gallery' })).toBeVisible()
    await expect(thumbnails(page)).toHaveCount(6)
    const alts = await thumbnails(page)
      .locator('img')
      .evaluateAll((imgs) => imgs.map((img) => img.getAttribute('alt') ?? ''))
    expect(alts.every((alt) => alt.length >= 10)).toBe(true)
    const loading = await thumbnails(page).locator('img').last().getAttribute('loading')
    expect(loading).toBe('lazy')
  })

  test('filters by tag with the chips', async ({ page }) => {
    await page.goto('/life/gallery')
    await hydratedAt(page, THUMB)
    const race = page.getByRole('button', { name: 'Races' })
    await race.click()
    await expect(race).toHaveAttribute('aria-pressed', 'true')
    await expect(thumbnails(page)).toHaveCount(2)
    await page.getByRole('button', { name: 'All' }).click()
    await expect(thumbnails(page)).toHaveCount(6)
  })

  test('opens on click, moves with the arrows, closes on Esc and returns focus', async ({
    page,
  }) => {
    await page.goto('/life/gallery')
    const dialog = page.getByRole('dialog')
    const second = thumbnails(page).nth(1)

    await hydratedAt(page, THUMB)
    await second.click()
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('2 / 6')

    await page.keyboard.press('ArrowRight')
    await expect(dialog).toContainText('3 / 6')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await expect(dialog).toContainText('1 / 6')
    await page.keyboard.press('ArrowLeft')
    await expect(dialog).toContainText('6 / 6')

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(second).toBeFocused()
  })

  test('opens with Enter from the keyboard and traps focus inside', async ({ page }) => {
    await page.goto('/life/gallery')
    const dialog = page.getByRole('dialog')
    const first = thumbnails(page).first()

    await hydratedAt(page, THUMB)
    await first.focus()
    await page.keyboard.press('Enter')
    await expect(dialog).toBeVisible()

    // Three buttons: close, previous, next. Tabbing past the last one comes back to the first.
    const inside = () => page.evaluate(() => document.activeElement?.closest('dialog') !== null)
    for (let press = 0; press < 8; press++) {
      await page.keyboard.press('Tab')
      expect(await inside()).toBe(true)
    }
    for (let press = 0; press < 8; press++) {
      await page.keyboard.press('Shift+Tab')
      expect(await inside()).toBe(true)
    }

    await viewTransitionDone(page)
    await page.getByRole('button', { name: 'Close photo viewer' }).click()
    await expect(dialog).toBeHidden()
    await expect(first).toBeFocused()
  })

  test('swipes between photos', async ({ page }) => {
    await page.goto('/life/gallery')
    const dialog = page.getByRole('dialog')
    await hydratedAt(page, THUMB)
    await thumbnails(page).first().click()
    await expect(dialog).toBeVisible()

    const figure = dialog.locator('figure')
    const box = (await figure.boundingBox())!
    const y = box.y + box.height / 2
    const swipe = async (from: number, to: number) => {
      // Let the photo that just appeared finish loading and painting, so the pointer lands on it.
      await expect(dialog.locator('img')).toHaveJSProperty('complete', true)
      await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      )
      await viewTransitionDone(page)
      await page.mouse.move(from, y)
      await page.mouse.down()
      await page.mouse.move(to, y, { steps: 5 })
      await page.mouse.up()
    }

    // Opening the viewer and each new photo can start a view transition, and a drag that begins
    // during one is lost. Swipe again until it takes; a swipe that did work is not repeated.
    const swipeTo = async (from: number, to: number, expected: string) => {
      await expect(async () => {
        if (!(await dialog.innerText()).startsWith(expected)) await swipe(from, to)
        await expect(dialog).toContainText(expected, { timeout: 1500 })
      }).toPass()
    }

    const middle = box.x + box.width / 2
    await swipeTo(middle + 100, middle - 100, '2 / 6')
    await swipeTo(middle - 100, middle + 100, '1 / 6')
  })
})

test('the gallery hub link resolves', async ({ request }) => {
  expect((await request.get('/life/gallery')).status()).toBe(200)
})

test('the sitemap lists the gallery', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  expect(xml).toContain('<loc>https://francisaguilar.co/life/gallery</loc>')
})

for (const path of ['/life/gallery']) {
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
