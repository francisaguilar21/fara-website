import { expect, test } from '@playwright/test'

test('home returns 200 with the headline as its only h1 when maintenance is off', async ({
  page,
}) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  const headings = page.getByRole('heading', { level: 1 })
  await expect(headings).toHaveCount(1)
  await expect(headings).toContainText('I build software & run long distances.')
})
