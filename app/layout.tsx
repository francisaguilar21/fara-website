import type { Metadata } from 'next'
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
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-50">
        {children}
      </body>
    </html>
  )
}
