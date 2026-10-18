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

// The homepage is checked once per theme, at a phone and a desktop width.
for (const theme of ['dark', 'light']) {
  for (const width of [1440, 390]) {
    test(`/ has no axe violations (${theme}, ${width}px)`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem('theme', value), theme)
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
        .analyze()
      expect(results.violations).toEqual([])
    })
  }
}

// Inner pages (P6-AC7), once per theme at a phone and a desktop width.
const INNER_PAGES = [
  '/work',
  '/projects',
  '/projects/fitscovery',
  '/life',
  '/life/running',
  '/life/community',
  '/life/gallery',
  '/life/building',
]
for (const path of INNER_PAGES) {
  for (const theme of ['dark', 'light']) {
    for (const width of [1440, 390]) {
      test(`${path} has no axe violations (${theme}, ${width}px)`, async ({ page }) => {
        await page.addInitScript((value) => localStorage.setItem('theme', value), theme)
        await page.setViewportSize({ width, height: 900 })
        await page.goto(path)
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
          .analyze()
        expect(results.violations).toEqual([])
      })
    }
  }
}
