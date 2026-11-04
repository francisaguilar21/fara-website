import type { Site } from '@/lib/content/schemas'

// `draft: true` until Francis confirms the headline (DESIGN §14.9). No `email` on purpose: Francis
// wants people to reach out through the socials or the booking link (§14.10).
// The flag only means the copy isn't final: `getSite()` returns the site either way, and no chip is
// shown for it. The booking link is not content: it is the `NEXT_PUBLIC_BOOKING_URL` variable.
export const site: Site = {
  name: 'Francis Aguilar',
  tagline: 'Software engineer, founder and long-distance runner.',
  headline: 'I build software & run long distances.',
  intro:
    'AI software engineer with 12 years of shipping software, a startup I co-founded and ran as CTO, and a habit of pacing other runners to their goal time.',
  location: 'Manila, PH',
  // Replace the file by hand. Until `public/static/resume.pdf` exists, `/work` leaves the link out.
  resumeUrl: '/static/resume.pdf',
  socials: [
    { label: 'GitHub', url: 'https://github.com/francisaguilar21' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/francisaguilar21' },
    { label: 'X', url: 'https://twitter.com/faraguilar21' },
  ],
  draft: true,
}
