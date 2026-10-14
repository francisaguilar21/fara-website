# Phase 4 + 5 review: decisions and test checklist

Written 2026-10-14 after going through all six open PRs. Use this to (1) test everything in one go,
(2) make the decisions the PRs left open, and (3) merge. Tick the boxes as you go.

## 1. What exists

`main` already has the LICENSE removal (#75) and Phase 4 PR 1, the content layer (#76).

| PR                                                                          | What it adds                                                                                                                                 | Stacked on |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| [#77](https://github.com/francisaguilar21/fara-website/pull/77) (P4 PR 2)   | `/writings`, `/writings/[slug]`, `/writings/tags/[tag]`, MDX components, code highlighting, page metadata                                    | `main`     |
| [#80](https://github.com/francisaguilar21/fara-website/pull/80) (P4 PR 3)   | `/rss.xml`, `/sitemap.xml`, `/robots.txt`, generated OG images, 2024 URL redirects                                                           | #77        |
| [#78](https://github.com/francisaguilar21/fara-website/pull/78) (P5 PR 1)   | Homepage hero, now strip, sample integration data, `pnpm check:drafts`, header anchors, `Parallax` fix                                       | `main`     |
| [#79](https://github.com/francisaguilar21/fara-website/pull/79) (P5 PR 2)   | Scroll-drawn timeline (`#work`)                                                                                                              | #78        |
| [#81](https://github.com/francisaguilar21/fara-website/pull/81) (P5 PR 3)   | Projects rows with cursor preview (`#projects`), life grid: running, community, gallery, building (`#life`)                                  | #79        |
| [#82](https://github.com/francisaguilar21/fara-website/pull/82) (P5 PR 4)   | Stack, proof (carousel + certifications), latest posts, GitHub heatmap, contact; performance fixes; swaps Motion scroll hooks for a listener | #81        |
| [#83](https://github.com/francisaguilar21/fara-website/pull/83) (test only) | `main` + all of the above in one branch, so one preview shows everything. **Never merge it.**                                                | n/a        |

The two chains (P4: #77 → #80, P5: #78 → #79 → #81 → #82) don't depend on each other for review.
They only touch the same file in one place: `app/page.tsx` (see §2).

## 2. State of the PRs

- **CI:** `check` was green on #77–#82 before the D5/D7/D16 changes. Re-check it on the new commits.
- **Combined tree (#83):** `main` + #80 (which includes #77) + #82 (which includes #78, #79, #81). Merging the two
  chains conflicts in `app/page.tsx`, `components/layout/nav.ts`, `playwright.config.ts`, the plan's env table
  and the Phase 4 specs table. All five are resolved in #83 (details in its merge commit). On that tree
  `pnpm lint`, `typecheck`, `format:check`, `test` (307 unit tests) and `build` pass, and Playwright passes
  109 of 109. One keyboard-focus test failed once under load and passed on re-run (timing, not code).
- **Not checked by anyone yet:** the Vercel previews, screenshots against the mockup, real devices,
  screen readers, Lighthouse after the D5/D7/D16 changes. That is what §4 is for.

## 3. Decisions

Each item has a recommendation. Reply with the numbers you want changed.

### Phase 4

| #   | Decision                                                                                                                                                                                                                                                                                                                                                                                                   | Recommendation                                                              |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| D1  | **PostHog post scores 92 on Lighthouse SEO** (P4-AC10): two links read just "here". Fixing them edits the post text, which P4-R5 forbids. Suggested wording: "the inaugural post", "this sample from the PostHog team".                                                                                                                                                                                    | Fix the two link texts. It's your own post, and the wording barely changes. |
| D2  | **Mobile performance on posts is 92–97** against the 95 target. It comes from the shared page shell, not the posts. Local lab run, not Vercel.                                                                                                                                                                                                                                                             | Accept for now; re-measure on Vercel; tune in Phase 8.                      |
| D3  | **Cover image.** Spec P4-R8 wants a cover on the post page, but all three posts already start with their banner in the body. The page renders its own cover only when the body lacks it (today: never).                                                                                                                                                                                                    | Keep as is.                                                                 |
| D4  | **Several `h1`s per post.** Post bodies use `#` headings, so each post has more than one `h1`. Demoting them is a one-line plugin; the content stays untouched.                                                                                                                                                                                                                                            | Demote with the plugin (better for SEO and accessibility).                  |
| D5  | **Decided: the route is `/writings`** (was `/blog`), with the eyebrow `/writings` and the same name in the nav. Old `/blog/*` URLs redirect permanently (308) to `/writings/*`, because the 2024 post URLs are indexed. The internal content folder stays `content/blog/`.                                                                                                                                 | Done by the Phase 4 agent in #77 and #80.                                   |
| D6  | **Tag pagination (`/tags/:tag/page/:n`) is not redirected.** The specs list five redirects, and the agent couldn't check what the 2024 site served.                                                                                                                                                                                                                                                        | Leave unless Search Console shows those URLs.                               |
| D7  | **Decided: drafts must not appear on the site.** Every content getter (not just posts) drops `draft: true` entries when `VERCEL_ENV=production` (or `HIDE_DRAFTS=1`), and no draft chip renders there. Vercel previews and local runs still show drafts with chips so you can review layout. Result: until real content replaces the placeholders, the production homepage shows only the non-draft parts. | Done by the Phase 5 agent in #78 onwards.                                   |
| D8  | **Two extra OG images** (`/writings` and each tag page), so every blog page keeps a public image while `MAINTENANCE_ALLOWED_PATHS=/writings,/rss.xml` is active.                                                                                                                                                                                                                                           | Keep.                                                                       |
| D9  | **`NEXT_PUBLIC_SITE_URL` falls back to `https://francisaguilar.co`** when unset, so a missing variable can't put localhost into the feed or sitemap.                                                                                                                                                                                                                                                       | Keep; still set the variable in Vercel.                                     |
| D10 | **OG card titles drop emoji** ("Hello World! 👋" shows as "Hello World!").                                                                                                                                                                                                                                                                                                                                 | Keep.                                                                       |
| D11 | **Spec deviations:** `next.config.ts` exports an async function (top-level `await` breaks Next 16.4); Velite assets go to `public/static/velite` (its `clean` would wipe the post images); a custom date check so errors name the file and field.                                                                                                                                                          | Keep. The specs are updated.                                                |

### Phase 5

| #   | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                  | Recommendation                                                                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| D12 | **Timeline dim state.** The mockup fades unlit entries to 60% opacity; axe reports that as a contrast failure (P5-AC6). Entries now dim by color (title goes muted) and slide 10px.                                                                                                                                                                                                                                                       | Keep. Look at it in §4 and say if you want the mockup look on the title only.                    |
| D13 | **Motion's `useScroll`/`useSpring` replaced** by a small scroll listener (`lib/use-scroll-progress.ts`): about 8 kB gzipped less JavaScript, and the timeline measures every scroll frame. Spec §4.3 is updated.                                                                                                                                                                                                                          | Keep unless the scroll feel is off in §4.                                                        |
| D14 | **Contact isn't wrapped in `<Section>`.** It follows the mockup's two-column layout. Spec updated.                                                                                                                                                                                                                                                                                                                                        | Keep.                                                                                            |
| D15 | **Contact form stub message** still says "Nothing was sent: the form isn't connected yet. Book a call instead." With `NEXT_PUBLIC_BOOKING_URL` unset there is no booking card to point at (D16).                                                                                                                                                                                                                                          | Change it to "Try again later" until the URL and Phase 7 exist, or set the URL first. Your call. |
| D16 | **Decided: the booking URL comes from `NEXT_PUBLIC_BOOKING_URL`.** `bookingUrl` is removed from the content file. With the variable unset, the second hero button becomes "Send a message" (to `#contact`) and the booking card is left out, so there's no dead link. Set it in Vercel (Production and Preview). It is inlined at build time, so redeploy after setting it.                                                               | Done by the Phase 5 agent.                                                                       |
| D17 | **Placeholder content.** `pnpm check:drafts` lists the draft entries, the sample integrations and the unset booking URL. Because drafts are hidden in production (D7), the production homepage currently has no projects, gallery, building tile, timeline, certifications or talks, and the life section is just the running and community tiles, both on **sample** data (the `sample` chips stay until Phase 7). P5-T01–T04 are yours. | Send the content when you have it; nothing blocks merging.                                       |
| D18 | **New dependencies:** `sharp` (blur placeholders for content images), `tsx` (dev, runs `check:drafts`), `@fontsource/space-grotesk` (dev, OG card font).                                                                                                                                                                                                                                                                                  | OK.                                                                                              |
| D19 | **Starter gallery photos** are the five crops already embedded in the mockup, saved to `public/static/images/gallery/`, still `draft: true`. One P4 unit test was relaxed because the gallery now contains race photos.                                                                                                                                                                                                                   | OK; replace with your photos in Phase 6.                                                         |
| D20 | **Copy and data choices:** the intro is not bolded (the `site.intro` field is a plain string); the three hero roles live in `components/home/hero-roles.ts` (the schema has no field); the hero label shows the city plus coordinates.                                                                                                                                                                                                    | OK; revisit when Phase 6 touches `site`.                                                         |
| D21 | **Not built** (the spec doesn't require them): heatmap diagonal fade-in, number count-ups, cursor-preview tilt.                                                                                                                                                                                                                                                                                                                           | Skip for now.                                                                                    |
| D22 | **Links to pages that don't exist yet.** The header, footer and cards link to `/work`, `/life`, `/now`, `/uses`, `/contact`, `/projects/[slug]` and `/life/building` (Phase 6). On the homepage the nav uses anchors, but other links 404.                                                                                                                                                                                                | OK on a gated site. It must be fixed before the maintenance page comes down.                     |
| D23 | **P5-T25: Lighthouse on the Vercel preview** with the bypass cookie wasn't run. Local runs scored 93–95 performance and 100 on the rest. The first run of the finished page scored 81 before the performance fixes in #82.                                                                                                                                                                                                                | Run it once on the #83 preview.                                                                  |

### Cross-cutting

| #   | Decision                                                                                                                                                                                                                                                                                                                           | Recommendation                                                                                                         |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| D24 | **Decided: merge commits**, in the order in §5.                                                                                                                                                                                                                                                                                    | Merge when you've tested #83.                                                                                          |
| D25 | **Decided: a proprietary license.** `LICENSE` (root of the repo, in this PR) is "All rights reserved": viewing is allowed; copying, reusing, extending, republishing, redistributing or hosting the Work is not. Third-party dependencies keep their own licenses. `package.json` says `UNLICENSED` and the README links the file. | Done. Not legal advice; have a lawyer look if it matters. GitHub's terms still let anyone view and fork a public repo. |
| D26 | **Vercel settings after merge:** `MAINTENANCE_ALLOWED_PATHS=/writings,/rss.xml` (P4-T17), `NEXT_PUBLIC_BOOKING_URL` (D16), `NEXT_PUBLIC_SITE_URL=https://francisaguilar.co`. Then Search Console: submit `/sitemap.xml` (P4-T19).                                                                                                  | Do both after #80 merges.                                                                                              |
| D27 | **PostHog post link.** The first "here" link in the post points at `francisaguilar.co/blog/...`. It works through the redirect, but it's an extra hop. Fixing the two link texts (D1) is a good time to point it at `/writings/...`.                                                                                               | Include in the D1 edit.                                                                                                |

## 4. Test checklist (one pass)

### Setup

- [ ] Open the Vercel preview of [#83](https://github.com/francisaguilar21/fara-website/pull/83)
      (it is in that PR's Vercel comment). If it shows the maintenance page, visit
      `/?preview=<MAINTENANCE_BYPASS_TOKEN>` once (sets a 7-day cookie).
- [ ] Or run it locally: `git fetch && git checkout claude/integration-p4-p5 && pnpm install && pnpm dev`.
- [ ] Test in dark (the default) and light, at about 1440px wide and on your phone (or a 390px window).

### Homepage (`/`): hero and now strip (#78)

- [ ] The headline is the only `h1`; lines rise in and the rose underline draws on load.
- [ ] The portrait is gray, turns to color on hover, and moves slightly as you scroll.
- [ ] The hero CTAs have the magnetic pull; "Let's talk" jumps to the contact section.
- [ ] The three roles (`/work`, `/build`, `/run`) show, with a draft chip on the missing employer.
- [ ] The now strip scrolls, pauses on hover and on keyboard focus, and has no gap on a wide screen.
- [ ] Header links on the homepage scroll to sections (`#work`, `#life`, `#writing`, `#now`, `#contact`).
- [ ] With the OS set to "reduce motion": the strip is a static row and nothing animates in.

### Timeline (#79)

- [ ] Scrolling draws the line and lights the dots in order; scrolling up turns them off.
- [ ] The sticky year on the left changes with the active entry (desktop).
- [ ] On the phone the years sit above each role and the line is on the left.
- [ ] Unlit entries look acceptable (D12). Jumping with an anchor link or the End key doesn't leave dots stale.
- [ ] "Full timeline →" is present (it 404s until Phase 6; that's expected).

### Projects and life (#81)

- [ ] Three project rows: the title slides right in rose, the arrow turns, and a cover preview follows the cursor (mouse only; none on touch).
- [ ] Running tile: stats, 12-week bars drawn to scale, last run, `sample` chip.
- [ ] Community tile: three talks and the Spotify card with a `sample` chip.
- [ ] Gallery: five photos with captions, a slight parallax, draft chips on captions.
- [ ] Building tile: the pull quote has a rose emphasis and a `copy` draft chip.

### Rest of the homepage (#82)

- [ ] Stack grid: three columns, then two, then one; a rose `/` appears for the hovered group.
- [ ] Recommendations carousel: arrow keys, swipe or drag, and the dots (labelled "Recommendation 2 of 3…") all work.
- [ ] Certifications list renders.
- [ ] Latest posts shows the 3 posts; "All posts →" goes to `/writings`.
- [ ] GitHub heatmap: tooltip shows date and count; on the phone it scrolls sideways inside its own box, not the page.
- [ ] Contact: the booking card button opens `site.bookingUrl` in a new tab. The form shows an inline error under each bad field and focuses the first one. A valid submit shows the "Nothing was sent" message (D15).
- [ ] Keyboard only: Tab through the whole page. Every stop shows a visible focus ring.
- [ ] No horizontal page scroll at 360px.
- [ ] Compare with `docs/2026-revamp-specs/design/mockup.html` side by side (P5-AC1), section by section.
- [ ] Lighthouse (mobile) on the preview. Target 95 performance (D23).

### Writings (#77)

- [ ] `/writings` lists the 3 posts with date, title, summary, reading time and tags.
- [ ] Each post opens and reads right, images load without the page jumping, and code blocks follow the light/dark theme.
- [ ] Heading anchors, previous/next links and "back to blog" work. (D3, D4: note the cover and the `h1` count.)
- [ ] A tag page (`/writings/tags/technology`) filters correctly; a bad slug gives a 404.
- [ ] External links open in a new tab.
- [ ] Compare each post's text with the 2024 site (P4-AC1). The agent only compared against the MDX source.

### SEO plumbing (#80)

- [ ] `/rss.xml` loads as a feed with the 3 posts. Paste its URL into the [W3C feed validator](https://validator.w3.org/feed/) once deployed.
- [ ] `/sitemap.xml` and `/robots.txt` look right.
- [ ] `/opengraph-image` and a post's OG image show the F/A mark and the title (1200×630).
- [ ] These redirect permanently: `/tags/technology` → `/writings/tags/technology`, `/tags` → `/writings`, `/blog/page/2` → `/writings`, `/about` → `/`, `/feed.xml` → `/rss.xml`.
- [ ] The old 2024 URLs redirect (308): `/blog` → `/writings`, `/blog/tags/technology` → `/writings/tags/technology`, `/blog/240108-posthog-over-google-analytics` → `/writings/240108-posthog-over-google-analytics`.
- [ ] Paste a post URL into an OG preview tool once it is public.

### Draft hiding and booking URL (D7, D16)

- [ ] On the preview, drafts still show with their chips (that's expected there).
- [ ] Locally, run `HIDE_DRAFTS=1 pnpm build && pnpm start`. No draft chip appears anywhere, sections with no published entries are gone, and nothing errors.
- [ ] With `NEXT_PUBLIC_BOOKING_URL` set (Vercel, Preview), the hero and booking card open that URL in a new tab. Unset, they don't show a dead link.

### After merge (production)

- [ ] Set `NEXT_PUBLIC_BOOKING_URL` and `MAINTENANCE_ALLOWED_PATHS=/writings,/rss.xml` in Vercel (Production) and redeploy (P4-T17).
- [ ] `/writings` and `/rss.xml` are reachable in production; `/` still shows the maintenance page (P4-AC9).
- [ ] Submit `/sitemap.xml` in Google Search Console and check the post URLs (P4-T19).

## 5. Can they be merged?

**Yes.** All six PRs have green CI, and you chose merge commits (D24). Merge them in this order:
#77, #80, #78, #79, #81, #82.

1. **They are drafts.** Each needs "Ready for review" before it can merge.
2. **After each merge, retarget the next stacked PR to `main`** (#80 after #77; #79 after #78; #81 after
   #79; #82 after #81). With merge commits no conflicts are expected there.
3. **Conflicts between the two chains** (whichever merges second): `app/page.tsx`, `components/layout/nav.ts`,
   `playwright.config.ts`, the plan's env table and the Phase 4 specs table. #83 shows all five resolved:
   keep P4's `metadata` export, the `/writings` hrefs, both Playwright web servers with the pinned
   `NEXT_PUBLIC_SITE_URL`, and the Phase 5 sections.
4. **Merge #80 right after #77**: `/blog/*` URLs 404 on #77 alone, because the redirects live in #80.

**Every merge to `main` deploys to production.** Everything stays behind the maintenance page only while
maintenance mode is on in production. I can't see that PostHog flag, so please confirm it is on before
merging P5. If it were off, the homepage would go live without draft placeholders (D7) but with sample
Strava/Spotify/GitHub data and links to pages that don't exist yet (D17, D22). `/writings` and `/rss.xml`
only become public after you set `MAINTENANCE_ALLOWED_PATHS` (P4-T17).

Nothing has been merged. Say the word, after testing #83, and I will do the merges in order.
