export type HeroRole = {
  /** Route-style label in rose: `/work`, `/build`, `/run`. */
  path: string
  /** Text before the optional link. */
  text: string
  link?: { label: string; href: string }
  /** Placeholder: shows a draft chip with this text until Francis confirms the detail. */
  draft?: string
}

// Three one-line roles under the intro (DESIGN §5). Fitscovery is left out on purpose: it is shown
// as a project, not headlined. `pnpm check:drafts` lists every role that still has a `draft`.
export const HERO_ROLES: HeroRole[] = [
  { path: '/work', text: 'AI Software Engineer' },
  {
    path: '/build',
    text: 'Open-source contributor, ',
    link: { label: 'BetterGov.ph', href: 'https://bettergov.ph' },
  },
  { path: '/run', text: 'Pacer, Asics Run Club PH' },
]
