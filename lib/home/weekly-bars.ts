export type Week = { weekStart: string; km: number }

export type WeeklyBarsGeometry = {
  width: number
  height: number
  /** Top of the value axis, in km. */
  max: number
  gridlines: { km: number; y: number }[]
  bars: { x: number; y: number; width: number; height: number; km: number; current: boolean }[]
}

type Layout = {
  width?: number
  height?: number
  /** Room for the axis labels on the left. */
  left?: number
  top?: number
  bottom?: number
}

/** Rounds up to the next 5 km, so the tallest bar fills most of the chart without touching the top. */
const niceMax = (km: number) => Math.max(5, Math.ceil(km / 5) * 5)

/**
 * Where everything in the weekly bar chart goes. Heights are to scale: a bar's height divided by
 * the plot height is its distance divided by `max`, and the baseline is 0 km. The final entry is
 * the current week.
 */
export function weeklyBarsGeometry(
  weeks: Week[],
  { width = 480, height = 120, left = 40, top = 18, bottom = 20 }: Layout = {}
): WeeklyBarsGeometry {
  const max = niceMax(Math.max(0, ...weeks.map((week) => week.km)))
  const plot = height - top - bottom
  const yFor = (km: number) => height - bottom - (km / max) * plot
  const slot = (width - left) / Math.max(1, weeks.length)

  const step = max > 100 ? 50 : 20
  const gridlines = []
  for (let km = 0; km <= max; km += step) gridlines.push({ km, y: yFor(km) })

  const bars = weeks.map((week, index) => {
    const barHeight = (week.km / max) * plot
    return {
      x: left + index * slot + 4,
      y: height - bottom - barHeight,
      width: slot - 10,
      height: barHeight,
      km: week.km,
      current: index === weeks.length - 1,
    }
  })

  return { width, height, max, gridlines, bars }
}

/** The chart in words, for the `aria-label` of the SVG. */
export function describeWeeklyBars(weeks: Week[], { sample }: { sample: boolean }): string {
  if (weeks.length === 0) return 'Weekly running distance: no data'
  const values = weeks.map((week) => week.km).join(', ')
  const last = weeks[weeks.length - 1]!
  return (
    `Weekly running distance in km over the last ${weeks.length} weeks, oldest first: ${values}. ` +
    `This week: ${last.km} km.${sample ? ' Sample data.' : ''}`
  )
}
