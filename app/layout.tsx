import type { Metadata } from 'next'
import { fontVariables } from './fonts'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Francis Aguilar',
  description: 'Software engineer, founder and long-distance runner.',
  icons: {
    icon: [
      { url: '/static/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/static/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/static/favicons/apple-touch-icon.png',
  },
  manifest: '/static/favicons/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // next-themes sets `data-theme` on <html> before hydration, hence suppressHydrationWarning.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
