import type { Metadata } from 'next'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo'

// Canonical URL and share URL for the home page. A page's `openGraph` replaces the layout's, so it
// repeats the rest of it.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: '/',
  },
}

export default function Home() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <h1 className="h1">New site in progress</h1>
    </div>
  )
}
