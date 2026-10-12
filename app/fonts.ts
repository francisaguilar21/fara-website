import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'

// Variable fonts, self-hosted by Next. The CSS variables are mapped to Tailwind's
// `font-display`, `font-sans` and `font-mono` in `app/globals.css`.
export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const fontVariables = [spaceGrotesk, inter, jetbrainsMono]
  .map((font) => font.variable)
  .join(' ')
