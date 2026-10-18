import type { UsesGroup } from '@/lib/content/schemas'

// Placeholders from the design mockup, waiting for Francis's real stack, tools and gear.
export const uses: UsesGroup[] = [
  {
    category: 'Languages',
    items: [
      { name: 'TypeScript', note: 'Strict mode on, everywhere.' },
      { name: 'JavaScript' },
      { name: 'SQL' },
    ],
    draft: true,
  },
  {
    category: 'Frontend',
    items: [
      { name: 'React' },
      { name: 'Next.js', note: 'App Router, mostly static.', url: 'https://nextjs.org' },
      { name: 'Tailwind CSS' },
    ],
    draft: true,
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js' },
      { name: 'PostgreSQL', note: 'My default for anything relational.' },
      { name: 'REST & GraphQL' },
    ],
    draft: true,
  },
  {
    category: 'Cloud',
    items: [{ name: 'AWS' }, { name: 'Vercel' }, { name: 'Docker' }],
    draft: true,
  },
  {
    category: 'Product',
    items: [
      { name: 'PostHog', url: 'https://posthog.com' },
      { name: 'Feature flags' },
      { name: 'A/B testing' },
    ],
    draft: true,
  },
  {
    category: 'On the road',
    items: [
      { name: 'Garmin', note: 'Placeholder: the watch I race in.' },
      { name: 'Strava' },
      { name: 'Asics', note: 'Placeholder: daily trainers.' },
    ],
    draft: true,
  },
]
