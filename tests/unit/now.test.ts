// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { daysSince, isStale, STALE_AFTER_DAYS } from '@/lib/now'

const today = new Date('2026-10-18T09:30:00+08:00')

describe('/now staleness (P6-AC8)', () => {
  it('counts whole days between the update and today', () => {
    expect(daysSince('2026-10-18', today)).toBe(0)
    expect(daysSince('2026-10-13', today)).toBe(5)
    expect(daysSince('2026-08-19', today)).toBe(60)
  })

  it('reads both dates as UTC days, so the time of day does not matter', () => {
    expect(daysSince('2026-10-17', new Date('2026-10-17T23:59:59Z'))).toBe(0)
    expect(daysSince('2026-10-17', new Date('2026-10-18T00:00:00Z'))).toBe(1)
  })

  it('is fresh up to and including 60 days', () => {
    expect(STALE_AFTER_DAYS).toBe(60)
    expect(isStale('2026-10-13', today)).toBe(false)
    expect(isStale('2026-08-19', today)).toBe(false) // exactly 60 days
  })

  it('is stale from 61 days', () => {
    expect(isStale('2026-08-18', today)).toBe(true) // 61 days
    expect(isStale('2025-01-01', today)).toBe(true)
  })

  it('is never stale for a date in the future', () => {
    expect(isStale('2026-12-01', today)).toBe(false)
  })

  it('takes a different limit', () => {
    expect(isStale('2026-10-01', today, 10)).toBe(true)
    expect(isStale('2026-10-10', today, 10)).toBe(false)
  })
})
