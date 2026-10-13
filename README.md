# francisaguilar.co

Personal site of Francis Aguilar: software engineer, founder and long-distance runner.
Built with Next.js (App Router), React, TypeScript and Tailwind CSS v4, and deployed on Vercel.

> The 2026 rebuild is in progress. Production shows a maintenance page until launch. The previous
> site is preserved at the git tags [`v2024`](../../tree/v2024) and
> [`v2024.1`](../../tree/v2024.1) (with the React Server Components security fix).

## Requirements

- Node.js 24 (the LTS pinned in `.nvmrc`; `nvm use` picks it up)
- pnpm, pinned through the `packageManager` field. Enable it with Corepack:

```bash
corepack enable
```

## Setup

```bash
pnpm install
cp .env.example .env.local   # then fill in what you need; most values are optional in development
pnpm dev
```

Open <http://localhost:3000>. Maintenance mode is off unless `NEXT_PUBLIC_POSTHOG_KEY` is set and the
PostHog flag is on, or `MAINTENANCE_MODE=on`.

## Scripts

| Script              | What it does                                                         |
| ------------------- | -------------------------------------------------------------------- |
| `pnpm dev`          | Start the dev server (Turbopack)                                     |
| `pnpm build`        | Production build                                                     |
| `pnpm start`        | Serve the production build                                           |
| `pnpm lint`         | ESLint, with no warnings allowed                                     |
| `pnpm content`      | Build the content with Velite (`content/` to `.velite/`), strict     |
| `pnpm check:drafts` | List every placeholder (draft entry or sample data). Exits 1 if any. |
| `pnpm typecheck`    | Build the content, then `tsc --noEmit`                               |
| `pnpm format`       | Format everything with Prettier                                      |
| `pnpm format:check` | Check formatting without writing                                     |
| `pnpm test`         | Build the content, then run the unit tests (Vitest)                  |
| `pnpm test:watch`   | Unit tests in watch mode (run `pnpm content` first)                  |
| `pnpm test:e2e`     | End-to-end tests (Playwright, Chromium). Builds and starts the site. |
| `pnpm commit`       | Guided commit prompt (Commitizen)                                    |

CI runs install → lint → typecheck → format check → unit tests → build on every PR and on pushes to
`main`. Playwright joins CI in Phase 8.

## Environment variables

Every variable is listed, with a comment and no value, in [`.env.example`](./.env.example). Production
and Preview values live in Vercel and are never committed. The full table is in the
[plan, §7](./docs/2026-revamp-specs/2026-revamp-plan.md#7-environment-variables).

## Commit workflow

Husky runs two git hooks:

- **pre-commit**: `lint-staged` runs ESLint and Prettier on the staged files.
- **commit-msg**: commitlint checks the message against
  [Conventional Commits](https://www.conventionalcommits.org/).

Run `pnpm commit` for a guided prompt, or write the message yourself:

```
feat(home): add the hero section
```

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- Scopes (optional, but only these): `design`, `blog`, `home`, `work`, `projects`, `life`, `now`, `uses`,
  `contact`, `analytics`, `integrations`, `maintenance`, `seo`, `deps`, `ci`, `docs`
- The header is at most 100 characters.

Reference spec IDs in the PR description (for example "Implements P3-R2, closes P3-T05"), not in commit
messages.

## Maintenance mode

While the site is being rebuilt, production can show a "back soon" page (HTTP 503 with `Retry-After`).
It runs from [`proxy.ts`](./proxy.ts) and [`lib/maintenance/`](./lib/maintenance).

| Control                            | How to use it                                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------- |
| PostHog flag `is_maintenance_mode` | Release condition **100% of all users**. On = maintenance page, off = site. Takes up to about 30 seconds. |
| `MAINTENANCE_MODE=on\|off`         | Emergency override that beats PostHog (needs a redeploy)                                                  |
| `MAINTENANCE_BYPASS_TOKEN`         | Visit `/?preview=<token>` to see the real site for 7 days (cookie)                                        |
| `MAINTENANCE_ALLOWED_PATHS`        | Path prefixes that stay public, e.g. `/blog,/rss.xml`                                                     |

If PostHog can't be reached, the site stays up (fail open). Details:
[Phase 0 specs, §4.1](./docs/2026-revamp-specs/phase-0-specs/phase-0.specs.md#41-maintenance-mode-built-in-pr-72).

## Notes

- **TypeScript is pinned to 6.0.x** (`~6.0.3`). TypeScript 7 is out, but `typescript-eslint` doesn't
  support it yet (plan risk R1). Move up once it does.
- **ESLint is on 9.x**, because `eslint-plugin-jsx-a11y` doesn't support ESLint 10 yet.

## Docs

Everything about the 2026 rebuild lives in [`docs/2026-revamp-specs/`](./docs/2026-revamp-specs/README.md):
the plan, the design spec and mockup, and per-phase specs and tasks.
