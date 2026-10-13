import type { NextConfig } from 'next'
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } from 'next/constants'

// Phase 7 adds the PostHog hosts to `script-src` and `connect-src`.
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' app.posthog.com;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src *.s3.amazonaws.com;
  connect-src *;
  font-src 'self'
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy.replace(/\n/g, '') },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  { key: 'X-Frame-Options', value: 'DENY' },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

// Builds the content (`velite.config.ts`) before Next reads it, as the Velite docs recommend for
// Turbopack. `next dev` watches and tolerates schema errors, so a typo doesn't kill the dev server.
// `next build` is strict: a schema error fails the build with the file and field named.
// (Top-level await doesn't work here: Next.js loads this file as CommonJS.)
export default async function config(phase: string) {
  // The env flag stops the Next.js build workers, which load this file again, from rebuilding.
  if (phase !== PHASE_PRODUCTION_SERVER && !process.env.VELITE_STARTED) {
    process.env.VELITE_STARTED = '1'
    const isDev = phase === PHASE_DEVELOPMENT_SERVER
    const { build } = await import('velite')
    await build({ watch: isDev, clean: !isDev, strict: !isDev })
  }
  return nextConfig
}
