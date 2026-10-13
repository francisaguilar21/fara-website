# Phase 2: Scaffold & tooling · Tasks

Specs: [phase-2.specs.md](./phase-2.specs.md)

Same branch and PR as [Phase 1](../phase-1-specs/phase-1.tasks.md). One commit per group below.

## Scaffold: `build: scaffold Next.js app with pnpm`

- [x] **P2-T01** · Claude · Add `.nvmrc` (current LTS), `packageManager` and `engines.node` → P2-R1
- [x] **P2-T02** · Claude · Generate the app in a temp folder and copy it in ([specs §4.1](./phase-2.specs.md#41-scaffolding)).
      Remove the demo assets. → P2-R2, P2-R3
- [x] **P2-T03** · Claude · Make `tsconfig.json` strict, add `noUncheckedIndexedAccess` and the `@/*` alias → P2-R2
- [x] **P2-T04** · Claude · Port the 2024 security headers into `next.config.ts` (CSP updated, `giscus.app` removed) → P2-R2
- [x] **P2-T05** · Claude · Minimal `app/layout.tsx` and `app/page.tsx` placeholder ("New site in progress") → P2-R13

## Maintenance mode: `refactor(maintenance): move middleware to Next.js 16 proxy`

- [x] **P2-T06** · Claude · Rename `middleware.ts` → `proxy.ts` and the exported `middleware` → `proxy`.
      Keep the matcher and `lib/maintenance/` unchanged. → P2-R10
- [x] **P2-T07** · Claude · Check locally: with `MAINTENANCE_MODE=on` you get the 503 page, the bypass cookie
      works, and static assets still load → P2-R10

## Code quality: `build: add ESLint, Prettier, Husky, commitlint and Commitizen`

- [x] **P2-T08** · Claude · `eslint.config.mjs` (flat config with `jsx-a11y` and Prettier). Resolve the ESLint and
      TypeScript version questions in specs §6. → P2-R4
- [x] **P2-T09** · Claude · `prettier.config.mjs` + Tailwind plugin. Run `pnpm format` once. → P2-R5
- [x] **P2-T10** · Claude · Husky + `lint-staged` (pre-commit) and commitlint (commit-msg) → P2-R6
- [x] **P2-T11** · Claude · `commitlint.config.ts` with the scope enum and the cz-git prompt. Add `pnpm commit`. → P2-R7

## Tests: `test: set up Vitest and Playwright`

- [x] **P2-T12** · Claude · `vitest.config.ts`, `tests/unit/maintenance-flag.test.ts`,
      `tests/unit/maintenance-proxy.test.ts` → P2-R8, P2-R10
- [x] **P2-T13** · Claude · `playwright.config.ts` + `tests/e2e/smoke.spec.ts` → P2-R8

## CI & repo: `ci: add GitHub Actions workflow and PR template`

- [x] **P2-T14** · Claude · `.github/workflows/ci.yml` ([specs §4.5](./phase-2.specs.md#45-ci)) → P2-R9
- [x] **P2-T15** · Claude · `.github/pull_request_template.md` with a "Spec IDs" field → P2-R9
- [x] **P2-T16** · Claude · `.vscode/extensions.json` → P2-R12

## Docs: `docs: rewrite README and .env.example`

- [x] **P2-T17** · Claude · `.env.example` from plan §7 → P2-R11
- [x] **P2-T18** · Claude · `README.md` → P2-R12

## Vercel & merge

- [x] **P2-T19** · Francis · In Vercel, check that Install Command is left as the default (pnpm is detected) and
      that Node.js Version matches `.nvmrc` → P2-R14
- [ ] **P2-T20** · Claude · Run the full check locally (P2-AC1 to P2-AC4). Push and get CI green. → P2-AC5
- [ ] **P2-T21** · Francis · Review the preview (P2-AC6). Then do [P1-T08](../phase-1-specs/phase-1.tasks.md)
      and P1-T09 (flag on, then merge). → P2-AC7

## Done when

All of P2-AC1 to P2-AC8 in the specs pass.
