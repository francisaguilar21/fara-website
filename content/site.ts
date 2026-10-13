import type { Site } from '@/lib/content/schemas'

// `draft: true` until Francis confirms the headline (DESIGN §14.9), supplies the booking link
// (§14.8) and the contact email (§14.10).
export const site: Site = {
  name: 'Francis Aguilar',
  tagline: 'Software engineer, founder and long-distance runner.',
  headline: 'I build software & run long distances.',
  intro:
    'Senior software engineer with over a decade of shipping products, a startup I co-founded and ran as CTO, and a habit of pacing other runners to their goal time.',
  location: 'Manila, PH',
  socials: [
    { label: 'GitHub', url: 'https://github.com/francisaguilar21' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/francisaguilar21' },
    { label: 'X', url: 'https://twitter.com/faraguilar21' },
  ],
  // Placeholder: replace with the Google Calendar appointment schedule URL.
  bookingUrl: 'https://calendar.google.com',
  draft: true,
}
