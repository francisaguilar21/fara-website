/**
 * The Google Calendar appointment schedule URL, from `NEXT_PUBLIC_BOOKING_URL`, or `undefined`
 * when it is not set (or is not an http(s) URL). Callers must not render a booking link without
 * it: they fall back to the contact form.
 *
 * It is an environment variable, not content, so it can be set in Vercel without a commit. The
 * `process.env.NEXT_PUBLIC_*` lookup has to stay a literal one: Next inlines it at build time, so
 * after changing it in Vercel the site needs a redeploy.
 */
export function getBookingUrl(): string | undefined {
  const value = process.env.NEXT_PUBLIC_BOOKING_URL?.trim()
  if (!value) return undefined
  try {
    const { protocol } = new URL(value)
    return protocol === 'https:' || protocol === 'http:' ? value : undefined
  } catch {
    return undefined
  }
}
