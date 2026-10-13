import type { ContributionCalendar, ContributionLevel } from '@/lib/integrations/fallbacks'

/** One cell is 11px with a 3px gap, so cells sit 14px apart. */
export const CELL = 11
export const GAP = 3
export const PITCH = CELL + GAP
const RADIUS = 2

export const LEVELS: ContributionLevel[] = [0, 1, 2, 3, 4]

export type HeatmapGeometry = {
  width: number
  height: number
  /** One SVG path per level (0 to 4), each drawing every cell of that level. */
  paths: Record<ContributionLevel, string>
  /** Contributions per day, week by week, so `counts[week * 7 + day]`. */
  counts: number[]
  /** The date of the first cell (a Sunday), `YYYY-MM-DD`. */
  start: string
}

/** A rounded square with its top-left corner at (x, y). */
const cellPath = (x: number, y: number) =>
  `M${x + RADIUS} ${y}h${CELL - 2 * RADIUS}a${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} ${RADIUS}v${CELL - 2 * RADIUS}a${RADIUS} ${RADIUS} 0 0 1 -${RADIUS} ${RADIUS}h-${CELL - 2 * RADIUS}a${RADIUS} ${RADIUS} 0 0 1 -${RADIUS} -${RADIUS}v-${CELL - 2 * RADIUS}a${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} -${RADIUS}z`

/**
 * Lays the calendar out as a grid, a column per week and a row per weekday, and groups the cells
 * by level into five paths. That is five elements for 371 cells: the page has far less to parse,
 * lay out and hydrate than with a box per day.
 */
export function heatmapGeometry({ weeks }: ContributionCalendar): HeatmapGeometry {
  const paths: Record<ContributionLevel, string> = { 0: '', 1: '', 2: '', 3: '', 4: '' }
  const counts: number[] = []

  weeks.forEach((week, column) => {
    week.forEach((day, row) => {
      paths[day.level] += cellPath(column * PITCH, row * PITCH)
      counts[column * 7 + row] = day.count
    })
  })

  return {
    width: weeks.length * PITCH - GAP,
    height: 7 * PITCH - GAP,
    paths,
    counts,
    start: weeks[0]?.[0]?.date ?? '',
  }
}

/**
 * The cell under a point, in the graph's own pixels (0,0 is its top-left corner), or `null` for a
 * gap between cells, the space past the last (short) week, or outside the graph.
 */
export function cellAt(
  x: number,
  y: number,
  counts: number[]
): { column: number; row: number; index: number } | null {
  if (x < 0 || y < 0) return null
  const column = Math.floor(x / PITCH)
  const row = Math.floor(y / PITCH)
  if (row > 6 || x % PITCH >= CELL || y % PITCH >= CELL) return null
  const index = column * 7 + row
  return counts[index] === undefined ? null : { column, row, index }
}

/** The date of the cell at `index`, `YYYY-MM-DD`, counting days from `start`. */
export function dateAt(start: string, index: number): string {
  const date = new Date(`${start}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + index)
  return date.toISOString().slice(0, 10)
}
