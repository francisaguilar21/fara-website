import type { Metadata } from 'next'
import { fontVariables } from './fonts'
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
          <SkipLink />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
