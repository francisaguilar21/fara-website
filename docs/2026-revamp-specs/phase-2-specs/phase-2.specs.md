# Phase 2: Scaffold & tooling · Specs

| Status      | Depends on            | Ships as                | Effort |
| ----------- | --------------------- | ----------------------- | ------ |
| Not started | Phase 1 (same branch) | **One PR with Phase 1** | 1 day  |

References: [plan §2](../2026-revamp-plan.md#2-how-well-work), [plan §6](../2026-revamp-plan.md#6-dependencies), [DESIGN §11](../design/DESIGN.md#11-tech-stack)

## 1. Goal

A blank, production-ready Next.js app. It has the requested stack and the guardrails: pnpm, TypeScript,
Tailwind, ESLint, Prettier, Husky, commitlint, Commitizen, tests and CI. Maintenance mode is wired back
in. Every later phase builds on it without touching tooling again.

## 2. Scope

**In**

- Runtime and package manager
- Next.js app skeleton
- Lint, format and git hooks
- Commit conventions
- Test runners with a first real test
- CI
- `.env.example`
- README
- Porting maintenance mode

**Out**

- Design tokens, fonts and components (Phase 3)
- Content and MDX (Phase 4)
- PostHog analytics and the `/ingest` proxy (Phase 7)

## 3. Requirements

| ID     | Requirement                                                                                                                                        |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| P2-R1  | Node is the current LTS, pinned in `.nvmrc` and `engines.node`. pnpm is pinned through `packageManager` (Corepack).                                |
| P2-R2  | Next.js 16 (App Router), React 19, TypeScript in `strict` mode with `noUncheckedIndexedAccess`, path alias `@/*`.                                  |
| P2-R3  | Tailwind CSS v4 through `@tailwindcss/postcss`, with a CSS-first config (no `tailwind.config.js`).                                                 |
| P2-R4  | ESLint flat config (`eslint.config.mjs`): Next core-web-vitals + TypeScript + `jsx-a11y`, with Prettier last. `pnpm lint` passes with no warnings. |
| P2-R5  | Prettier (`semi: false`, `singleQuote: true`, `printWidth: 100`, `trailingComma: 'es5'`) with `prettier-plugin-tailwindcss`.                       |
| P2-R6  | Husky runs `lint-staged` on pre-commit and commitlint on commit-msg.                                                                               |
| P2-R7  | Commits follow Conventional Commits with an allowed scope list (§4.4). `pnpm commit` opens the cz-git prompt.                                      |
| P2-R8  | Vitest (unit, jsdom) and Playwright (e2e, Chromium) are set up. Each has at least one real test.                                                   |
| P2-R9  | GitHub Actions CI runs on every PR and push to `main`: install → lint → typecheck → unit tests → build.                                            |
| P2-R10 | Maintenance mode works exactly as specified in Phase 0 §4.1. On Next.js 16 it runs from `proxy.ts` (exported function `proxy`).                    |
| P2-R11 | `.env.example` lists every variable in plan §7 with comments and no values.                                                                        |
| P2-R12 | `README.md` covers what the site is, requirements, setup, scripts, env vars, commit workflow, maintenance mode and links to these specs.           |
| P2-R13 | The home route renders a minimal placeholder ("New site in progress") so the build has a page. Visitors only see it with the bypass cookie.        |
| P2-R14 | Vercel builds with pnpm on the pinned Node version, with no manual overrides needed.                                                               |

## 4. Technical design

### 4.1 Scaffolding

`create-next-app` refuses to run in a folder that already has files like `data/`, `public/` or
`middleware.ts`. Generate the app in a temp folder and copy it in:

```bash
corepack enable
pnpm create next-app@latest /tmp/fa-scaffold --ts --tailwind --eslint --app --import-alias "@/*" --use-pnpm --no-src-dir --skip-install
cp -r /tmp/fa-scaffold/{app,public,package.json,tsconfig.json,next.config.ts,postcss.config.mjs,eslint.config.mjs,.gitignore,next-env.d.ts} .
# merge public/: keep our public/static, drop the scaffold's demo SVGs
pnpm install
```

Next.js 16 notes:

- Turbopack is the default for `dev` and `build`, so no flag is needed.
- `next lint` is gone, so lint runs through `eslint .`.
- `middleware.ts` is renamed to `proxy.ts`, with the exported function named `proxy`.

### 4.2 Files

| File                                                | Contents                                                                                                                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.nvmrc`                                            | Current Node LTS major                                                                                                                                        |
| `package.json`                                      | `packageManager`, `engines.node`, scripts (§4.3), `lint-staged`, `config.commitizen`                                                                          |
| `tsconfig.json`                                     | `strict`, `noUncheckedIndexedAccess`, `paths: { "@/*": ["./*"] }`                                                                                             |
| `next.config.ts`                                    | `reactStrictMode`, the security headers carried over from 2024 (CSP updated: `font-src 'self'`, PostHog hosts), `images.formats: ['image/avif','image/webp']` |
| `eslint.config.mjs`                                 | `next/core-web-vitals`, `next/typescript`, `jsx-a11y` flat recommended, `eslint-config-prettier`                                                              |
| `prettier.config.mjs`                               | Options from P2-R5 plus the Tailwind plugin (pointing at `app/globals.css` as the stylesheet)                                                                 |
| `commitlint.config.ts`                              | Conventional config, scope enum and the cz-git prompt settings (§4.4)                                                                                         |
| `.husky/pre-commit`                                 | `pnpm lint-staged`                                                                                                                                            |
| `.husky/commit-msg`                                 | `pnpm commitlint --edit "$1"`                                                                                                                                 |
| `vitest.config.ts`                                  | jsdom environment, `@vitejs/plugin-react`, `@/` alias, `tests/unit/**`                                                                                        |
| `playwright.config.ts`                              | `tests/e2e/**`, Chromium, `webServer: pnpm build && pnpm start`                                                                                               |
| `proxy.ts`                                          | Ported from `middleware.ts`; `lib/maintenance/` unchanged                                                                                                     |
| `app/layout.tsx`, `app/page.tsx`, `app/globals.css` | Minimal shell + placeholder (P2-R13)                                                                                                                          |
| `.github/workflows/ci.yml`                          | §4.5                                                                                                                                                          |
| `.github/pull_request_template.md`                  | Summary · Spec IDs · Screenshots · Checklist                                                                                                                  |
| `.vscode/extensions.json`                           | ESLint, Prettier, Tailwind CSS IntelliSense, MDX                                                                                                              |
| `.env.example`                                      | Plan §7                                                                                                                                                       |
| `README.md`                                         | P2-R12                                                                                                                                                        |

### 4.3 Scripts

```jsonc
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint . --max-warnings 0",
  "typecheck": "tsc --noEmit",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "commit": "cz",
  "prepare": "husky",
}
```

`lint-staged`:

```jsonc
{
  "*.{ts,tsx,mjs}": ["eslint --fix --max-warnings 0", "prettier --write"],
  "*.{md,mdx,json,css,yml}": ["prettier --write"],
}
```

### 4.4 Commit conventions

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- Scopes (enforced): `design`, `blog`, `home`, `work`, `projects`, `life`, `now`, `uses`, `contact`,
  `analytics`, `integrations`, `maintenance`, `seo`, `deps`, `ci`, `docs`
- Scope is optional. The header is at most 100 characters.

```ts
// commitlint.config.ts
import type { UserConfig } from '@commitlint/types'

const scopes = [
  'design',
  'blog',
  'home',
  'work',
  'projects',
  'life',
  'now',
  'uses',
  'contact',
  'analytics',
  'integrations',
  'maintenance',
  'seo',
  'deps',
  'ci',
  'docs',
]

export default {
  extends: ['@commitlint/config-conventional'],
  rules: { 'scope-enum': [2, 'always', scopes], 'header-max-length': [2, 'always', 100] },
  prompt: { scopes, allowCustomScopes: false, allowEmptyScopes: true },
} satisfies UserConfig
```

### 4.5 CI

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm format:check
      - run: pnpm test
      - run: pnpm build
```

Playwright runs in CI from Phase 8. Before that, `pnpm test:e2e` runs locally.

### 4.6 First tests

| File                                   | Covers                                                                                                                                                                                       |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/unit/maintenance-flag.test.ts`  | `parseFlag` (v2 shape, legacy shape, missing); `isMaintenanceMode` precedence (env `on`/`off` beats PostHog); fail-open on fetch error and timeout; 30s cache (mocked `fetch` + fake timers) |
| `tests/unit/maintenance-proxy.test.ts` | Allowed paths, bypass token → redirect + cookie, cookie → pass-through, 503 + headers when on                                                                                                |
| `tests/e2e/smoke.spec.ts`              | `/` returns 200 with the placeholder when maintenance is off                                                                                                                                 |

## 5. Acceptance criteria

| ID     | Criterion                                                                                                                     |
| ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| P2-AC1 | On a clean clone: `corepack enable && pnpm install && pnpm build` succeeds.                                                   |
| P2-AC2 | `pnpm lint`, `pnpm typecheck`, `pnpm format:check` and `pnpm test` all pass.                                                  |
| P2-AC3 | `git commit -m "bad message"` is rejected. `git commit -m "feat(home): x"` passes.                                            |
| P2-AC4 | `pnpm commit` opens the cz-git prompt, offering only the allowed scopes.                                                      |
| P2-AC5 | CI is green on the PR.                                                                                                        |
| P2-AC6 | On the Vercel preview: with `MAINTENANCE_MODE=on` the 503 page shows, and the bypass link shows the placeholder.              |
| P2-AC7 | After merge, production serves the maintenance page (flag on), and Vercel's build log shows pnpm and the pinned Node version. |
| P2-AC8 | `.env.example` matches plan §7 exactly.                                                                                       |

## 6. Open questions

| Question                                                   | Default if unanswered                                                                                                |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| TypeScript 7 support in `typescript-eslint` (plan risk R1) | Check at install time. If it isn't supported, pin the newest supported TypeScript version and note it in the README. |
| ESLint 10 support in `eslint-config-next` 16               | Use whatever ESLint major `eslint-config-next` lists as a peer dependency.                                           |
| Keep the 2024 CSP?                                         | Yes, updated: drop `giscus.app`, add the PostHog hosts in Phase 7.                                                   |
