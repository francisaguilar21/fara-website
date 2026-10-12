// Shared by the header and the footer. Moves to `content/site.ts` when Phase 4/5 adds it.
export const NAV_LINKS = [
  { label: 'work', href: '/work' },
  { label: 'life', href: '/life' },
  { label: 'writing', href: '/blog' },
  { label: 'now', href: '/now' },
] as const

export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/francisaguilar21' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/francisaguilar21' },
  { label: 'X', href: 'https://twitter.com/faraguilar21' },
] as const

export const REPO_URL = 'https://github.com/francisaguilar21/fara-website'
