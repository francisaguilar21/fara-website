import { afterEach, describe, expect, it, vi } from 'vitest'
import { getBookingUrl } from '@/lib/booking'

afterEach(() => vi.unstubAllEnvs())

describe('getBookingUrl', () => {
  it('returns the URL in NEXT_PUBLIC_BOOKING_URL', () => {
    vi.stubEnv('NEXT_PUBLIC_BOOKING_URL', 'https://calendar.app.google/abc123')
    expect(getBookingUrl()).toBe('https://calendar.app.google/abc123')
  })

  it('trims whitespace around it', () => {
    vi.stubEnv('NEXT_PUBLIC_BOOKING_URL', '  https://calendar.app.google/abc123 \n')
    expect(getBookingUrl()).toBe('https://calendar.app.google/abc123')
  })

  it('is undefined when the variable is empty or only whitespace', () => {
    vi.stubEnv('NEXT_PUBLIC_BOOKING_URL', '')
    expect(getBookingUrl()).toBeUndefined()
    vi.stubEnv('NEXT_PUBLIC_BOOKING_URL', '   ')
    expect(getBookingUrl()).toBeUndefined()
  })

  it('is undefined when the variable is not set', () => {
    vi.stubEnv('NEXT_PUBLIC_BOOKING_URL', undefined)
    expect(getBookingUrl()).toBeUndefined()
  })

  it('is undefined for something that is not a web address, rather than a dead link', () => {
    for (const value of [
      'calendar.google.com',
      'not a url',
      'javascript:alert(1)',
      'mailto:a@b.co',
    ]) {
      vi.stubEnv('NEXT_PUBLIC_BOOKING_URL', value)
      expect(getBookingUrl(), value).toBeUndefined()
    }
  })
})
