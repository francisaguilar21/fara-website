import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// /styleguide renders every token and component in both themes at once, so one pass covers both.
test('/styleguide has no axe violations', async ({ page }) => {
  await page.goto('/styleguide')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
})
