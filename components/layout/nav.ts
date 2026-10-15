// Shared by the header and the footer. Moves to `content/site.ts` when Phase 4/5 adds it.
//
// On the homepage the header links to the section on the page (`anchor`) instead of leaving it.
export const NAV_LINKS = [
  { label: 'work', href: '/work', anchor: '#work' },
  { label: 'life', href: '/life', anchor: '#life' },
  { label: 'writing', href: '/writings', anchor: '#writing' },
  { label: 'now', href: '/now', anchor: '#now' },
] as const

/** The "Let's talk" button: the contact page, or the contact section when already on the homepage. */
export const CONTACT_LINK = { href: '/contact', anchor: '#contact' } as const

export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/francisaguilar21' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/francisaguilar21' },
  { label: 'X', href: 'https://twitter.com/faraguilar21' },
] as const

export const REPO_URL = 'https://github.com/francisaguilar21/fara-website'
