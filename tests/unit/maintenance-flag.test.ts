// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const flagResponse = (enabled: boolean) =>
  new Response(JSON.stringify({ flags: { is_maintenance_mode: { enabled } } }), { status: 200 })

// The module keeps a 30s cache in module scope, so each test imports a fresh copy.
async function load() {
  vi.resetModules()
  return import('@/lib/maintenance/flag')
}

describe('parseFlag', () => {
  it('reads the /flags?v=2 shape', async () => {
    const { parseFlag } = await load()
    expect(parseFlag({ flags: { is_maintenance_mode: { enabled: true } } })).toBe(true)
    expect(parseFlag({ flags: { is_maintenance_mode: { enabled: false } } })).toBe(false)
  })

  it('reads the legacy featureFlags shape', async () => {
    const { parseFlag } = await load()
    expect(parseFlag({ featureFlags: { is_maintenance_mode: true } })).toBe(true)
    expect(parseFlag({ featureFlags: { is_maintenance_mode: false } })).toBe(false)
  })

  it('prefers the v2 shape when both are present', async () => {
    const { parseFlag } = await load()
    expect(
      parseFlag({
        flags: { is_maintenance_mode: { enabled: false } },
        featureFlags: { is_maintenance_mode: true },
      })
    ).toBe(false)
  })

  it('is off when the flag is missing', async () => {
    const { parseFlag } = await load()
    expect(parseFlag({})).toBe(false)
    expect(parseFlag({ flags: {}, featureFlags: {} })).toBe(false)
  })
})

describe('isMaintenanceMode', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test')
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', '')
    vi.stubEnv('MAINTENANCE_MODE', '')
  })

  afterEach(() => {
    fetchMock.mockReset()
    vi.useRealTimers()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('MAINTENANCE_MODE=on wins over PostHog without calling it', async () => {
    vi.stubEnv('MAINTENANCE_MODE', 'on')
    fetchMock.mockResolvedValue(flagResponse(false))
    const { isMaintenanceMode } = await load()
    expect(await isMaintenanceMode()).toBe(true)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('MAINTENANCE_MODE=off wins over PostHog without calling it', async () => {
    vi.stubEnv('MAINTENANCE_MODE', 'OFF')
    fetchMock.mockResolvedValue(flagResponse(true))
    const { isMaintenanceMode } = await load()
    expect(await isMaintenanceMode()).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('asks PostHog with the fixed distinct id on the default host', async () => {
    fetchMock.mockResolvedValue(flagResponse(true))
    const { isMaintenanceMode } = await load()
    expect(await isMaintenanceMode()).toBe(true)

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://us.i.posthog.com/flags?v=2')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body as string)).toEqual({
      api_key: 'phc_test',
      distinct_id: 'site-maintenance-check',
    })
  })

  it('uses NEXT_PUBLIC_POSTHOG_HOST and drops a trailing slash', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', 'https://eu.i.posthog.com/')
    fetchMock.mockResolvedValue(flagResponse(false))
    const { isMaintenanceMode } = await load()
    await isMaintenanceMode()
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://eu.i.posthog.com/flags?v=2')
  })

  it('is off without a PostHog key', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', '')
    const { isMaintenanceMode } = await load()
    expect(await isMaintenanceMode()).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('fails open when the response is not ok', async () => {
    fetchMock.mockResolvedValue(new Response('nope', { status: 500 }))
    const { isMaintenanceMode } = await load()
    expect(await isMaintenanceMode()).toBe(false)
  })

  it('fails open when fetch throws', async () => {
    fetchMock.mockRejectedValue(new Error('network down'))
    const { isMaintenanceMode } = await load()
    expect(await isMaintenanceMode()).toBe(false)
  })

  it('fails open after the 1.5s timeout', async () => {
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new Error('aborted')))
        })
    )
    const { isMaintenanceMode } = await load()
    const result = isMaintenanceMode()
    await vi.advanceTimersByTimeAsync(1_500)
    expect(await result).toBe(false)
  })

  it('caches the answer for 30 seconds', async () => {
    fetchMock.mockImplementation(async () => flagResponse(true))
    const { isMaintenanceMode } = await load()

    expect(await isMaintenanceMode()).toBe(true)
    await vi.advanceTimersByTimeAsync(29_000)
    expect(await isMaintenanceMode()).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(2_000)
    await isMaintenanceMode()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
