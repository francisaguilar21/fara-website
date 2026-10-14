import { describeWeeklyBars, weeklyBarsGeometry, type Week } from '@/lib/home/weekly-bars'

/**
 * Distance per week as bars drawn to scale (0 km at the baseline), the current week in rose. A
 * plain SVG, no chart library. It is an image for assistive tech, with the numbers in its label.
 */
export function WeeklyBars({ weeks, sample }: { weeks: Week[]; sample: boolean }) {
  const { width, height, gridlines, bars } = weeklyBarsGeometry(weeks)
  const label = 'font-mono text-[10px] fill-muted'

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={describeWeeklyBars(weeks, { sample })}
      className="block h-auto w-full"
    >
      {gridlines.map(({ km, y }) => (
        <g key={km}>
          <line x1={40} x2={width} y1={y} y2={y} className="stroke-line" strokeWidth={1} />
          <text x={0} y={y + 3} className={label}>
            {km} km
          </text>
        </g>
      ))}
      {bars.map((bar) => (
        <g key={bar.x}>
          <rect
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            className={bar.current ? 'fill-accent' : 'fill-line'}
          />
          {bar.current ? (
            <text
              x={bar.x + bar.width / 2}
              y={bar.y - 5}
              textAnchor="middle"
              className="fill-fg font-mono text-[10px]"
            >
              {bar.km}
            </text>
          ) : null}
        </g>
      ))}
      <text x={44} y={height - 4} className={label}>
        {weeks.length} wks ago
      </text>
      <text x={width - 6} y={height - 4} textAnchor="end" className={label}>
        this week
      </text>
    </svg>
  )
}
