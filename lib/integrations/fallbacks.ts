// Static sample data for the live widgets (DESIGN §8). Phase 7 replaces these with real API calls
// that return the same shapes. Until then every widget renders its sample and shows a
// `<DraftChip>sample</DraftChip>`, because `isSample` is `true`.

export type StravaSummary = {
  isSample: boolean
  weekKm: number
  ytdKm: number
  avgPaceSecPerKm: number
  /** The last 12 weeks, oldest first. The final entry is the current week. */
  weeks: { weekStart: string; km: number }[]
  lastRun?: { km: number; paceSecPerKm: number; avgHr?: number; startedAt: string }
}

export type NowPlaying = {
  isSample: boolean
  isPlaying: boolean
  title: string
  artist: string
  albumArt?: string
  url?: string
}

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export type ContributionCalendar = {
  isSample: boolean
  total: number
  /** Columns of the heatmap, oldest first. Each week runs Sunday to Saturday. */
  weeks: { date: string; count: number; level: ContributionLevel }[][]
}

const WEEKLY_KM = [18.4, 22.0, 25.3, 21.1, 30.2, 27.8, 34.5, 12.0, 31.4, 36.0, 38.7, 41.2]
/** Monday of the first of the 12 weeks (the last one starts on 2026-10-12). */
const FIRST_WEEK_START = Date.UTC(2026, 6, 27)
const DAY_MS = 24 * 60 * 60 * 1000

const isoDate = (ms: number) => new Date(ms).toISOString().slice(0, 10)

export const STRAVA_SAMPLE: StravaSummary = {
  isSample: true,
  weekKm: 41.2,
  ytdKm: 1284,
  avgPaceSecPerKm: 342,
  weeks: WEEKLY_KM.map((km, index) => ({
    weekStart: isoDate(FIRST_WEEK_START + index * 7 * DAY_MS),
    km,
  })),
  lastRun: { km: 10.2, paceSecPerKm: 348, avgHr: 152, startedAt: '2026-10-11T06:10:00+08:00' },
}

export const NOW_PLAYING_SAMPLE: NowPlaying = {
  isSample: true,
  isPlaying: true,
  title: 'Running Up That Hill',
  artist: 'Kate Bush',
}

/** GitHub's own steps: 0, then 1-2, 3-5, 6-8 and 9+ contributions in a day. */
export function contributionLevel(count: number): ContributionLevel {
  if (count <= 0) return 0
  if (count < 3) return 1
  if (count < 6) return 2
  if (count < 9) return 3
  return 4
}

/**
 * A believable year of activity, made the same way on every build (a seeded generator, so the
 * server and the browser never disagree). Quieter at weekends, with a slow wave over the year.
 */
function buildContributionSample(): ContributionCalendar {
  const weekCount = 53
  // A Sunday, so each column starts on the first row of the heatmap.
  const start = Date.UTC(2025, 9, 12)
  // The sample "today". Days after it don't exist yet, so the last column is short.
  const today = Date.UTC(2026, 9, 13)

  let seed = 21
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }

  let total = 0
  const weeks: ContributionCalendar['weeks'] = []
  for (let week = 0; week < weekCount; week++) {
    const column: ContributionCalendar['weeks'][number] = []
    for (let day = 0; day < 7; day++) {
      const when = start + (week * 7 + day) * DAY_MS
      if (when > today) break
      const weekend = day === 0 || day === 6
      const roll = random()
      const wave = 0.5 + 0.5 * Math.sin(week / 6)
      const count = roll < (weekend ? 0.55 : 0.18) ? 0 : Math.round(roll * 9 * (0.4 + wave))
      total += count
      column.push({ date: isoDate(when), count, level: contributionLevel(count) })
    }
    weeks.push(column)
  }
  return { isSample: true, total, weeks }
}

export const CONTRIBUTIONS_SAMPLE: ContributionCalendar = buildContributionSample()

/** Every fallback, by name. `pnpm check:drafts` reads this to list the samples still in use. */
export const SAMPLES = {
  strava: STRAVA_SAMPLE,
  nowPlaying: NOW_PLAYING_SAMPLE,
  contributions: CONTRIBUTIONS_SAMPLE,
} as const
