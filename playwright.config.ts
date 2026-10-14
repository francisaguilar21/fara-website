import { defineConfig, devices } from '@playwright/test'

const PORT = 3000
/** Port of the server that hides drafts (`tests/e2e/hidden-drafts.spec.ts`). */
const HIDDEN_PORT = 3001

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Optional: point at an already-installed Chromium instead of Playwright's download.
        launchOptions: { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined },
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm build && pnpm start',
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      // Keep maintenance mode off so the tests don't depend on PostHog. Drafts are shown and no
      // booking page is set: the default build, whatever the shell has in its environment.
      env: {
        MAINTENANCE_MODE: 'off',
        VERCEL_ENV: '',
        HIDE_DRAFTS: '',
        NEXT_PUBLIC_BOOKING_URL: '',
      },
    },
    {
      // The homepage as production shows it: drafts hidden, and a booking page set. It is a dev
      // server because the build above has to stay the one without them. Started second, since
      // `next build` clears `.next` and the dev server keeps its files in `.next/dev`.
      command: `pnpm exec next dev --port ${HIDDEN_PORT}`,
      url: `http://localhost:${HIDDEN_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        MAINTENANCE_MODE: 'off',
        VERCEL_ENV: '',
        HIDE_DRAFTS: '1',
        NEXT_PUBLIC_BOOKING_URL: 'https://calendar.app.google/e2e-test',
      },
    },
  ],
})
