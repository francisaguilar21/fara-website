# Phase 1: Clean slate · Specs

| Status      | Depends on                             | Ships as                                                                | Effort  |
| ----------- | -------------------------------------- | ----------------------------------------------------------------------- | ------- |
| Not started | Phase 0 (flag created, keys in Vercel) | **One PR with Phase 2**: `chore: replace 2024 setup with 2026 scaffold` | 0.5 day |

References: [plan §2](../2026-revamp-plan.md#2-how-well-work), [Phase 2 specs](../phase-2-specs/phase-2.specs.md)

## 1. Goal

Remove the 2024 starter-blog setup and every dependency, so Phase 2 starts from an empty project.
Keep only the blog content, the brand assets, maintenance mode and the docs.

## 2. Scope

**In**

- Deleting files and folders
- Deciding exactly what stays

**Out**

- Moving or editing the blog posts (Phase 4)
- Regenerating favicons (Phase 3)
- Anything that adds files. Phase 2 does that in the same PR.

## 3. Requirements

| ID    | Requirement                                                                                                                                               |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1-R1 | Only the paths in §4.1 remain in the repo.                                                                                                                |
| P1-R2 | No dependency, lockfile or tool config from the 2024 site remains (yarn, Contentlayer, pliny, the old ESLint and Prettier configs, Husky v8-style hooks). |
| P1-R3 | Blog posts and their images keep their exact paths, so Phase 4 can preserve URLs.                                                                         |
| P1-R4 | Maintenance mode keeps working the whole time: the files in §4.1 stay, and Phase 2 rewires them.                                                          |
| P1-R5 | `main` never receives a commit that fails to build. Phase 1 is merged together with Phase 2.                                                              |
| P1-R6 | `is_maintenance_mode` is **on** in production before the combined PR is merged.                                                                           |
| P1-R7 | The deletions are kept as regular git history. Nothing is rewritten, so `v2024` and `v2024.1` stay valid.                                                 |

## 4. Technical design

### 4.1 Keep

| Path                                        | Why                                                             |
| ------------------------------------------- | --------------------------------------------------------------- |
| `data/blog/*.mdx`                           | The posts. Moved to `content/blog/` in Phase 4                  |
| `public/static/images/2301/`, `2401/`       | Images used in the posts. **Paths stay the same**               |
| `public/static/images/logo-*.png`           | The 4 logo variants                                             |
| `public/static/images/fara-dp.webp`         | Portrait                                                        |
| `public/static/images/fa-social-banner.png` | Fallback social image until generated OG images ship (Phase 4)  |
| `public/static/favicons/`                   | Until Phase 3 regenerates them from the SVG logo                |
| `middleware.ts`, `lib/maintenance/`         | Maintenance mode. Phase 2 renames `middleware.ts` to `proxy.ts` |
| `docs/2026-revamp-specs/`, `docs/LICENSE`   | Docs                                                            |
| `.github/ISSUE_TEMPLATE/`                   | Still useful                                                    |
| `.gitattributes`                            | Line-ending rules                                               |
| `.gitignore`                                | Replaced with the Next.js default in Phase 2                    |

### 4.2 Delete

| Group             | Paths                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App code          | `app/`, `components/`, `layouts/`, `css/`, `scripts/`                                                                                                                     |
| Old data & config | `data/*.ts`, `data/*.js`, `data/authors/`, `data/references-data.bib`, `data/logo.svg`, `app/tag-data.json` (inside `app/`)                                               |
| Build & tooling   | `contentlayer.config.ts`, `next.config.js`, `postcss.config.js`, `prettier.config.js`, `.eslintrc.js`, `.eslintignore`, `jsconfig.json`, `tsconfig.json`, `next-env.d.ts` |
| Package manager   | `package.json`, `yarn.lock`, `.yarnrc.yml`                                                                                                                                |
| Hooks & editor    | `.husky/`, `.vscode/`                                                                                                                                                     |
| Misc              | `.env.example` (rewritten in Phase 2), `renovate.json` (comes back in Phase 9), `docs/Troubleshooting.md`, `README.md` (rewritten in Phase 2)                             |

### 4.3 Expected tree after Phase 1 (before Phase 2 adds files)

```
.gitattributes  .gitignore
.github/ISSUE_TEMPLATE/
data/blog/*.mdx
docs/2026-revamp-specs/  docs/LICENSE
lib/maintenance/flag.ts  lib/maintenance/page.ts
middleware.ts
public/static/favicons/  public/static/images/
```

## 5. Acceptance criteria

| ID     | Criterion                                                                                                       |
| ------ | --------------------------------------------------------------------------------------------------------------- |
| P1-AC1 | `git ls-files` lists only the paths in §4.1, plus the files Phase 2 adds.                                       |
| P1-AC2 | `git diff --stat v2024.1 -- data/blog public/static` shows no changes to posts or images.                       |
| P1-AC3 | No `yarn`, `contentlayer`, `pliny` or `kbar` references remain (`git grep -i` comes back empty, docs excepted). |
| P1-AC4 | Production showed the maintenance page while the combined PR deployed (P1-R6).                                  |

## 6. Open questions

| Question                                   | Default if unanswered                                                                                                |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| Keep `.vscode/settings.json`?              | No. Phase 2 adds a small `.vscode/extensions.json` with recommended extensions (ESLint, Prettier, Tailwind) instead. |
| Keep the draft `000000-blog-template.mdx`? | Yes. Phase 4 renames it to `_template.mdx` and excludes it from the build.                                           |
