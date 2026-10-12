import { defineConfig, devices } from '@playwright/test'

const PORT = 3000

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
  webServer: {
    command: 'pnpm build && pnpm start',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    // Keep maintenance mode off so the tests don't depend on PostHog.
    env: { MAINTENANCE_MODE: 'off' },
  },
})
