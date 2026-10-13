import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { LOGO_LETTERS, LOGO_SLASH } from '@/components/ui/Logo'
import { readTokens } from '@/lib/design/tokens'

// Generated Open Graph images (P4-R11): 1200×630, the F/A mark with its rose slash, and a title in
// Space Grotesk on the dark background. Used by the `opengraph-image.tsx` files.
export const OG_SIZE = { width: 1200, height: 630 }

// Satori reads TTF, OTF and WOFF, but not WOFF2 (what `next/font` serves), so the static
// SemiBold (600, the H1 weight) comes from @fontsource.
const font = readFile(
  join(
    process.cwd(),
    'node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff'
  )
)

/**
 * Emoji need a font (or a CDN fetch at build time) that the card doesn't bundle, so they are
 * dropped: "Hello World! 👋" reads "Hello World!". Whitespace is tidied up after.
 */
export const ogText = (text: string) =>
  text
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}️‍]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()

/** Long titles get a smaller size so they stay within three lines. */
const titleSize = (title: string) => (title.length <= 36 ? 92 : title.length <= 64 ? 76 : 60)

export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  /** Small label at the top right, for example `francisaguilar.co/blog`. */
  eyebrow: string
  title: string
  subtitle?: string
}) {
  const { bg, fg, muted, accent } = readTokens().dark
  const text = ogText(title)

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: bg,
        color: fg,
        padding: 72,
        fontFamily: 'Space Grotesk',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <svg width="135" height="90" viewBox="0 0 120 80" fill={fg} fillRule="evenodd">
          <path d={LOGO_LETTERS} />
          <path d={LOGO_SLASH} fill={accent} />
        </svg>
        <div style={{ fontSize: 30, color: muted }}>{eyebrow}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: titleSize(text),
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
          }}
        >
          {text}
        </div>
        {subtitle ? (
          <div style={{ fontSize: 34, color: muted, marginTop: 28 }}>{subtitle}</div>
        ) : null}
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [{ name: 'Space Grotesk', data: await font, weight: 600, style: 'normal' }],
    }
  )
}
