import { expect, test } from '@playwright/test'

test('home returns 200 with the placeholder when maintenance is off', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('New site in progress')
})
