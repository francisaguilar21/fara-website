# Phase 3: Design system · Specs

| Status      | Depends on | Ships as                                               | Effort   |
| ----------- | ---------- | ------------------------------------------------------ | -------- |
| In progress | Phases 1–2 | 3 PRs: tokens & type → layout & UI components → motion | 2–3 days |

References: [DESIGN §3](../design/DESIGN.md#3-brand), [DESIGN §6](../design/DESIGN.md#6-components), [DESIGN §7](../design/DESIGN.md#7-motion), [mockup](../design/mockup.html) (its `<style>` block is the reference CSS)

## 1. Goal

Turn the brand and the mockup into reusable building blocks: tokens, fonts, the logo, the page shell,
UI primitives and the motion system. Phases 4–6 then assemble pages without inventing any styling.

## 2. Scope

**In**

- Color and type tokens, both themes, theme toggle
- Fonts
- `<Logo />`, favicons and app icons
- Header, footer and layout primitives
- UI primitives
- Motion components
- A development-only `/styleguide`

**Out**

- Page sections (Phase 5)
- Content-driven components such as the timeline and project rows (Phase 5)
- OG images (Phase 4)
- Analytics on interactions (Phase 7)

## 3. Requirements

| ID     | Requirement                                                                                                                                                                                                                               |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P3-R1  | The color tokens in DESIGN §3.3 are defined as CSS variables. **Dark is the default regardless of OS**; light applies under `[data-theme="light"]`. They're mapped to Tailwind via `@theme`.                                              |
| P3-R2  | Space Grotesk, Inter and JetBrains Mono load through `next/font/google` as variable fonts exposed as `--font-display`, `--font-sans` and `--font-mono`. There is no layout shift from font loading.                                       |
| P3-R3  | The type scale in DESIGN §3.4 is available as utilities or components (`display-xl`, `h1`–`h3`, `body`, `small`, `label`, `data`).                                                                                                        |
| P3-R4  | Theme switching uses `next-themes` (`attribute="data-theme"`, `defaultTheme="dark"`, `enableSystem={false}`). The choice persists and there's no flash on load.                                                                           |
| P3-R5  | `<Logo />` is an SVG of the F/A mark using `currentColor`, with an optional rose slash (`accent` prop). Favicon, `icon.svg` and `apple-icon.png` are generated from it (rose on black).                                                   |
| P3-R6  | Layout primitives: `<SiteHeader />`, `<SiteFooter />`, `<Container />`, `<Section />` and `<SkipLink />` (§4.3).                                                                                                                          |
| P3-R7  | UI primitives: `<Button />`, `<Eyebrow />`, `<SlashDivider />`, `<Tag />`, `<Label />`, `<DraftChip />`, `<ThemeToggle />` and `<UnderlineLink />` (§4.4).                                                                                |
| P3-R8  | Motion components: `<SmoothScroll />`, `<Cursor />`, `<Magnetic />`, `<Reveal />`, `<Parallax />` and `<SlashWipe />` (§4.5).                                                                                                             |
| P3-R9  | Reduced-motion rule. With `prefers-reduced-motion: reduce`, the following are off: Lenis, cursor, magnetic pull, parallax, marquee. Reveals and wipes become instant cross-fades. Cursor and magnetic are also off for `pointer: coarse`. |
| P3-R10 | Content is never hidden waiting for JavaScript. Reveals start from a visible state (e.g. `opacity .6, translateY(16px)`), never `opacity: 0`.                                                                                             |
| P3-R11 | Accessibility: visible focus ring (2px `--accent`, 2px offset) and a skip link. Text meets WCAG AA contrast in both themes.                                                                                                               |
| P3-R12 | `/styleguide` renders every token, type style and component in both themes. It returns 404 in production.                                                                                                                                 |
| P3-R13 | Heavy motion code (Lenis, cursor) loads after `requestIdleCallback` and adds less than 25 kB gzipped to the home route.                                                                                                                   |

## 4. Technical design

### 4.1 Tokens (`app/globals.css`)

```css
@import 'tailwindcss';
@plugin '@tailwindcss/typography';

@custom-variant dark (&:where([data-theme='dark'], [data-theme='dark'] *));
@custom-variant light (&:where([data-theme='light'], [data-theme='light'] *));

:root,
[data-theme='dark'] {
  --bg: #0b0a0b;
  --surface: #151314;
  --line: #2a2527;
  --fg: #f5f2f3;
  --muted: #9c9496;
  --accent: #f43f5e;
  --accent-ink: #0b0a0b;
  --ok: #22c55e;
  --error: #f97316;
  color-scheme: dark;
}
[data-theme='light'] {
  --bg: #faf9f9;
  --surface: #ffffff;
  --line: #e7e2e3;
  --fg: #141112;
  --muted: #6b6365;
  --accent: #df1d47;
  --accent-ink: #ffffff;
  --ok: #15803d;
  --error: #c2410c;
  color-scheme: light;
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-line: var(--line);
  --color-fg: var(--fg);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-accent-ink: var(--accent-ink);
  --color-ok: var(--ok);
  --color-error: var(--error);
  --font-display: var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif;
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --container-site: 1240px;
}
```

Spacing follows DESIGN §3.5 (Tailwind's default 4px scale already covers it). Section spacing is
`py-24 md:py-36`. The default radius is `0`; `rounded-md` (6px) is only for inputs and cards that
can be interacted with.

### 4.2 Type scale

| Utility / component | Spec (DESIGN §3.4)                                                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `.display-xl`       | Space Grotesk 600, `clamp(2.5rem, 6vw, 5.5rem)`, line-height 0.95, tracking -0.045em, `text-wrap: balance` (see open question 1) |
| `.h1`               | 600, `clamp(2.25rem, 5vw, 4rem)`, -0.03em                                                                                        |
| `.h2`               | 500, `clamp(1.75rem, 3.5vw, 2.75rem)`, -0.02em, line-height 1.05                                                                 |
| `.h3`               | 500, `1.25rem`, -0.01em                                                                                                          |
| body                | Inter 400, `1.0625rem` / 1.65, max 68ch                                                                                          |
| `.label`            | JetBrains Mono 500, `0.75rem`, uppercase, 0.08em, `--muted`                                                                      |
| `.data`             | JetBrains Mono 500, `tabular-nums`, -0.02em                                                                                      |

### 4.3 Layout primitives

| Component                                        | Behavior                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<SiteHeader />`                                 | Sticky at `top: env(safe-area-inset-top)`, 64px tall, `--bg` at 82% opacity with backdrop blur, 1px bottom border. Hides on scroll down after 200px and shows on scroll up. Contains the logo (link home), nav `work · life · writing · now` (mono, a leading rose `/` appears on hover), `<ThemeToggle />` and a "Let's talk" `<Button size="sm">`. On mobile (< 760px) the nav collapses into a full-screen menu that opens with `<SlashWipe />`. |
| `<SiteFooter />`                                 | Three link columns (Elsewhere, Site, Archive with a link to the `v2024` tree) and an outlined **F/A** wordmark (`clamp(6rem, 30vw, 24rem)`) that fills in on hover                                                                                                                                                                                                                                                                                  |
| `<Container />`                                  | `max-w-[1240px] mx-auto px-[clamp(16px,4vw,40px)]`                                                                                                                                                                                                                                                                                                                                                                                                  |
| `<Section eyebrow="/work" label="Experience" />` | 2-column grid (`minmax(140px,220px) 1fr`) that stacks under 820px. Takes `id` for anchors.                                                                                                                                                                                                                                                                                                                                                          |
| `<SkipLink />`                                   | First focusable element, jumps to `#main`                                                                                                                                                                                                                                                                                                                                                                                                           |

### 4.4 UI primitives

| Component           | API                                                                     | Notes                                                                                                        |
| ------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `<Button />`        | `variant: 'solid' \| 'ghost'`, `size: 'md' \| 'sm'`, `asChild` / `href` | Pill. Solid is `--fg`, turning `--accent` on hover. Ghost is a `--line` border, turning `--accent` on hover. |
| `<Eyebrow />`       | `path: string`                                                          | Mono, `--accent`, e.g. `/work`                                                                               |
| `<SlashDivider />`  | —                                                                       | 48px tall, 2px `--line` bar skewed -17°                                                                      |
| `<Tag />`           | `children`                                                              | Mono 0.75rem pill, 1px `--line` border                                                                       |
| `<Label />`         | `as?`                                                                   | The `.label` style                                                                                           |
| `<DraftChip />`     | `children?` (default "draft")                                           | Dashed rose border, mono. Marks placeholder content (Phase 5 policy)                                         |
| `<ThemeToggle />`   | —                                                                       | Icon button (sun/moon). Triggers `<SlashWipe />` and switches theme at the midpoint.                         |
| `<UnderlineLink />` | `href`, `external?`                                                     | Rose 1px underline that grows from 0 to 100% width on hover and focus                                        |

### 4.5 Motion (`components/motion/`)

| Component          | Props                    | Implementation                                                                                                                                                                                             | Disabled when                     |
| ------------------ | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `<SmoothScroll />` | —                        | Lenis `{ lerp: 0.1 }`, driven by Motion's frame loop, mounted in the root layout                                                                                                                           | Reduced motion                    |
| `<Cursor />`       | —                        | Rose dot plus a ring that follows with a spring. The ring grows to 64px and shows a label (`data-cursor="View"`) over marked elements.                                                                     | Reduced motion, `pointer: coarse` |
| `<Magnetic />`     | `strength = 12`          | Pulls the child up to `strength` px toward the pointer; springs back on leave                                                                                                                              | Reduced motion, `pointer: coarse` |
| `<Reveal />`       | `as`, `delay`, `stagger` | `whileInView` from `{ opacity: .6, y: 16 }` to `{ opacity: 1, y: 0 }`, 0.6s ease-out-quint, `once: true`                                                                                                   | Reduced motion (rendered static)  |
| `<Parallax />`     | `offset = 40`            | `useScroll` + `useTransform`, translateY at most ±`offset`px                                                                                                                                               | Reduced motion                    |
| `<SlashWipe />`    | `onMidpoint`             | Full-screen `--accent` panel skewed -17°, moving left → center → right over 0.9s. Used for theme toggle, mobile menu and route changes (React `<ViewTransition>` / View Transitions API; Motion fallback). | Reduced motion (0.2s cross-fade)  |

`lib/motion.ts` exports `EASE_OUT_QUINT`, `DURATION = { fast: .18, base: .4, slow: .7 }` and a
`useMotionEnabled()` hook (reduced motion + pointer type + the `motion-rich` flag once Phase 7 lands).

### 4.6 Logo

Redraw the F/A mark as clean SVG paths. Trace `logo-white-on-black.png` and simplify to straight lines:
the mark is all straight strokes, with the slash at about 17°. Use a `0 0 120 80` viewBox.

```tsx
<Logo className="h-6" accent /> // slash in --accent, letters in currentColor
```

Generate with `app/icon.svg` (rose slash on black), `app/apple-icon.png` (180px) and
`app/favicon.ico`. Then remove `public/static/favicons/`.

### 4.7 Styleguide

`app/styleguide/page.tsx` calls `notFound()` when `process.env.VERCEL_ENV === 'production'`. Sections:
colors (with contrast ratios), type scale, buttons, tags, eyebrow, divider, header/footer preview,
motion demos (with a "simulate reduced motion" switch).

## 5. Acceptance criteria

| ID     | Criterion                                                                                                                                      |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| P3-AC1 | `/styleguide` side by side with the mockup at 1440px and 390px shows matching colors, type, spacing and buttons in both themes.                |
| P3-AC2 | Theme toggle: the slash wipe plays, the theme switches at the midpoint, the choice survives a reload, and there's no flash of the wrong theme. |
| P3-AC3 | With OS set to light and no saved choice, the site renders **dark**.                                                                           |
| P3-AC4 | With reduced motion emulated (DevTools), there's no smooth scroll, cursor, parallax or magnetic movement; transitions are cross-fades.         |
| P3-AC5 | On a touch device (or emulated `pointer: coarse`), there's no custom cursor or magnetic movement.                                              |
| P3-AC6 | With JavaScript disabled, all text is visible and readable.                                                                                    |
| P3-AC7 | axe reports no violations on `/styleguide` in either theme. Every text token pair passes AA.                                                   |
| P3-AC8 | Lighthouse (mobile) on the placeholder home with header and footer: Performance ≥ 95, CLS < 0.05.                                              |
| P3-AC9 | The favicon and app icons render from the new SVG. `public/static/favicons/` is gone.                                                          |

## 6. Open questions

| #   | Question                                                                                                                                                                                                   | Default if unanswered                                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | DESIGN §3.4 says Display XL is `clamp(3rem, 9vw, 8.5rem)`, but the mockup was tuned to `clamp(2.5rem, 6vw, 5.5rem)` so the headline fits next to the portrait. Which wins?                                 | The mockup value. Update DESIGN §3.4 in the first Phase 3 PR.                                                       |
| 2   | Route transitions with React `<ViewTransition>` (still experimental in Next.js) or Motion? **Resolved:** `<ViewTransition>` ships in React 19.3 and works in the App Router without config, so it is used. | Use `<ViewTransition>` if it's stable in the installed Next.js. Otherwise Motion's `AnimatePresence` in a template. |
| 3   | Trace the logo by hand or with a tool?                                                                                                                                                                     | Hand-built paths. The mark is simple, and clean paths keep the file small.                                          |
