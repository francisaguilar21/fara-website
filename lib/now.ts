/** A `/now` page older than this many days gets a note that it may be out of date (P6-R14). */
export const STALE_AFTER_DAYS = 60

const DAY_MS = 24 * 60 * 60 * 1000

/** Whole days from `updatedAt` (`YYYY-MM-DD`) to `now`, both read as UTC days. Negative for a future date. */
export function daysSince(updatedAt: string, now: Date): number {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return Math.floor((today - new Date(updatedAt).getTime()) / DAY_MS)
}

/** True when the page was last updated more than `days` days ago. Exactly `days` is still fresh. */
export function isStale(updatedAt: string, now: Date, days = STALE_AFTER_DAYS): boolean {
  return daysSince(updatedAt, now) > days
}
