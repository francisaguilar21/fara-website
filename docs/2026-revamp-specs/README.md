# 2026 Revamp Specs

Everything about the 2026 rebuild of francisaguilar.co lives in this folder.

| File / folder                                  | What it answers                                                                         |
| ---------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`2026-revamp-plan.md`](./2026-revamp-plan.md) | Why, in what order, how we work, risks, rollback, launch criteria                       |
| [`design/DESIGN.md`](./design/DESIGN.md)       | What it looks like and how it behaves (brand, pages, motion, stack)                     |
| [`design/mockup.html`](./design/mockup.html)   | The homepage as a clickable mockup (the visual reference)                               |
| `phase-N-specs/phase-N.specs.md`               | What one phase must deliver: scope, requirements, technical design, acceptance criteria |
| `phase-N-specs/phase-N.tasks.md`               | How to deliver it: an ordered checklist, split into PRs                                 |

## Phases

| Phase | Name                        | Specs                                     | Tasks                                     | Status      |
| ----- | --------------------------- | ----------------------------------------- | ----------------------------------------- | ----------- |
| 0     | Prep                        | [specs](./phase-0-specs/phase-0.specs.md) | [tasks](./phase-0-specs/phase-0.tasks.md) | In progress |
| 1     | Clean slate                 | [specs](./phase-1-specs/phase-1.specs.md) | [tasks](./phase-1-specs/phase-1.tasks.md) | Not started |
| 2     | Scaffold & tooling          | [specs](./phase-2-specs/phase-2.specs.md) | [tasks](./phase-2-specs/phase-2.tasks.md) | Not started |
| 3     | Design system               | [specs](./phase-3-specs/phase-3.specs.md) | [tasks](./phase-3-specs/phase-3.tasks.md) | Not started |
| 4     | Content layer & blog parity | [specs](./phase-4-specs/phase-4.specs.md) | [tasks](./phase-4-specs/phase-4.tasks.md) | Not started |
| 5     | Homepage                    | [specs](./phase-5-specs/phase-5.specs.md) | [tasks](./phase-5-specs/phase-5.tasks.md) | Not started |
| 6     | Inner pages                 | [specs](./phase-6-specs/phase-6.specs.md) | [tasks](./phase-6-specs/phase-6.tasks.md) | Not started |
| 7     | Integrations                | [specs](./phase-7-specs/phase-7.specs.md) | [tasks](./phase-7-specs/phase-7.tasks.md) | Not started |
| 8     | QA & launch                 | [specs](./phase-8-specs/phase-8.specs.md) | [tasks](./phase-8-specs/phase-8.tasks.md) | Not started |
| 9     | Post-launch                 | [specs](./phase-9-specs/phase-9.specs.md) | [tasks](./phase-9-specs/phase-9.tasks.md) | Not started |

Phases 1 and 2 have separate folders but **ship in one PR**, because every merge to `main` deploys
to production and `main` must always build.

## Conventions

**IDs.** Every item has an ID so PRs, commits and reviews can point at it.

| Prefix   | Meaning              | Example  | Lives in           |
| -------- | -------------------- | -------- | ------------------ |
| `PN-R#`  | Requirement          | `P3-R2`  | `phase-N.specs.md` |
| `PN-AC#` | Acceptance criterion | `P3-AC4` | `phase-N.specs.md` |
| `PN-T##` | Task                 | `P3-T07` | `phase-N.tasks.md` |

Reference them in PR descriptions ("Implements P3-R2, closes P3-T05–P3-T07"). Commit messages stay
conventional (`feat(design): add Logo component`) and don't need IDs.

**Specs files** use the same sections in every phase:

1. Summary: status, dependencies, how it ships, effort
2. Goal
3. Scope: in and out
4. Requirements (`PN-R#`)
5. Technical design: files, config, interfaces
6. Acceptance criteria (`PN-AC#`)
7. Open questions

**Tasks files** list tasks in the order to do them, grouped by PR:

```md
- [ ] **P3-T05** · Claude · Build `<Logo />` as an SVG using `currentColor` → P3-R3
```

- The owner is **Francis** (accounts, content, decisions, anything behind a login) or **Claude**
  (code and docs).
- `→ PN-R#` links the task to the requirement it satisfies.
- Tick the box in the same PR that completes the task. When a phase's tasks are all ticked and its
  acceptance criteria pass, update the status column above.

**Source of truth.** If a phase spec and `DESIGN.md` disagree, `DESIGN.md` wins. Fix the spec in the
same PR.
