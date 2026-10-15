import type { Metadata } from 'next'

export const SITE_NAME = 'Francis Aguilar'
export const SITE_DESCRIPTION = 'Software engineer, founder and long-distance runner.'

/** `<link rel="alternate">` to the feed. A page's `alternates` replaces the layout's, so pages repeat it. */
export const RSS_ALTERNATE = { 'application/rss+xml': '/rss.xml' }

type PageMetadata = {
  /** Page title, without the ` · Francis Aguilar` suffix: the root layout's template adds it. */
  title: string
  description: string
  /** Path of the page, for example `/writings/my-post`. Becomes the canonical URL. */
  path: string
  openGraph?: NonNullable<Metadata['openGraph']>
}

/**
 * Metadata every page shares (P4-R13): title, description, canonical URL (from
 * `NEXT_PUBLIC_SITE_URL` via `metadataBase`) and the Open Graph and Twitter cards.
 * A page's `openGraph` replaces the layout's wholesale, hence `siteName` and `url` are set here.
 */
export function pageMetadata({ title, description, path, openGraph }: PageMetadata): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path, types: RSS_ALTERNATE },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url: path,
      ...openGraph,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}
