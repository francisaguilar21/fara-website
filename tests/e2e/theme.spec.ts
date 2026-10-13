import { expect, test } from '@playwright/test'

test.describe('theme', () => {
  test('renders dark when the OS prefers light and nothing is saved', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'light' })
    const page = await context.newPage()
    await page.goto('/')

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    expect(background).toBe('rgb(11, 10, 11)') // --bg dark: #0b0a0b
    await context.close()
  })

  test('uses the saved light choice on first paint', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' })
    await context.addInitScript(() => localStorage.setItem('theme', 'light'))
    const page = await context.newPage()
    await page.goto('/')

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    expect(background).toBe('rgb(250, 249, 249)') // --bg light: #faf9f9
    await context.close()
  })
})

test('all text is visible with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await context.close()
})
