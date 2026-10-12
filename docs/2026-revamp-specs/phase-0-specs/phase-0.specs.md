# Phase 0: Prep · Specs

| Status      | Depends on | Ships as                                                       | Effort  |
| ----------- | ---------- | -------------------------------------------------------------- | ------- |
| In progress | Nothing    | Mostly account and dashboard work; maintenance mode was PR #72 | 0.5 day |

References: [plan §2.1](../2026-revamp-plan.md#21-maintenance-mode), [plan §7](../2026-revamp-plan.md#7-environment-variables), [plan §11](../2026-revamp-plan.md#11-content-checklist-francis)

## 1. Goal

Get everything ready that the build phases depend on: a way back to the 2024 site, a way to hide
production while `main` is half-built, the third-party accounts and keys, and the content request.

## 2. Scope

**In**

- `v2024` git tag
- Maintenance mode (code and PostHog flag)
- Branch protection and Vercel preview deployments
- Accounts and API keys for every integration in the design
- Sending the content checklist

**Out**

- Any change to the 2024 site beyond maintenance mode
- Writing integration code (Phase 7). This phase only gets the credentials.

## 3. Requirements

| ID    | Requirement                                                                                                   |
| ----- | ------------------------------------------------------------------------------------------------------------- |
| P0-R1 | The 2024 site can be restored from git: tag `v2024` exists on GitHub.                                         |
| P0-R2 | The restorable 2024 state includes the React Server Components security fix (`0398fc8`).                      |
| P0-R3 | Production can show a maintenance page, switched on and off from PostHog without a deploy (behavior in §4.1). |
| P0-R4 | `main` only accepts changes through PRs. Each PR gets a Vercel preview deployment.                            |
| P0-R5 | Every credential the later phases need exists and is stored in Vercel, never in git.                          |
| P0-R6 | Francis has the content checklist (plan §11) and a target date for each item.                                 |

## 4. Technical design

### 4.1 Maintenance mode (built in PR #72)

| Behavior         | Spec                                                                                                                                                                                                            |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Switch           | PostHog boolean flag `is_maintenance_mode`, release condition **100% of all users**. It's evaluated with a fixed `distinct_id` (`site-maintenance-check`), so a percentage rollout would act as all-or-nothing. |
| Precedence       | `MAINTENANCE_MODE=on\|off` env var → PostHog flag → off                                                                                                                                                         |
| Lookup           | `POST {NEXT_PUBLIC_POSTHOG_HOST}/flags?v=2` with the public project key. Reads both the `flags` and the legacy `featureFlags` response shapes. Default host `https://us.i.posthog.com`.                         |
| Cache            | 30 seconds per server instance. Turning the flag on or off takes up to about 30 seconds.                                                                                                                        |
| Failure          | Timeout after 1.5 seconds. Any error, timeout or missing key means **off** (fail open).                                                                                                                         |
| Response when on | `503` with a self-contained HTML page, `Retry-After: 86400` and `Cache-Control: no-store`                                                                                                                       |
| Skipped paths    | `_next/static`, `_next/image`, `static/`, `api/`, `favicon.ico`, `robots.txt`, `sitemap.xml`, `feed.xml`, `search.json`                                                                                         |
| Allowed paths    | `MAINTENANCE_ALLOWED_PATHS`: comma-separated prefixes. An exact or `prefix/…` match passes through.                                                                                                             |
| Owner bypass     | `/?preview=<MAINTENANCE_BYPASS_TOKEN>` sets an `HttpOnly; Secure; SameSite=Lax` cookie for 7 days and redirects to the same URL without the token                                                               |
| Files            | `middleware.ts`, `lib/maintenance/flag.ts`, `lib/maintenance/page.ts`                                                                                                                                           |

### 4.2 Accounts and credentials

| Service                  | What to create                                                                            | Stored as (Vercel env)                                                | Used in |
| ------------------------ | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------- |
| PostHog                  | Project (pick the US or EU region); flag `is_maintenance_mode`                            | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`                 | 0, 7    |
| Maintenance bypass       | Random string of 32+ characters (`openssl rand -hex 24`)                                  | `MAINTENANCE_BYPASS_TOKEN`                                            | 0       |
| Strava                   | API application; refresh token with `read,activity:read`                                  | `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN`    | 7       |
| Spotify                  | Developer app; refresh token with `user-read-currently-playing user-read-recently-played` | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | 7       |
| GitHub                   | Fine-grained token: public repositories, read-only                                        | `GITHUB_TOKEN`                                                        | 7       |
| Resend                   | Account; verify `francisaguilar.co` (SPF, DKIM records in DNS)                            | `RESEND_API_KEY`, `CONTACT_TO_EMAIL`                                  | 7       |
| Cloudflare Turnstile     | Widget for `francisaguilar.co` and `*.vercel.app`                                         | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`              | 7       |
| Google Calendar          | Appointment schedule: 30 min, video call, Asia/Manila                                     | `NEXT_PUBLIC_BOOKING_URL`                                             | 5       |
| Upstash Redis (optional) | Database for contact-form rate limiting                                                   | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`                  | 7       |

**One-time refresh tokens**

- **Strava**
  1. Open `https://www.strava.com/oauth/authorize?client_id=<ID>&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=read,activity:read`.
  2. Copy the `code` parameter from the redirect URL.
  3. `POST https://www.strava.com/oauth/token` with `client_id`, `client_secret`, `code` and
     `grant_type=authorization_code`. Keep the `refresh_token` from the response.
- **Spotify**
  1. In the app settings, add the redirect URI `http://127.0.0.1:3000/callback`. Spotify no longer
     accepts `localhost`.
  2. Open `https://accounts.spotify.com/authorize?client_id=<ID>&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&scope=user-read-currently-playing%20user-read-recently-played`.
  3. Copy the `code` parameter.
  4. `POST https://accounts.spotify.com/api/token` with `Authorization: Basic base64(id:secret)`,
     `grant_type=authorization_code`, the `code` and the same `redirect_uri`. Keep the `refresh_token`.

Store each value for the **Production** and **Preview** environments in Vercel. Don't add them to
`.env.example` values or commit them anywhere.

## 5. Acceptance criteria

| ID     | Criterion                                                                                                                                   |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| P0-AC1 | `git ls-remote --tags origin` lists `v2024` (and `v2024.1` if created).                                                                     |
| P0-AC2 | With the flag **on**, `curl -I https://francisaguilar.co/` returns `503` and the maintenance page; `/static/...` assets still return `200`. |
| P0-AC3 | With the flag **off**, the 2024 site returns `200`.                                                                                         |
| P0-AC4 | `/?preview=<token>` sets the bypass cookie, and the real site loads while the flag is on.                                                   |
| P0-AC5 | A direct push to `main` is rejected. A PR shows a Vercel preview link.                                                                      |
| P0-AC6 | Every variable in §4.2 that is needed before Phase 7 is set in Vercel. The rest are set or have a date.                                     |
| P0-AC7 | The content checklist has an owner and a target date for each item.                                                                         |

## 6. Open questions

| Question                                                    | Default if unanswered                                 |
| ----------------------------------------------------------- | ----------------------------------------------------- |
| Is the PostHog project on US or EU cloud?                   | US (`https://us.i.posthog.com`)                       |
| Add `v2024.1` on `0398fc8`?                                 | Yes. It makes the safe rollback point easy to find.   |
| Use Upstash for rate limiting, or a simple in-memory limit? | In-memory to start. Add Upstash if spam gets through. |
