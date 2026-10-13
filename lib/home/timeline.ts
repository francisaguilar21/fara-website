import { formatMonth } from '@/lib/content/format'

/** The part of an experience entry that decides how its dates read. Months are `YYYY-MM`. */
export type TimelineDates = { start: string; end?: string }

const yearOf = (month: string) => month.slice(0, 4)
const isOngoing = ({ end }: TimelineDates) => end === undefined || end === ''
const isSingleMoment = ({ start, end }: TimelineDates) => end === start

/**
 * The line above an entry's title, as in the mockup: years for a span (`2019 → 2024`), the month
 * for a single moment (`Jan 2024`, where `end` equals `start`), and `→ Now` while it's ongoing
 * (`end` empty).
 */
export function formatRange(dates: TimelineDates): string {
  if (isOngoing(dates)) return `${yearOf(dates.start)} → Now`
  if (isSingleMoment(dates)) return formatMonth(dates.start)
  return `${yearOf(dates.start)} → ${yearOf(dates.end!)}`
}

/** Big number in the sticky column. */
export function entryYear({ start }: TimelineDates): string {
  return yearOf(start)
}

/** Small line under the sticky year: where the entry ends (`→ 2024`, `→ Now`) or its month. */
export function entrySub(dates: TimelineDates): string {
  if (isOngoing(dates)) return '→ Now'
  if (isSingleMoment(dates)) return formatMonth(dates.start).split(' ')[0] ?? ''
  return `→ ${yearOf(dates.end!)}`
}

/**
 * Which entries have passed the reading line, and which one is active. `tops` are the entries'
 * top edges in viewport pixels, newest first; `line` is the reading line (55% of the viewport).
 * An entry is lit once its top is above the line, and the first entry always is, so the sticky
 * year never has nothing to show. The active entry is the last lit one.
 */
export function activeEntries(tops: number[], line: number): { lit: boolean[]; active: number } {
  const lit = tops.map((top, index) => index === 0 || top < line)
  return { lit, active: Math.max(lit.lastIndexOf(true), 0) }
}
