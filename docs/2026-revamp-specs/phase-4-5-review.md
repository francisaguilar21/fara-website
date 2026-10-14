# Phase 4 + 5 review: decisions and test checklist

Written 2026-10-14 after going through all six open PRs. Use this to (1) test everything in one go,
(2) make the decisions the PRs left open, and (3) merge. Tick the boxes as you go.

## 1. What exists

`main` already has the LICENSE removal (#75) and Phase 4 PR 1, the content layer (#76).

| PR                                                                          | What it adds                                                                                                                                 | Stacked on |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| [#77](https://github.com/francisaguilar21/fara-website/pull/77) (P4 PR 2)   | `/blog`, `/blog/[slug]`, `/blog/tags/[tag]`, MDX components, code highlighting, page metadata                                                | `main`     |
| [#80](https://github.com/francisaguilar21/fara-website/pull/80) (P4 PR 3)   | `/rss.xml`, `/sitemap.xml`, `/robots.txt`, generated OG images, 2024 URL redirects                                                           | #77        |
| [#78](https://github.com/francisaguilar21/fara-website/pull/78) (P5 PR 1)   | Homepage hero, now strip, sample integration data, `pnpm check:drafts`, header anchors, `Parallax` fix                                       | `main`     |
| [#79](https://github.com/francisaguilar21/fara-website/pull/79) (P5 PR 2)   | Scroll-drawn timeline (`#work`)                                                                                                              | #78        |
| [#81](https://github.com/francisaguilar21/fara-website/pull/81) (P5 PR 3)   | Projects rows with cursor preview (`#projects`), life grid: running, community, gallery, building (`#life`)                                  | #79        |
| [#82](https://github.com/francisaguilar21/fara-website/pull/82) (P5 PR 4)   | Stack, proof (carousel + certifications), latest posts, GitHub heatmap, contact; performance fixes; swaps Motion scroll hooks for a listener | #81        |
| [#83](https://github.com/francisaguilar21/fara-website/pull/83) (test only) | `main` + all of the above in one branch, so one preview shows everything. **Never merge it.**                                                | n/a        |

The two chains (P4: #77 → #80, P5: #78 → #79 → #81 → #82) don't depend on each other for review.
They only touch the same file in one place: `app/page.tsx` (see §2).

## 2. State of the PRs

- **CI:** the `check` job and the Vercel comment check are green on #77, #78, #79, #80, #81 and #82.
- **Combined tree (#83):** `main` + all six merges with one conflict, in `app/page.tsx` (P4 adds the
  page metadata, P5 adds the sections; both kept). On that tree `pnpm lint`, `typecheck`,
  `format:check`, `test` (276 unit tests) and `build` pass, and Playwright passes 93 of 93.
- **Not checked by anyone yet:** the Vercel previews, screenshots against the mockup, real devices,
  screen readers. That is what §4 is for.

## 3. Decisions

Each item has a recommendation. Reply with the numbers you want changed.

### Phase 4

| #   | Decision                                                                                                                                                                                                                                          | Recommendation                                                              |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| D1  | **PostHog post scores 92 on Lighthouse SEO** (P4-AC10): two links read just "here". Fixing them edits the post text, which P4-R5 forbids. Suggested wording: "the inaugural post", "this sample from the PostHog team".                           | Fix the two link texts. It's your own post, and the wording barely changes. |
| D2  | **Mobile performance on posts is 92–97** against the 95 target. It comes from the shared page shell, not the posts. Local lab run, not Vercel.                                                                                                    | Accept for now; re-measure on Vercel; tune in Phase 8.                      |
| D3  | **Cover image.** Spec P4-R8 wants a cover on the post page, but all three posts already start with their banner in the body. The page renders its own cover only when the body lacks it (today: never).                                           | Keep as is.                                                                 |
| D4  | **Several `h1`s per post.** Post bodies use `#` headings, so each post has more than one `h1`. Demoting them is a one-line plugin; the content stays untouched.                                                                                   | Demote with the plugin (better for SEO and accessibility).                  |
| D5  | **Blog eyebrow reads `/writing`** while the URL is `/blog`.                                                                                                                                                                                       | Keep (it matches the nav name).                                             |
| D6  | **Tag pagination (`/tags/:tag/page/:n`) is not redirected.** The specs list five redirects, and the agent couldn't check what the 2024 site served.                                                                                               | Leave unless Search Console shows those URLs.                               |
| D7  | **Draft filtering applies to posts only.** Other drafts (projects, pages, etc.) stay visible with a draft chip, per P4-R3. The tasks file says "filter drafts in production".                                                                     | Confirm this reading. It matters at launch (see D17).                       |
| D8  | **Two extra OG images** (`/blog` and each tag page), so every blog page keeps a public image while `MAINTENANCE_ALLOWED_PATHS=/blog,/rss.xml` is active.                                                                                          | Keep.                                                                       |
| D9  | **`NEXT_PUBLIC_SITE_URL` falls back to `https://francisaguilar.co`** when unset, so a missing variable can't put localhost into the feed or sitemap.                                                                                              | Keep; still set the variable in Vercel.                                     |
| D10 | **OG card titles drop emoji** ("Hello World! 👋" shows as "Hello World!").                                                                                                                                                                        | Keep.                                                                       |
| D11 | **Spec deviations:** `next.config.ts` exports an async function (top-level `await` breaks Next 16.4); Velite assets go to `public/static/velite` (its `clean` would wipe the post images); a custom date check so errors name the file and field. | Keep. The specs are updated.                                                |

### Phase 5

| #   | Decision                                                                                                                                                                                                                                   | Recommendation                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| D12 | **Timeline dim state.** The mockup fades unlit entries to 60% opacity; axe reports that as a contrast failure (P5-AC6). Entries now dim by color (title goes muted) and slide 10px.                                                        | Keep. Look at it in §4 and say if you want the mockup look on the title only.                                 |
| D13 | **Motion's `useScroll`/`useSpring` replaced** by a small scroll listener (`lib/use-scroll-progress.ts`): about 8 kB gzipped less JavaScript, and the timeline measures every scroll frame. Spec §4.3 is updated.                           | Keep unless the scroll feel is off in §4.                                                                     |
| D14 | **Contact isn't wrapped in `<Section>`.** It follows the mockup's two-column layout. Spec updated.                                                                                                                                         | Keep.                                                                                                         |
| D15 | **Contact form stub message:** "Nothing was sent: the form isn't connected yet. Book a call instead." Or disable the button until Phase 7.                                                                                                 | Keep the message; it's honest and keeps the form testable.                                                    |
| D16 | **Booking URL.** The booking card uses `site.bookingUrl` in `content/site.ts`, still the placeholder `https://calendar.google.com`. `.env.example` lists `NEXT_PUBLIC_BOOKING_URL`, but no code reads it.                                  | Give me the real URL, and decide: content file or env var (I'd use the content file and delete the env line). |
| D17 | **Placeholder content.** `pnpm check:drafts` lists 35 draft entries plus 3 sample integrations (Strava, Spotify, GitHub). It exits 1 and is not in CI. It becomes a launch gate in Phase 8. P5-T01–T04 are yours.                          | Send the content when you have it; nothing blocks merging.                                                    |
| D18 | **New dependencies:** `sharp` (blur placeholders for content images), `tsx` (dev, runs `check:drafts`), `@fontsource/space-grotesk` (dev, OG card font).                                                                                   | OK.                                                                                                           |
| D19 | **Starter gallery photos** are the five crops already embedded in the mockup, saved to `public/static/images/gallery/`, still `draft: true`. One P4 unit test was relaxed because the gallery now contains race photos.                    | OK; replace with your photos in Phase 6.                                                                      |
| D20 | **Copy and data choices:** the intro is not bolded (the `site.intro` field is a plain string); the three hero roles live in `components/home/hero-roles.ts` (the schema has no field); the hero label shows the city plus coordinates.     | OK; revisit when Phase 6 touches `site`.                                                                      |
| D21 | **Not built** (the spec doesn't require them): heatmap diagonal fade-in, number count-ups, cursor-preview tilt.                                                                                                                            | Skip for now.                                                                                                 |
| D22 | **Links to pages that don't exist yet.** The header, footer and cards link to `/work`, `/life`, `/now`, `/uses`, `/contact`, `/projects/[slug]` and `/life/building` (Phase 6). On the homepage the nav uses anchors, but other links 404. | OK on a gated site. It must be fixed before the maintenance page comes down.                                  |
| D23 | **P5-T25: Lighthouse on the Vercel preview** with the bypass cookie wasn't run. Local runs scored 93–95 performance and 100 on the rest. The first run of the finished page scored 81 before the performance fixes in #82.                 | Run it once on the #83 preview.                                                                               |

### Cross-cutting

| #   | Decision                                                                                                                                                                                     | Recommendation                                                |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| D24 | **Merge strategy.** See §5.                                                                                                                                                                  | Merge commits in order, or squash and let me re-sync each PR. |
| D25 | **License.** The repo has no license file now (#75). Do you want to state terms (for example "All rights reserved")?                                                                         | Your call.                                                    |
| D26 | **Vercel settings after merge:** `MAINTENANCE_ALLOWED_PATHS=/blog,/rss.xml` (P4-T17), `NEXT_PUBLIC_SITE_URL=https://francisaguilar.co`. Then Search Console: submit `/sitemap.xml` (P4-T19). | Do both after #80 merges.                                     |

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
- [ ] Latest posts shows the 3 posts; "All posts →" goes to `/blog`.
- [ ] GitHub heatmap: tooltip shows date and count; on the phone it scrolls sideways inside its own box, not the page.
- [ ] Contact: the booking card button opens `site.bookingUrl` in a new tab. The form shows an inline error under each bad field and focuses the first one. A valid submit shows the "Nothing was sent" message (D15).
- [ ] Keyboard only: Tab through the whole page. Every stop shows a visible focus ring.
- [ ] No horizontal page scroll at 360px.
- [ ] Compare with `docs/2026-revamp-specs/design/mockup.html` side by side (P5-AC1), section by section.
- [ ] Lighthouse (mobile) on the preview. Target 95 performance (D23).

### Blog (#77)

- [ ] `/blog` lists the 3 posts with date, title, summary, reading time and tags.
- [ ] Each post opens and reads right, images load without the page jumping, and code blocks follow the light/dark theme.
- [ ] Heading anchors, previous/next links and "back to blog" work. (D3, D4: note the cover and the `h1` count.)
- [ ] A tag page (`/blog/tags/technology`) filters correctly; a bad slug gives a 404.
- [ ] External links open in a new tab.
- [ ] Compare each post's text with the 2024 site (P4-AC1). The agent only compared against the MDX source.

### SEO plumbing (#80)

- [ ] `/rss.xml` loads as a feed with the 3 posts. Paste its URL into the [W3C feed validator](https://validator.w3.org/feed/) once deployed.
- [ ] `/sitemap.xml` and `/robots.txt` look right.
- [ ] `/opengraph-image` and a post's OG image show the F/A mark and the title (1200×630).
- [ ] These redirect permanently: `/tags/technology` → `/blog/tags/technology`, `/tags` → `/blog`, `/blog/page/2` → `/blog`, `/about` → `/`, `/feed.xml` → `/rss.xml`.
- [ ] Paste a post URL into an OG preview tool once it is public.

### After merge (production)

- [ ] Set `MAINTENANCE_ALLOWED_PATHS=/blog,/rss.xml` in Vercel (Production) and redeploy (P4-T17).
- [ ] `/blog` and `/rss.xml` are reachable in production; `/` still shows the maintenance page (P4-AC9).
- [ ] Submit `/sitemap.xml` in Google Search Console and check the post URLs (P4-T19).

## 5. Can they be merged?

**Yes, technically.** All six PRs have green CI. Merging them with merge commits in the order below
(#77, #80, #78, #79, #81, #82) produced exactly one conflict, in `app/page.tsx`, and the combined tree
(#83) builds and passes every test. Two things to settle first:

1. **They are drafts.** Each needs to be marked "Ready for review" before it can merge.
2. **Stacked PRs and squash merges don't mix well.** #76 was squash-merged. If you squash #77, then
   #80 (built on #77's old commits) will likely conflict until its base is moved to `main` and it's
   brought up to date. The same applies to #78 → #79 → #81 → #82. Two clean options:
   - **Merge commits, in order** (#77, #80, #78, #79, #81, #82). After each merge, retarget the next PR to `main`. No conflicts expected.
   - **Squash**, with me re-syncing each next PR to `main` before you press merge.

   The one real conflict is `app/page.tsx`, between the two chains. Whichever chain merges second needs the
   resolution shown in #83: keep P4's `metadata` export and P5's imports and sections.

**Every merge to `main` deploys to production.** The homepage and everything else stay behind the
maintenance page only while maintenance mode is on in production. I can't see that PostHog flag, so please
confirm it is on before merging P5. If it's off, the homepage goes live with 35 placeholder entries, sample
data and links to pages that don't exist (D17, D22). `/blog` and `/rss.xml` only become public after you set
`MAINTENANCE_ALLOWED_PATHS` (P4-T17).

I haven't merged anything. Tell me which strategy you want and whether you'd rather test #83 first, and I
will do the merges in order.
