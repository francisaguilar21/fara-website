# Phase 1: Clean slate · Tasks

Specs: [phase-1.specs.md](./phase-1.specs.md)

These tasks are the **first commits of the combined Phase 1 + 2 PR**. Don't open a PR with only
these commits, because `main` would stop building.

## Before starting

- [ ] **P1-T01** · Claude · Branch from the latest `main`. Check that `v2024` and `v2024.1` exist on the remote. → P1-R7

## Delete (one commit: `chore: remove 2024 site setup`)

- [ ] **P1-T02** · Claude · Delete the app code: `app/`, `components/`, `layouts/`, `css/`, `scripts/` → P1-R1
- [ ] **P1-T03** · Claude · Delete the old data and config listed in [specs §4.2](./phase-1.specs.md#42-delete).
      Keep `data/blog/`. → P1-R1, P1-R3
- [ ] **P1-T04** · Claude · Delete the build, tooling and package-manager files (`package.json`, `yarn.lock`,
      `.yarnrc.yml`, configs) → P1-R2
- [ ] **P1-T05** · Claude · Delete `.husky/`, `.vscode/`, `.env.example`, `renovate.json`,
      `docs/Troubleshooting.md`, `README.md` → P1-R1
- [ ] **P1-T06** · Claude · Run the checks in P1-AC1 to P1-AC3 and paste the output into the PR description → P1-R1, P1-R3

## Continue with Phase 2

- [ ] **P1-T07** · Claude · Continue with the [Phase 2 tasks](../phase-2-specs/phase-2.tasks.md) on the same branch → P1-R5

## Merge (after Phase 2 tasks are done)

- [ ] **P1-T08** · Francis · Turn `is_maintenance_mode` **on** in PostHog, then check that production shows
      the maintenance page → P1-R6
- [ ] **P1-T09** · Francis · Merge the combined PR. Check that production still shows the maintenance page and
      the bypass link shows the new scaffold → P1-R4, P1-R6

## Done when

All of P1-AC1 to P1-AC4 in the specs pass.
