const kmFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

/** `41.2` becomes `41.2`, `41` stays `41` and `1284` becomes `1,284`. */
export function formatKm(km: number): string {
  return kmFormat.format(km)
}

/**
 * When a run started, as `Sun 06:10`. `startedAt` is the local start time with its offset, and the
 * result is read in Manila time so the server and the browser agree.
 */
export function formatRunStart(startedAt: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Manila',
  }).formatToParts(new Date(startedAt))
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return `${part('weekday')} ${part('hour')}:${part('minute')}`
}

const postDateFormat = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

/** `2024-01-12T00:00:00.000Z` becomes `12 Jan 2024`. Read in UTC, so every time zone agrees. */
export function formatPostDate(iso: string): string {
  return postDateFormat.format(new Date(iso))
}

/** `francisaguilar21` from the GitHub entry of `site.socials`, if there is one. */
export function githubUsername(socials: { label: string; url: string }[]): string | undefined {
  const url = socials.find((social) => social.label.toLowerCase() === 'github')?.url
  return url?.replace(/\/+$/, '').split('/').pop() || undefined
}

/** `2.4` becomes `3 min`. Anything under a minute still reads as 1. */
export function formatReadMinutes(minutes: number): string {
  return `${Math.max(1, Math.ceil(minutes))} min`
}
