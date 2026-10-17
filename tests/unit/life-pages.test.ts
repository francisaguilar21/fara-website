// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { getPacing } from '@/lib/content'
import { PacingSchema } from '@/lib/content/schemas'
import { groupByYear } from '@/lib/life/group'
import { defaultDirection, formatRaceDistance, sortRaces } from '@/lib/life/races'

const races = [
  {
    name: 'B Run',
    date: '2025-03-01',
    distanceKm: 21.0975,
    time: '1:50:00',
    role: 'runner' as const,
  },
  { name: 'A Run', date: '2026-01-01', distanceKm: 10, time: '0:55:00', role: 'pacer' as const },
  {
    name: 'C Run',
    date: '2024-06-01',
    distanceKm: 42.195,
    time: '4:30:00',
    role: 'runner' as const,
  },
]
const names = (list: { name: string }[]) => list.map((race) => race.name)

describe('sortRaces (P6-R10)', () => {
  it('sorts by date', () => {
    expect(names(sortRaces(races, 'date', 'desc'))).toEqual(['A Run', 'B Run', 'C Run'])
    expect(names(sortRaces(races, 'date', 'asc'))).toEqual(['C Run', 'B Run', 'A Run'])
  })

  it('sorts by distance, by time and by name', () => {
    expect(names(sortRaces(races, 'distance', 'asc'))).toEqual(['A Run', 'B Run', 'C Run'])
    expect(names(sortRaces(races, 'time', 'desc'))).toEqual(['C Run', 'B Run', 'A Run'])
    expect(names(sortRaces(races, 'name', 'asc'))).toEqual(['A Run', 'B Run', 'C Run'])
  })

  it('sorts by pace, not by time: the 10 km at 5:30/km is slower than the half at 5:13/km', () => {
    // 55:00 over 10 km is 5:30/km; 1:50:00 over 21.1 km is 5:13/km; 4:30:00 over 42.2 km is 6:24/km.
    expect(names(sortRaces(races, 'pace', 'asc'))).toEqual(['B Run', 'A Run', 'C Run'])
  })

  it('sorts by role, breaking ties with the newest date', () => {
    expect(names(sortRaces(races, 'role', 'asc'))).toEqual(['A Run', 'B Run', 'C Run'])
    // Descending puts the runners first; the tie between B and C falls back to the newest date.
    expect(names(sortRaces(races, 'role', 'desc'))).toEqual(['B Run', 'C Run', 'A Run'])
  })

  it('does not change the list it is given', () => {
    const copy = [...races]
    sortRaces(races, 'distance', 'desc')
    expect(races).toEqual(copy)
  })

  it('starts date and distance newest and longest first, the rest ascending', () => {
    expect(defaultDirection('date')).toBe('desc')
    expect(defaultDirection('distance')).toBe('desc')
    expect(defaultDirection('time')).toBe('asc')
    expect(defaultDirection('name')).toBe('asc')
  })
})

describe('formatRaceDistance', () => {
  it('rounds to one decimal and drops a trailing zero', () => {
    expect(formatRaceDistance(21.0975)).toBe('21.1 km')
    expect(formatRaceDistance(42.195)).toBe('42.2 km')
    expect(formatRaceDistance(10)).toBe('10 km')
  })
})

describe('groupByYear (P6-R11)', () => {
  it('groups by year, newest year first, keeping the order inside a year', () => {
    const groups = groupByYear([
      { date: '2024-05-01', id: 'a' },
      { date: '2026-02-01', id: 'b' },
      { date: '2024-01-01', id: 'c' },
    ])
    expect(groups.map((group) => group.year)).toEqual(['2026', '2024'])
    expect(groups[1]!.items.map((item) => item.id)).toEqual(['a', 'c'])
  })

  it('returns nothing for nothing', () => {
    expect(groupByYear([])).toEqual([])
  })
})

describe('pacing', () => {
  it('has a club, a start year and paces led', () => {
    expect(PacingSchema.safeParse(getPacing()).success).toBe(true)
  })

  it('rejects a block without a club', () => {
    expect(PacingSchema.safeParse({ club: '', since: 2022, pacesLed: [] }).success).toBe(false)
  })
})
