export type HeroRole = {
  /** Route-style label in rose: `/work`, `/build`, `/run`. */
  path: string
  /** Text before the optional link. */
  text: string
  link?: { label: string; href: string }
  /** Placeholder: shows a draft chip with this text until Francis confirms the detail. */
  draft?: string
}

// Three one-line roles under the intro (DESIGN §5). They are copied from the mockup. The current
// employer is not named until Francis confirms (phase 5 open question), hence the draft chip.
// `pnpm check:drafts` lists every role that still has a `draft`.
export const HERO_ROLES: HeroRole[] = [
  { path: '/work', text: 'Senior Software Engineer', draft: 'company?' },
  {
    path: '/build',
    text: 'Ex-Founder & CTO, ',
    link: { label: 'Fitscovery', href: 'https://fitscovery.com' },
  },
  { path: '/run', text: 'Pacer, Asics Run Club PH' },
]
