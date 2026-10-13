import type { UsesGroup } from '@/lib/content/schemas'

// Placeholders from the design mockup, waiting for Francis's real stack, tools and gear.
export const uses: UsesGroup[] = [
  {
    category: 'Languages',
    items: [{ name: 'TypeScript' }, { name: 'JavaScript' }, { name: 'SQL' }],
    draft: true,
  },
  {
    category: 'Frontend',
    items: [{ name: 'React' }, { name: 'Next.js' }, { name: 'Tailwind CSS' }],
    draft: true,
  },
  {
    category: 'Backend',
    items: [{ name: 'Node.js' }, { name: 'PostgreSQL' }, { name: 'REST & GraphQL' }],
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
    items: [{ name: 'Garmin' }, { name: 'Strava' }, { name: 'Asics' }],
    draft: true,
  },
]
