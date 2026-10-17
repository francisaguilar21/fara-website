'use client'

import { useState } from 'react'
import { DraftChip } from '@/components/ui/DraftChip'
import { cn } from '@/lib/cn'
import { formatDate, formatPace, paceSecondsPerKm } from '@/lib/content/format'
import type { Race } from '@/lib/content'
import {
  defaultDirection,
  formatRaceDistance,
  sortRaces,
  type RaceSortKey,
  type SortDirection,
} from '@/lib/life/races'

const COLUMNS: { key: RaceSortKey; label: string; numeric?: boolean }[] = [
  { key: 'date', label: 'Date' },
  { key: 'name', label: 'Race' },
  { key: 'distance', label: 'Distance', numeric: true },
  { key: 'time', label: 'Time', numeric: true },
  { key: 'pace', label: 'Pace', numeric: true },
  { key: 'role', label: 'Role' },
]

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const

/**
 * The race log (P6-R10): a table you sort by any column, newest first to begin with. The column
 * headers are buttons, so the keyboard sorts too, and `aria-sort` says which one is on. PRs get a
 * rose badge and time. Under the width of the table it scrolls sideways inside its own box, which
 * is focusable so the keyboard can scroll it. Without JavaScript it is the plain table, newest first.
 */
export function RaceTable({ races }: { races: Race[] }) {
  const [sort, setSort] = useState<{ key: RaceSortKey; direction: SortDirection }>({
    key: 'date',
    direction: 'desc',
  })
  const rows = sortRaces(races, sort.key, sort.direction)

  const press = (key: RaceSortKey) =>
    setSort((current) => ({
      key,
      direction:
        current.key === key
          ? current.direction === 'asc'
            ? 'desc'
            : 'asc'
          : defaultDirection(key),
    }))

  return (
    <div
      role="region"
      aria-label="Race table, scrollable"
      // A scrollable box must be focusable, or keyboard users cannot scroll it (axe: scrollable-region-focusable).
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      className="overflow-x-auto border-y border-line focus-visible:outline-2 focus-visible:outline-accent"
    >
      <table className="w-full min-w-[640px] border-collapse text-left">
        <caption className="sr-only">
          Races, sorted by {COLUMNS.find((column) => column.key === sort.key)?.label.toLowerCase()},{' '}
          {ARIA_SORT[sort.direction]}. Press a column header to sort.
        </caption>
        <thead>
          <tr className="border-b border-line">
            {COLUMNS.map((column) => {
              const active = sort.key === column.key
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={active ? ARIA_SORT[sort.direction] : 'none'}
                  className={cn('p-0 font-normal', column.numeric && 'text-right')}
                >
                  <button
                    type="button"
                    onClick={() => press(column.key)}
                    className={cn(
                      'inline-flex w-full cursor-pointer items-center gap-1.5 px-3 py-3 label transition-colors hover:text-accent',
                      column.numeric && 'justify-end',
                      active && 'text-fg'
                    )}
                  >
                    {column.label}
                    <span aria-hidden="true" className="inline-block w-3 text-accent">
                      {active ? (sort.direction === 'asc' ? '↑' : '↓') : ''}
                    </span>
                  </button>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((race) => (
            <tr
              key={`${race.date}-${race.name}`}
              data-pr={race.pr}
              className="border-b border-line last:border-b-0"
            >
              <td className="px-3 py-3.5 font-mono text-[0.8125rem] whitespace-nowrap text-muted">
                <time dateTime={race.date}>{formatDate(race.date, 'short')}</time>
              </td>
              <td className="px-3 py-3.5">
                {race.resultsUrl ? (
                  <a
                    href={race.resultsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-grow"
                  >
                    {race.name}
                  </a>
                ) : (
                  race.name
                )}
                {race.draft ? <DraftChip className="ml-1.5" /> : null}
              </td>
              <td className="px-3 py-3.5 text-right data text-[0.9375rem] whitespace-nowrap">
                {formatRaceDistance(race.distanceKm)}
              </td>
              <td
                className={cn(
                  'px-3 py-3.5 text-right data text-[0.9375rem] whitespace-nowrap',
                  race.pr && 'text-accent'
                )}
              >
                {race.pr ? (
                  <span className="mr-2 border border-accent px-1.5 py-[3px] align-middle font-mono text-[0.625rem] leading-none font-medium tracking-[0.08em]">
                    PR
                  </span>
                ) : null}
                {race.time}
              </td>
              <td className="px-3 py-3.5 text-right data text-[0.9375rem] whitespace-nowrap text-muted">
                {formatPace(paceSecondsPerKm(race))}
              </td>
              <td className="px-3 py-3.5 text-[0.9375rem] whitespace-nowrap capitalize">
                {race.role}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
