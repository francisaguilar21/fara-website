/**
 * Maintenance mode, controlled by the PostHog feature flag `is_maintenance_mode`.
 *
 * Precedence:
 * 1. `MAINTENANCE_MODE=on|off` env var (emergency override, e.g. when PostHog is down)
 * 2. PostHog flag `is_maintenance_mode`
 * 3. Off (fail open: if PostHog can't be reached, the site stays up)
 *
 * The flag is evaluated with a fixed distinct_id, so set its release condition to
 * "100% of all users" in PostHog. It's a site-wide switch, not a per-visitor rollout.
 */

export const MAINTENANCE_FLAG_KEY = 'is_maintenance_mode'

const DISTINCT_ID = 'site-maintenance-check'
const CACHE_TTL_MS = 30_000
const REQUEST_TIMEOUT_MS = 1_500
const DEFAULT_POSTHOG_HOST = 'https://us.i.posthog.com'

let cached: { value: boolean; expiresAt: number } | null = null

type FlagsResponse = {
  // `/flags?v=2` shape
  flags?: Record<string, { enabled?: boolean }>
  // legacy `/decide` shape
  featureFlags?: Record<string, boolean | string>
}

export function parseFlag(data: FlagsResponse, key = MAINTENANCE_FLAG_KEY): boolean {
  const v2 = data.flags?.[key]?.enabled
  if (typeof v2 === 'boolean') return v2
  return Boolean(data.featureFlags?.[key])
}

async function fetchFlag(): Promise<boolean> {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!apiKey) return false

  const host = (process.env.NEXT_PUBLIC_POSTHOG_HOST || DEFAULT_POSTHOG_HOST).replace(/\/$/, '')
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const res = await fetch(`${host}/flags?v=2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, distinct_id: DISTINCT_ID }),
      signal: controller.signal,
      cache: 'no-store',
    })
    if (!res.ok) return false
    return parseFlag((await res.json()) as FlagsResponse)
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

export async function isMaintenanceMode(): Promise<boolean> {
  const override = process.env.MAINTENANCE_MODE?.toLowerCase()
  if (override === 'on') return true
  if (override === 'off') return false

  const now = Date.now()
  if (cached && cached.expiresAt > now) return cached.value

  const value = await fetchFlag()
  cached = { value, expiresAt: now + CACHE_TTL_MS }
  return value
}
