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
