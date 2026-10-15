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
import { RSS_ALTERNATE, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo'
import { siteUrl } from '@/lib/site-url'
import './globals.css'

// Defaults for every page (P4-R13). Pages override them with `pageMetadata()` from `lib/seo.ts`.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  alternates: { types: RSS_ALTERNATE },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: SITE_DESCRIPTION },
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
