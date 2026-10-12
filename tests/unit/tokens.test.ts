// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { AA_TEXT, contrastRatio } from '@/lib/design/contrast'
import { readTokens, TEXT_PAIRS, TOKEN_NAMES } from '@/lib/design/tokens'

const tokens = readTokens()

describe('contrastRatio', () => {
  it('is 21 for black on white and 1 for identical colors', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5)
    expect(contrastRatio('#336699', '#336699')).toBe(1)
  })

  it('does not depend on argument order', () => {
    expect(contrastRatio('#f43f5e', '#0b0a0b')).toBe(contrastRatio('#0b0a0b', '#f43f5e'))
  })
})

describe('color tokens', () => {
  it.each(['dark', 'light'] as const)('defines every token for the %s theme', (theme) => {
    for (const name of TOKEN_NAMES) expect(tokens[theme][name]).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('matches DESIGN §3.3', () => {
    expect(tokens.dark).toMatchObject({ bg: '#0b0a0b', accent: '#f43f5e', fg: '#f5f2f3' })
    expect(tokens.light).toMatchObject({ bg: '#faf9f9', accent: '#df1d47', fg: '#141112' })
  })

  describe.each(['dark', 'light'] as const)('%s theme text contrast (WCAG AA)', (theme) => {
    it.each(TEXT_PAIRS)('%s on %s is at least 4.5:1', (text, background) => {
      const ratio = contrastRatio(tokens[theme][text], tokens[theme][background])
      expect(ratio).toBeGreaterThanOrEqual(AA_TEXT)
    })
  })
})
