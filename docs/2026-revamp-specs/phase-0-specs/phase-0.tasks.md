# Phase 0: Prep · Tasks

Specs: [phase-0.specs.md](./phase-0.specs.md)

## Git

- [x] **P0-T01** · Francis · Tag `v2024` on `05edb13` and push it → P0-R1
- [x] **P0-T02** · Francis · Tag `v2024.1` on `0398fc8` (2024 site + security fix) and push it → P0-R2
  ```bash
  git fetch origin && git tag -a v2024.1 0398fc8 -m "v2024 + RSC security fix" && git push origin v2024.1
  ```

## Maintenance mode

- [x] **P0-T03** · Claude · Build `middleware.ts` and `lib/maintenance/` (PR #72) → P0-R3
- [x] **P0-T04** · Francis · In PostHog, create the boolean flag `is_maintenance_mode`. Release condition:
      100% of all users. Leave it **off**. → P0-R3
- [ ] **P0-T05** · Francis · In Vercel (Production + Preview), set `NEXT_PUBLIC_POSTHOG_KEY`,
      `MAINTENANCE_BYPASS_TOKEN`, and `NEXT_PUBLIC_POSTHOG_HOST` if the project is on EU cloud. Redeploy. → P0-R3, P0-R5
- [ ] **P0-T06** · Francis · At a quiet time, turn the flag on, check P0-AC2 and P0-AC4, then turn it off
      and check P0-AC3. The live site is down for about a minute during this check. → P0-R3

## Repository & Vercel

- [x] **P0-T07** · Francis · Protect `main` in GitHub: require a PR and the Vercel check before merging,
      and block force pushes. → P0-R4
- [ ] **P0-T08** · Francis · Check that Vercel builds a preview deployment for every PR (Git settings). → P0-R4

## Accounts & keys

Store every value in Vercel (Production + Preview), as listed in [specs §4.2](./phase-0.specs.md#42-accounts-and-credentials).

- [ ] **P0-T09** · Francis · Strava API app + refresh token (`read,activity:read`) → P0-R5
- [ ] **P0-T10** · Francis · Spotify developer app + refresh token → P0-R5
- [ ] **P0-T11** · Francis · GitHub fine-grained token (public repositories, read-only) → P0-R5
- [ ] **P0-T12** · Francis · Resend account, then add the SPF and DKIM records for `francisaguilar.co`
      until the domain shows **Verified** → P0-R5
- [ ] **P0-T13** · Francis · Cloudflare Turnstile widget (hostnames `francisaguilar.co`, `vercel.app`) → P0-R5
- [ ] **P0-T14** · Francis · Google Calendar appointment schedule (30 min, video call, Asia/Manila); copy
      the booking URL → P0-R5
- [ ] **P0-T15** · Francis · Optional: Upstash Redis database → P0-R5

## Content

- [ ] **P0-T16** · Francis · Go through plan §11 and give each item a target date. The Phase 5 items
      come first. → P0-R6

## Done when

All of P0-AC1 to P0-AC7 in the specs pass.
