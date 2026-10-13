import type { Metadata } from 'next'
import { ViewTransition } from 'react'
import { fontVariables } from './fonts'
import { Cursor } from '@/components/motion/Cursor'
import { SlashWipeProvider } from '@/components/motion/SlashWipe'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SkipLink } from '@/components/layout/SkipLink'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Francis Aguilar',
  description: 'Software engineer, founder and long-distance runner.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // next-themes sets `data-theme` on <html> before hydration, hence suppressHydrationWarning.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SlashWipeProvider>
            <SkipLink />
            <SiteHeader />
            <main id="main">
              {/* Route changes: the new page is revealed by a slash (see globals.css). */}
              <ViewTransition default="page">{children}</ViewTransition>
            </main>
            <SiteFooter />
            <SmoothScroll />
            <Cursor />
          </SlashWipeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
