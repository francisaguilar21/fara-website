import type { Recommendation } from '@/lib/content/schemas'

// Placeholders. The real quotes need each person's permission to show their name (DESIGN §14).
export const recommendations: Recommendation[] = [
  {
    quote:
      'A real recommendation goes here: two or three sentences from someone you worked with, about a specific thing you did together.',
    name: 'Name Surname',
    role: 'Role',
    company: 'Company',
    relationship: 'Worked together',
    draft: true,
  },
  {
    quote:
      'A second recommendation goes here, ideally from a different part of your career than the first.',
    name: 'Name Surname',
    role: 'Role',
    company: 'Company',
    relationship: 'Managed me',
    draft: true,
  },
  {
    quote: 'A third recommendation goes here, for example from a teammate or a client.',
    name: 'Name Surname',
    role: 'Role',
    company: 'Company',
    relationship: 'Worked together',
    draft: true,
  },
]
