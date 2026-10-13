import { NextRequest, NextResponse } from 'next/server'
import { isMaintenanceMode } from './lib/maintenance/flag'
import { renderMaintenancePage } from './lib/maintenance/page'

const BYPASS_COOKIE = 'fa_maintenance_bypass'
const BYPASS_PARAM = 'preview'
const RETRY_AFTER_SECONDS = 60 * 60 * 24

// Comma-separated path prefixes that stay reachable during maintenance, e.g. "/blog,/rss.xml"
function isAllowedPath(pathname: string): boolean {
  const allowed = (process.env.MAINTENANCE_ALLOWED_PATHS || '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  return allowed.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export async function proxy(request: NextRequest) {
  const token = process.env.MAINTENANCE_BYPASS_TOKEN
  const { searchParams, pathname } = request.nextUrl

  // `?preview=<token>` lets the owner see the real site while maintenance is on.
  if (token && searchParams.get(BYPASS_PARAM) === token) {
    const url = request.nextUrl.clone()
    url.searchParams.delete(BYPASS_PARAM)
    const response = NextResponse.redirect(url)
    response.cookies.set(BYPASS_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  }

  if (token && request.cookies.get(BYPASS_COOKIE)?.value === token) return NextResponse.next()
  if (isAllowedPath(pathname)) return NextResponse.next()
  if (!(await isMaintenanceMode())) return NextResponse.next()

  // 503 + Retry-After tells search engines the outage is temporary, so pages aren't de-indexed.
  return new NextResponse(renderMaintenancePage(), {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': String(RETRY_AFTER_SECONDS),
      'Cache-Control': 'no-store',
    },
  })
}

export const config = {
  // Skip Next.js internals, public assets and machine-readable files.
  matcher: [
    '/((?!_next/static|_next/image|static/|api/|favicon.ico|robots.txt|sitemap.xml|feed.xml|search.json).*)',
  ],
}
