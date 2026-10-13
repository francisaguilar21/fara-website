// @vitest-environment node
import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isMaintenanceMode } from '@/lib/maintenance/flag'
import { config, proxy } from '@/proxy'

vi.mock('@/lib/maintenance/flag', () => ({ isMaintenanceMode: vi.fn() }))

const TOKEN = 'a-long-random-bypass-token-for-tests'
const isOn = vi.mocked(isMaintenanceMode)

const request = (path: string, cookie?: string) =>
  new NextRequest(`https://francisaguilar.co${path}`, {
    headers: cookie ? { cookie } : undefined,
  })

// `NextResponse.next()` marks the response with this header.
const passesThrough = (res: Response) => res.headers.get('x-middleware-next') === '1'

describe('proxy (maintenance mode)', () => {
  beforeEach(() => {
    vi.stubEnv('MAINTENANCE_BYPASS_TOKEN', TOKEN)
    vi.stubEnv('MAINTENANCE_ALLOWED_PATHS', '')
    isOn.mockResolvedValue(true)
  })

  afterEach(() => {
    isOn.mockReset()
    vi.unstubAllEnvs()
  })

  it('passes through when maintenance is off', async () => {
    isOn.mockResolvedValue(false)
    expect(passesThrough(await proxy(request('/')))).toBe(true)
  })

  it('answers 503 with the maintenance page when it is on', async () => {
    const res = await proxy(request('/work'))
    expect(res.status).toBe(503)
    expect(res.headers.get('Retry-After')).toBe('86400')
    expect(res.headers.get('Cache-Control')).toBe('no-store')
    expect(res.headers.get('Content-Type')).toContain('text/html')
    expect(await res.text()).toContain('<!doctype html>')
  })

  describe('MAINTENANCE_ALLOWED_PATHS', () => {
    beforeEach(() => vi.stubEnv('MAINTENANCE_ALLOWED_PATHS', '/blog, /rss.xml'))

    it.each(['/blog', '/blog/hello-world', '/rss.xml'])('lets %s through', async (path) => {
      expect(passesThrough(await proxy(request(path)))).toBe(true)
    })

    it.each(['/blogger', '/', '/work/blog'])('still blocks %s', async (path) => {
      expect((await proxy(request(path))).status).toBe(503)
    })
  })

  describe('owner bypass', () => {
    it('trades ?preview=<token> for a cookie and redirects without the token', async () => {
      const res = await proxy(request(`/work?preview=${TOKEN}&ref=x`))
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe('https://francisaguilar.co/work?ref=x')

      const cookie = res.headers.get('set-cookie') ?? ''
      expect(cookie).toContain(`fa_maintenance_bypass=${TOKEN}`)
      expect(cookie).toMatch(/HttpOnly/i)
      expect(cookie).toMatch(/Secure/i)
      expect(cookie).toMatch(/SameSite=lax/i)
      expect(cookie).toContain(`Max-Age=${60 * 60 * 24 * 7}`)
    })

    it('ignores a wrong token', async () => {
      const res = await proxy(request('/?preview=wrong'))
      expect(res.status).toBe(503)
    })

    it('passes through with the cookie, without asking PostHog', async () => {
      const res = await proxy(request('/', `fa_maintenance_bypass=${TOKEN}`))
      expect(passesThrough(res)).toBe(true)
      expect(isOn).not.toHaveBeenCalled()
    })

    it('ignores the cookie when it does not match', async () => {
      const res = await proxy(request('/', 'fa_maintenance_bypass=stale'))
      expect(res.status).toBe(503)
    })

    it('is disabled when MAINTENANCE_BYPASS_TOKEN is unset', async () => {
      vi.stubEnv('MAINTENANCE_BYPASS_TOKEN', '')
      expect((await proxy(request('/?preview='))).status).toBe(503)
      expect((await proxy(request('/', 'fa_maintenance_bypass='))).status).toBe(503)
    })
  })

  describe('matcher', () => {
    const [matcher] = config.matcher
    const matches = (path: string) => new RegExp(`^${matcher}$`).test(path)

    it.each([
      '/_next/static/chunks/main.js',
      '/_next/image',
      '/static/images/fara-dp.webp',
      '/api/now-playing',
      '/favicon.ico',
      '/robots.txt',
      '/sitemap.xml',
      '/feed.xml',
      '/search.json',
    ])('skips %s', (path) => {
      expect(matches(path)).toBe(false)
    })

    it.each(['/', '/work', '/blog/hello-world'])('runs on %s', (path) => {
      expect(matches(path)).toBe(true)
    })
  })
})
