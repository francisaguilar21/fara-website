import { readFileSync } from 'node:fs'
import path from 'node:path'

export type Theme = 'dark' | 'light'
export type TokenName =
  'bg' | 'surface' | 'line' | 'fg' | 'muted' | 'accent' | 'accent-ink' | 'ok' | 'error'

export const TOKEN_NAMES: TokenName[] = [
  'bg',
  'surface',
  'line',
  'fg',
  'muted',
  'accent',
  'accent-ink',
  'ok',
  'error',
]

/** Text on background pairs that must pass AA (4.5:1). `line` is a border, so it isn't listed. */
export const TEXT_PAIRS: [text: TokenName, background: TokenName][] = [
  ['fg', 'bg'],
  ['fg', 'surface'],
  ['muted', 'bg'],
  ['muted', 'surface'],
  ['accent', 'bg'],
  ['accent', 'surface'],
  ['accent-ink', 'accent'],
  ['ok', 'bg'],
  ['error', 'bg'],
]

/** Reads the color tokens from `app/globals.css`, so the CSS stays the single source of truth. */
export function readTokens(
  css = readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8')
): Record<Theme, Record<TokenName, string>> {
  const result = { dark: {}, light: {} } as Record<Theme, Record<string, string>>

  // Matches `[data-theme='dark'] { ... }` and `[data-theme='light'] { ... }` rule blocks only.
  for (const [, theme, body] of css.matchAll(/\[data-theme='(dark|light)'\]\s*\{([^}]*)\}/g)) {
    for (const [, name, value] of (body ?? '').matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
      if (theme === 'dark' || theme === 'light') result[theme][name as string] = value as string
    }
  }

  for (const theme of ['dark', 'light'] as const) {
    for (const name of TOKEN_NAMES) {
      if (!result[theme][name]) throw new Error(`Missing --${name} for the ${theme} theme`)
    }
  }
  return result as Record<Theme, Record<TokenName, string>>
}
