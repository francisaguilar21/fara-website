// @vitest-environment node
import { codeToHtml } from 'shiki'
import { describe, expect, it } from 'vitest'

// P4-R7: at minimum these languages, in both themes `velite.config.ts` hands to rehype-pretty-code.
const SAMPLES = {
  javascript: "const answer = await fetch('/api')",
  typescript: 'const answer: number = 42',
  http: 'GET /blog HTTP/1.1\nHost: francisaguilar.co',
  bash: 'pnpm install && pnpm build',
  json: '{ "name": "fara-website" }',
  tsx: 'export const A = () => <b>hi</b>',
} as const

describe.each(Object.entries(SAMPLES))('%s', (lang, code) => {
  it('highlights with a light and a dark color per token', async () => {
    const html = await codeToHtml(code, {
      lang,
      themes: { dark: 'github-dark-dimmed', light: 'github-light' },
      defaultColor: false,
    })
    expect(html).toContain('--shiki-light:')
    expect(html).toContain('--shiki-dark:')
  })
})
