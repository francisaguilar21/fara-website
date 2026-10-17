import type { Page } from '@playwright/test'

/**
 * Waits until the page has finished hydrating. React drops or delays keyboard and click events
 * that arrive while it is still hydrating, so tests that press keys or click straight after
 * `goto` are flaky without this. The homepage takes a second or more on a slow machine.
 *
 * React hydrates in slices that keep the main thread busy until it is done, so this waits for the
 * carousel's dots (rendered by the client, never by the server) and then for two idle periods in
 * a row, a little apart. Tests that must not lose their first event should still retry it.
 */
export async function hydrated(page: Page) {
  await page.getByRole('tab').first().waitFor()
  for (let round = 0; round < 2; round++) {
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(() => requestIdleCallback(() => resolve(), { timeout: 4000 }), 150)
        })
    )
  }
}

/**
 * Waits until React has attached its handlers to the first element matching `selector`. Pages
 * without a carousel (see {@link hydrated}) use this: a click before it is dropped.
 */
export async function hydratedAt(page: Page, selector: string) {
  await page.waitForFunction(
    (css) =>
      Object.keys(document.querySelector(css) ?? {}).some((key) => key.startsWith('__reactProps')),
    selector
  )
  await viewTransitionDone(page)
}

/**
 * Waits for the view transition to end. The page reveals itself with one on load (about 0.7s), and
 * while one runs the browser sends every pointer event to the root element, so a click or drag
 * that starts in that window is lost.
 */
export async function viewTransitionDone(page: Page) {
  await page.waitForFunction(() => !document.documentElement.matches(':active-view-transition'))
}
