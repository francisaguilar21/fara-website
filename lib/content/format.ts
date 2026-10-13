// Display helpers for content values. Pace and durations are always derived here from the stored
// `time` and `distanceKm`, never stored themselves (DESIGN §12).

const dateFormats = {
  long: { year: 'numeric', month: 'long', day: 'numeric' },
  short: { year: 'numeric', month: 'short', day: 'numeric' },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>

/**
 * Formats an ISO date or timestamp, for example `2023-12-21` as `December 21, 2023`. Always
 * rendered in UTC, so the server and the browser agree whatever their time zones are.
 */
export function formatDate(iso: string, style: keyof typeof dateFormats = 'long'): string {
  return new Intl.DateTimeFormat('en-US', { ...dateFormats[style], timeZone: 'UTC' }).format(
    new Date(iso)
  )
}

/** `2024-01` becomes `Jan 2024`. */
export function formatMonth(yearMonth: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${yearMonth}-01T00:00:00Z`))
}

/** `Jan 2021 – Mar 2024`, or `Jan 2021 – Present` when `end` is empty. */
export function formatDateRange(start: string, end?: string): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`
}

/** `5` becomes `5 min read`. Anything under a minute still reads as 1. */
export function formatReadingTime(minutes: number): string {
  return `${Math.max(1, Math.ceil(minutes))} min read`
}

/** `1:45:30` becomes `6330` seconds. Also accepts `mm:ss`. */
export function parseDuration(time: string): number {
  const parts = time.split(':').map(Number)
  if (parts.length < 2 || parts.length > 3 || parts.some((p) => !Number.isFinite(p) || p < 0)) {
    throw new Error(`Invalid duration "${time}", expected h:mm:ss`)
  }
  return parts.reduce((total, part) => total * 60 + part, 0)
}

/** `6330` seconds becomes `1:45:30`. Under an hour it reads `m:ss`. */
export function formatDuration(totalSeconds: number): string {
  const total = Math.round(totalSeconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  const ss = String(seconds).padStart(2, '0')
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}:${ss}` : `${minutes}:${ss}`
}

/** Average pace in seconds per kilometre for a race. */
export function paceSecondsPerKm(race: { time: string; distanceKm: number }): number {
  return parseDuration(race.time) / race.distanceKm
}

/** `342` seconds per km becomes `5:42/km`. */
export function formatPace(secondsPerKm: number): string {
  return `${formatDuration(secondsPerKm)}/km`
}
