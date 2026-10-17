import { paceSecondsPerKm, parseDuration } from '@/lib/content/format'

export type RaceSortKey = 'name' | 'date' | 'distance' | 'time' | 'pace' | 'role'
export type SortDirection = 'asc' | 'desc'

type SortableRace = {
  name: string
  date: string
  distanceKm: number
  time: string
  role: 'runner' | 'pacer'
}

const compare: Record<RaceSortKey, (a: SortableRace, b: SortableRace) => number> = {
  name: (a, b) => a.name.localeCompare(b.name),
  date: (a, b) => a.date.localeCompare(b.date),
  distance: (a, b) => a.distanceKm - b.distanceKm,
  time: (a, b) => parseDuration(a.time) - parseDuration(b.time),
  pace: (a, b) => paceSecondsPerKm(a) - paceSecondsPerKm(b),
  role: (a, b) => a.role.localeCompare(b.role),
}

/**
 * The race log in the order of one column (P6-R10). Ties fall back to the newest date first, so the
 * order is always the same. Returns a new array.
 */
export function sortRaces<T extends SortableRace>(
  races: T[],
  key: RaceSortKey,
  direction: SortDirection
): T[] {
  const sign = direction === 'asc' ? 1 : -1
  return [...races].sort(
    (a, b) =>
      sign * compare[key](a, b) || b.date.localeCompare(a.date) || a.name.localeCompare(b.name)
  )
}

/** The direction a column starts in when it is first pressed: newest and longest first, the rest A to Z or fastest first. */
export function defaultDirection(key: RaceSortKey): SortDirection {
  return key === 'date' || key === 'distance' ? 'desc' : 'asc'
}

const distanceFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

/** `21.0975` becomes `21.1 km`, `10` stays `10 km`. */
export function formatRaceDistance(km: number): string {
  return `${distanceFormat.format(km)} km`
}
