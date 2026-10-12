# Phase 8: QA & launch · Specs

| Status      | Depends on | Ships as                                                               | Effort   |
| ----------- | ---------- | ---------------------------------------------------------------------- | -------- |
| Not started | Phases 1–7 | 2 PRs (quality gates in CI, then fixes) + the launch runbook (no code) | 1–2 days |

References: [plan §9](../2026-revamp-plan.md#9-rollback), [plan §10](../2026-revamp-plan.md#10-definition-of-done-launch), [DESIGN §11 quality budgets](../design/DESIGN.md#11-tech-stack)

## 1. Goal

Prove the site is accessible, fast, correct and complete, lock those properties into CI, and launch
by turning the maintenance flag off, with a tested way back.

## 2. Scope

**In**

- Accessibility, performance and SEO audits and fixes
- Lighthouse CI and Playwright in CI
- Cross-browser checks
- The content and draft gate
- The launch runbook

**Out**

- New features, including design changes not needed for a fix (Phase 9 or later)

## 3. Requirements

| ID    | Requirement                                                                                                                                                                                                                                                                          |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| P8-R1 | **Accessibility (WCAG 2.2 AA)**: axe reports no violations on every route in both themes. Full keyboard operation. Visible focus. Skip link. Alt text on all images. Contrast checked. Works at 200% zoom. Screen-reader pass (VoiceOver iOS + macOS) on home, a post and `/work`.   |
| P8-R2 | **Performance budgets**, enforced by Lighthouse CI on every PR against the preview: mobile Performance ≥ 95; Accessibility, SEO and Best Practices = 100; LCP < 2.0s; CLS < 0.05; TBT < 200ms; home route JS < 120 kB gzipped. Real-user INP < 150ms is monitored in Phase 9.        |
| P8-R3 | **End-to-end tests in CI** (Playwright, Chromium + WebKit): every route returns 200, unknown routes return 404, 2024 redirects return 308, theme toggle persists, contact form happy path (mocked Turnstile and Resend), maintenance on/off/bypass, reduced-motion snapshot of home. |
| P8-R4 | **Browsers**: Safari iOS (latest 2), Chrome Android, desktop Safari, Chrome, Firefox and Edge, each with reduced motion on and off. Issues logged and fixed or accepted.                                                                                                             |
| P8-R5 | **Content gate**: `pnpm check:drafts` passes (no draft entries, no sample data in use), and runs in CI on PRs labelled `launch`. Copy is proofread. Every image has alt text.                                                                                                        |
| P8-R6 | **SEO**: unique titles and descriptions, canonical URLs, OG images on every route, `sitemap.xml` complete, `robots.txt` allows indexing, JSON-LD valid, all 2024 URLs return 200 or 308.                                                                                             |
| P8-R7 | **Launch**: done with the flag only, following the runbook (§4.3). No deploy happens during launch.                                                                                                                                                                                  |
| P8-R8 | **Rollback** is rehearsed once on a preview before launch (§4.4).                                                                                                                                                                                                                    |

## 4. Technical design

### 4.1 CI additions

```yaml
# .github/workflows/ci.yml (added jobs)
e2e:
  needs: check
  steps:
    [
      checkout,
      pnpm,
      node,
      install,
      'pnpm exec playwright install --with-deps chromium webkit',
      'pnpm build',
      'pnpm test:e2e',
    ]
lighthouse:
  if: github.event_name == 'pull_request'
  # waits for the Vercel preview URL (deployment_status event or vercel/wait-for-deployment action),
  # then runs @lhci/cli autorun with lighthouserc.json budgets; bypass cookie passed via extraHeaders
drafts:
  if: contains(github.event.pull_request.labels.*.name, 'launch')
  steps: [checkout, pnpm, node, install, 'pnpm check:drafts']
```

`lighthouserc.json` covers `/`, `/blog/240108-posthog-over-google-analytics`, `/work`,
`/life/running` and `/projects`, with the assertions in P8-R2.

### 4.2 Audit checklist (copy into the QA PR)

| Area    | Check                                                           | Tool                                                          |
| ------- | --------------------------------------------------------------- | ------------------------------------------------------------- |
| a11y    | No violations, every route, both themes                         | `@axe-core/playwright` in the e2e suite                       |
| a11y    | Keyboard path through header, timeline, carousel, gallery, form | Manual                                                        |
| a11y    | VoiceOver pass                                                  | Manual                                                        |
| perf    | Budgets                                                         | Lighthouse CI                                                 |
| perf    | Bundle sizes per route                                          | `next build` output                                           |
| SEO     | Titles, descriptions, canonical, OG                             | `scripts/seo-audit.ts` (crawls the sitemap, asserts the tags) |
| SEO     | Structured data                                                 | Google Rich Results Test                                      |
| SEO     | 2024 URLs                                                       | Playwright redirect test                                      |
| content | Drafts and samples                                              | `pnpm check:drafts`                                           |
| content | Spelling and grammar                                            | Manual read-through by Francis                                |

### 4.3 Launch runbook

| Step | Who     | Action                                                                                                 | Check                                                         |
| ---- | ------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| 1    | Claude  | Confirm `main` is green, the `launch` PR passed `check:drafts`, Lighthouse is within budget            | CI                                                            |
| 2    | Francis | With the bypass cookie, click through every page in production                                         | Visual                                                        |
| 3    | Claude  | Run the Playwright smoke suite against production with the bypass cookie                               | All pass                                                      |
| 4    | Francis | PostHog: turn `is_maintenance_mode` **off**                                                            | Within ~30s, `curl -I https://francisaguilar.co/` returns 200 |
| 5    | Francis | Vercel: clear `MAINTENANCE_ALLOWED_PATHS` (no redeploy needed; it only matters when maintenance is on) | —                                                             |
| 6    | Claude  | Smoke suite against production without the cookie                                                      | All pass                                                      |
| 7    | Francis | Search Console: resubmit the sitemap; request indexing for `/` and `/work`                             | —                                                             |
| 8    | Claude  | Tag `v2026.0.0` on the launched commit and push                                                        | `git ls-remote --tags`                                        |
| 9    | Francis | Announce (LinkedIn, X)                                                                                 | —                                                             |

### 4.4 Rollback rehearsal (on a preview)

1. Set `MAINTENANCE_MODE=on` on a preview and confirm the 503 page.
2. Remove it and confirm the site is back.
3. In Vercel, run Instant Rollback on a preview alias and confirm it serves the previous deployment.

## 5. Acceptance criteria

| ID     | Criterion                                                                                   |
| ------ | ------------------------------------------------------------------------------------------- |
| P8-AC1 | axe: no violations on every route in both themes (CI).                                      |
| P8-AC2 | Lighthouse CI budgets pass on all 5 audited routes.                                         |
| P8-AC3 | Playwright e2e suite passes in CI on Chromium and WebKit.                                   |
| P8-AC4 | Browser matrix completed; no open blocker issues.                                           |
| P8-AC5 | `pnpm check:drafts` exits 0 on `main`.                                                      |
| P8-AC6 | SEO audit script passes. Rich Results Test valid. Every 2024 URL returns 200 or 308.        |
| P8-AC7 | Rollback rehearsal done (§4.4).                                                             |
| P8-AC8 | Runbook steps 1–9 completed. Production returns 200 without the cookie. `v2026.0.0` exists. |
| P8-AC9 | Every item in plan §10 (definition of done) is ticked.                                      |

## 6. Open questions

| Question                                                         | Default if unanswered                                                   |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Launch day and time?                                             | A weekday morning Manila time, so there's a full day to watch it.       |
| Launch with missing content (e.g. fewer than 2 recommendations)? | Yes. Hide the empty block rather than show placeholders (plan risk R7). |
| Keep Lighthouse CI after launch?                                 | Yes, on every PR.                                                       |
