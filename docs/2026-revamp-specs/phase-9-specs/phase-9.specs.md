# Phase 9: Post-launch · Specs

| Status      | Depends on         | Ships as                                                                                | Effort  |
| ----------- | ------------------ | --------------------------------------------------------------------------------------- | ------- |
| Not started | Phase 8 (launched) | Small independent PRs, plus PostHog setup; the first 2 weeks after launch, then ongoing | Ongoing |

References: [DESIGN §10](../design/DESIGN.md#10-analytics--feature-flags-posthog), [plan §8 risks R6, R9](../2026-revamp-plan.md#8-risks--mitigations)

## 1. Goal

Keep the new site healthy and current, and learn from real traffic: monitoring, automated dependency
updates, release automation, the first experiment, and a launch post. Also close the open loops
from the migration.

## 2. Scope

**In**

- Monitoring and dashboards
- Renovate
- release-please
- The `hero-headline` experiment
- Launch blog post
- Maintenance mode's long-term form
- Search recovery checks

**Out**

- New sections or pages. Those get their own spec folder (e.g. `phase-10-specs/`), using the same template.

## 3. Requirements

| ID    | Requirement                                                                                                                                                                                                                                                                                                                               |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P9-R1 | **Monitoring, first week**: daily check of PostHog (traffic, errors, events), Vercel Speed Insights (real-user LCP, INP, CLS) and Vercel logs (integration errors). Anything over budget gets an issue.                                                                                                                                   |
| P9-R2 | **PostHog dashboard** "Site health": pageviews by route, `cta_clicked` / `book_call_clicked` / `contact_submitted` funnel, top posts by `post_read` 75%, widget fallback rate (from server logs or a `widget_fallback` event).                                                                                                            |
| P9-R3 | **Renovate** back on: grouped weekly PRs; patch updates auto-merge when CI is green; minor and major updates are reviewed by hand; Next.js/React and ESLint each grouped; lockfile maintenance monthly.                                                                                                                                   |
| P9-R4 | **release-please** creates release PRs from conventional commits, maintains `CHANGELOG.md`, and tags `v2026.x.y` on merge.                                                                                                                                                                                                                |
| P9-R5 | **`hero-headline` experiment**: PostHog experiment with `control` = "I build software & run long distances." and 2 variants. Primary metric: `cta_clicked` (any hero CTA) per visitor. Secondary: `book_call_clicked`. Runs until PostHog reports significance or for 4 weeks, whichever comes first. The winner becomes `site.headline`. |
| P9-R6 | **Launch blog post** about the revamp (design, stack, maintenance flag, lessons), written from these specs and published under `/writings`.                                                                                                                                                                                               |
| P9-R7 | **Maintenance mode, long-term**: keep it as an operations switch, but stop the per-request network call. Either switch `lib/maintenance/flag.ts` to PostHog local evaluation, or move the switch to Vercel Edge Config. Decision recorded in this file.                                                                                   |
| P9-R8 | **Search recovery**: 2 and 6 weeks after launch, Search Console shows the 3 posts indexed with no new 404s or 503s. Any drop gets an issue.                                                                                                                                                                                               |
| P9-R9 | **Clean-up**: remove the `motion-rich` kill switch only if it was never needed in 4 weeks (or keep it, and record why); delete `MAINTENANCE_ALLOWED_PATHS` support if unused; close every TODO left from Phases 1–8.                                                                                                                      |

## 4. Technical design

### 4.1 Renovate (`renovate.json`)

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":semanticCommits", "group:monorepos"],
  "schedule": ["before 6am on monday"],
  "timezone": "Asia/Manila",
  "lockFileMaintenance": {
    "enabled": true,
    "schedule": ["before 6am on the first day of the month"]
  },
  "packageRules": [
    { "matchUpdateTypes": ["patch"], "automerge": true },
    {
      "groupName": "next + react",
      "matchPackageNames": [
        "next",
        "react",
        "react-dom",
        "eslint-config-next",
        "@types/react",
        "@types/react-dom"
      ]
    },
    {
      "groupName": "lint",
      "matchPackageNames": ["eslint", "typescript-eslint", "/^eslint-/", "prettier", "/^prettier-/"]
    }
  ]
}
```

### 4.2 release-please

`.github/workflows/release-please.yml` using `googleapis/release-please-action`, `release-type: node`,
starting at version `2026.0.0`. Tags `v2026.x.y` stay consistent with the launch tag.

### 4.3 Maintenance switch options (P9-R7)

| Option                                                            | Per-request cost                    | Change speed         | Extra dependency                                             |
| ----------------------------------------------------------------- | ----------------------------------- | -------------------- | ------------------------------------------------------------ |
| PostHog `/flags` call (current)                                   | Network call every 30s per instance | ~30s                 | None                                                         |
| PostHog local evaluation (`posthog-node`, polls flag definitions) | None (in-memory)                    | ~30s (poll interval) | `posthog-node` in the proxy, plus `POSTHOG_PERSONAL_API_KEY` |
| Vercel Edge Config                                                | ~0 (edge-replicated)                | Seconds              | `@vercel/edge-config`; the switch moves out of PostHog       |

Default: PostHog local evaluation, so the switch stays in PostHog as requested.

## 5. Acceptance criteria

| ID     | Criterion                                                                                                      |
| ------ | -------------------------------------------------------------------------------------------------------------- |
| P9-AC1 | Daily monitoring notes exist for the first 7 days, and issues are filed for anything over budget.              |
| P9-AC2 | The "Site health" dashboard exists in PostHog and is linked from the README.                                   |
| P9-AC3 | The first Renovate PRs open on schedule. A patch PR auto-merges after CI.                                      |
| P9-AC4 | A release-please PR exists. Merging it creates a tag and updates `CHANGELOG.md`.                               |
| P9-AC5 | The experiment ran and concluded. The decision and its numbers are recorded below. `site.headline` is updated. |
| P9-AC6 | The launch post is live.                                                                                       |
| P9-AC7 | The maintenance switch no longer makes a network call per request. The decision is recorded below.             |
| P9-AC8 | The Search Console checks at 2 and 6 weeks are recorded below.                                                 |

## 6. Decisions log

| Date | Decision | Notes |
| ---- | -------- | ----- |
|      |          |       |
