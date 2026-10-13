// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  formatDate,
  formatDateRange,
  formatDuration,
  formatMonth,
  formatPace,
  formatReadingTime,
  paceSecondsPerKm,
  parseDuration,
} from '@/lib/content/format'
import { slugifyTag } from '@/lib/content/tags'

describe('parseDuration and formatDuration', () => {
  it('parses h:mm:ss and mm:ss', () => {
    expect(parseDuration('1:45:30')).toBe(6330)
    expect(parseDuration('0:55:00')).toBe(3300)
    expect(parseDuration('25:10')).toBe(1510)
  })

  it('rejects anything else', () => {
    expect(() => parseDuration('45')).toThrow('Invalid duration')
    expect(() => parseDuration('a:bb:cc')).toThrow('Invalid duration')
  })

  it('formats as h:mm:ss, or m:ss under an hour', () => {
    expect(formatDuration(6330)).toBe('1:45:30')
    expect(formatDuration(3599)).toBe('59:59')
    expect(formatDuration(3600)).toBe('1:00:00')
    expect(formatDuration(5)).toBe('0:05')
  })

  it('round-trips', () => {
    expect(formatDuration(parseDuration('4:07:09'))).toBe('4:07:09')
  })
})

describe('pace', () => {
  it('derives seconds per km from the finish time and the distance', () => {
    expect(paceSecondsPerKm({ time: '0:50:00', distanceKm: 10 })).toBe(300)
    expect(paceSecondsPerKm({ time: '1:59:59', distanceKm: 21.0975 })).toBeCloseTo(341.2, 1)
  })

  it('formats as m:ss/km', () => {
    expect(formatPace(300)).toBe('5:00/km')
    expect(formatPace(342)).toBe('5:42/km')
    expect(formatPace(341.5)).toBe('5:42/km')
    expect(formatPace(5 * 60 + 59.6)).toBe('6:00/km')
    expect(formatPace(paceSecondsPerKm({ time: '4:30:00', distanceKm: 42.195 }))).toBe('6:24/km')
  })
})

describe('dates', () => {
  it('formats ISO dates and timestamps in UTC', () => {
    expect(formatDate('2023-12-21')).toBe('December 21, 2023')
    expect(formatDate('2024-01-08T00:00:00.000Z', 'short')).toBe('Jan 8, 2024')
  })

  it('formats YYYY-MM months and ranges', () => {
    expect(formatMonth('2024-01')).toBe('Jan 2024')
    expect(formatDateRange('2019-03', '2024-01')).toBe('Mar 2019 – Jan 2024')
    expect(formatDateRange('2024-01', '')).toBe('Jan 2024 – Present')
    expect(formatDateRange('2024-01')).toBe('Jan 2024 – Present')
  })
})

describe('formatReadingTime', () => {
  it('rounds up and never reads below 1 minute', () => {
    expect(formatReadingTime(4.2)).toBe('5 min read')
    expect(formatReadingTime(0)).toBe('1 min read')
  })
})

describe('slugifyTag', () => {
  it('is lowercase and hyphenated', () => {
    expect(slugifyTag('Machine Learning')).toBe('machine-learning')
    expect(slugifyTag('  Next.js & React  ')).toBe('next-js-react')
    expect(slugifyTag('Café')).toBe('cafe')
    expect(slugifyTag('technology')).toBe('technology')
  })
})
