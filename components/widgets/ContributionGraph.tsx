import { UnderlineLink } from '@/components/ui/UnderlineLink'
import { cn } from '@/lib/cn'
import { heatmapGeometry, LEVELS } from '@/lib/home/heatmap'
import type { ContributionCalendar, ContributionLevel } from '@/lib/integrations/fallbacks'
import { ContributionTooltip } from './ContributionTooltip'

/** GitHub's green becomes rose: five steps from `--line` to `--accent`. */
const LEVEL_FILL: Record<ContributionLevel, string> = {
  0: 'fill-line',
  1: 'fill-[color-mix(in_srgb,var(--accent)_28%,var(--line))]',
  2: 'fill-[color-mix(in_srgb,var(--accent)_50%,var(--line))]',
  3: 'fill-[color-mix(in_srgb,var(--accent)_75%,var(--line))]',
  4: 'fill-accent',
}

const LEVEL_BG: Record<ContributionLevel, string> = {
  0: 'bg-line',
  1: 'bg-[color-mix(in_srgb,var(--accent)_28%,var(--line))]',
  2: 'bg-[color-mix(in_srgb,var(--accent)_50%,var(--line))]',
  3: 'bg-[color-mix(in_srgb,var(--accent)_75%,var(--line))]',
  4: 'bg-accent',
}

type ContributionGraphProps = {
  calendar: ContributionCalendar
  /** GitHub username, shown as a link under the graph when there is one. */
  username?: string
}

const numberFormat = new Intl.NumberFormat('en-US')

/**
 * The 53×7 contribution heatmap: one cell per day, a column per week, in five rose steps. On a
 * phone it scrolls sideways inside its own box, never the page. It is an image for assistive tech
 * (the total and the busiest day are in its label), and hovering a cell shows its date and count.
 *
 * It is one SVG with a path per level, not a box per day: 371 elements fewer to parse, lay out
 * and hydrate. The tooltip finds the cell from the pointer position.
 */
export function ContributionGraph({ calendar, username }: ContributionGraphProps) {
  const { width, height, paths, counts, start } = heatmapGeometry(calendar)
  const busiest = calendar.weeks
    .flat()
    .reduce((best, day) => (day.count > best.count ? day : best), { count: -1, date: '' })
  const description =
    `GitHub contributions over the last ${calendar.weeks.length} weeks: ` +
    `${numberFormat.format(calendar.total)} in total` +
    (busiest.count >= 0 ? `, the most in one day ${busiest.count} on ${busiest.date}.` : '.') +
    (calendar.isSample ? ' Sample data.' : '')

  return (
    <div>
      <h2
        id="github-heading"
        className="mb-5 font-display text-[clamp(1.375rem,2.4vw,1.75rem)] leading-[1.05] font-medium tracking-[-0.02em]"
      >
        <span data-testid="contribution-total">{numberFormat.format(calendar.total)}</span>{' '}
        contributions this year
      </h2>

      <div className="relative">
        {/* The box that scrolls sideways on a phone. axe asks for a scrollable box to be
            reachable by keyboard, hence the tab stop. */}
        <div
          role="region"
          aria-label="Contribution heatmap (scrolls sideways)"
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          className="overflow-x-auto pb-1.5"
        >
          <svg
            role="img"
            aria-label={description}
            data-testid="contribution-heatmap"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="block max-w-none"
          >
            {LEVELS.map((level) => (
              <path key={level} d={paths[level]} data-level={level} className={LEVEL_FILL[level]} />
            ))}
          </svg>
        </div>
        <ContributionTooltip start={start} counts={counts} />
      </div>

      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
        {username ? (
          <UnderlineLink
            href={`https://github.com/${username}`}
            external
            className="label"
            aria-label={`${username} on GitHub (opens in a new tab)`}
          >
            @{username} ↗
          </UnderlineLink>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-[3px] label" aria-hidden="true">
          Less
          {LEVELS.map((level) => (
            <i
              key={level}
              className={cn('inline-block size-[11px] rounded-[2px]', LEVEL_BG[level])}
            />
          ))}
          More
        </span>
      </div>
    </div>
  )
}
