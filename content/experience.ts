import type { Experience } from '@/lib/content/schemas'

// Placeholders from the design mockup. Entries marked `draft: true` are waiting for the real
// company, dates and copy (DESIGN §14). Order doesn't matter: the getter sorts by `start`.
export const experience: Experience[] = [
  {
    role: 'Senior Software Engineer',
    org: 'Company',
    start: '2024-01',
    end: '',
    kind: 'work',
    summary:
      'One sentence about the impact you have here: what you own, what you shipped, and who it helped.',
    highlights: [],
    tags: ['TypeScript', 'React', 'Cloud'],
    featured: true,
    draft: true,
  },
  {
    role: 'Committed to a year of change',
    org: 'Personal',
    start: '2024-01',
    end: '2024-01',
    kind: 'life',
    summary:
      'Went public with a reset: back to running on January 10, a weight-loss challenge with friends, and Garmin data to keep me honest.',
    highlights: [],
    tags: ['Running', 'Health'],
    featured: true,
  },
  {
    role: 'Launched francisaguilar.co',
    org: 'Personal',
    orgUrl: 'https://francisaguilar.co',
    start: '2023-12',
    end: '2023-12',
    kind: 'life',
    summary:
      'Started writing in public about tech, entrepreneurship and fitness. Picked PostHog over Google Analytics and wrote about why.',
    highlights: [],
    tags: ['Next.js', 'PostHog', 'Writing'],
    featured: true,
  },
  {
    role: 'Pacer',
    org: 'Asics Run Club PH',
    start: '2023-01',
    end: '',
    kind: 'life',
    summary: 'Holding a steady pace so other runners can chase a goal time.',
    highlights: [],
    tags: ['Community', 'Running'],
    featured: true,
    draft: true,
  },
  {
    role: 'Co-founder & CTO',
    org: 'Fitscovery',
    orgUrl: 'https://fitscovery.com',
    start: '2019-01',
    end: '2024-01',
    kind: 'work',
    summary:
      'Built the product and the engineering team behind a fitness discovery startup, from the first commit to production.',
    highlights: [],
    tags: ['Founder', 'Architecture', 'Hiring'],
    featured: true,
    draft: true,
  },
  {
    role: 'Software Engineer & IT Project Manager',
    org: 'Company',
    start: '2014-01',
    end: '2019-01',
    kind: 'work',
    summary:
      'The early years: shipping client software, then running the projects that shipped it.',
    highlights: [],
    tags: ['Delivery', 'Full-stack'],
    featured: true,
    draft: true,
  },
]
