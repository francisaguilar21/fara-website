import type { Race } from '@/lib/content/schemas'

// Placeholders. Pace is derived from `time` and `distanceKm` (`lib/content/format.ts`), never stored.
export const races: Race[] = [
  {
    name: 'Race name',
    date: '2026-01-01',
    distanceKm: 21.0975,
    time: '1:59:59',
    pr: false,
    role: 'runner',
    draft: true,
  },
  {
    name: 'Race name',
    date: '2025-01-01',
    distanceKm: 10,
    time: '0:55:00',
    pr: true,
    role: 'runner',
    draft: true,
  },
  {
    name: 'Race name',
    date: '2024-01-01',
    distanceKm: 42.195,
    time: '5:00:00',
    pr: false,
    role: 'pacer',
    draft: true,
  },
]
