import type { Metadata } from 'next'
import { siteUrl } from './site-url'

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

export type BreadcrumbItem = { name: string; path: string }

/** `BreadcrumbList` for a page (P6-R5). `trail` runs from the top, and its last item is the page itself. */
export function breadcrumbJsonLd(trail: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path === '/' ? '' : item.path}`,
    })),
  }
}

/**
 * `Person` for `/work` (P6-R6). `jobTitle` and `worksFor` come from the current job and are left
 * out when there is none; `alumniOf` lists the places of past jobs. Socials become `sameAs`.
 */
export function personJsonLd({
  name,
  description,
  socials,
  current,
  past,
}: {
  name: string
  description: string
  socials: { url: string }[]
  current?: { role: string; org: string; orgUrl?: string }
  past: { org: string; orgUrl?: string }[]
}) {
  const organization = (org: { org: string; orgUrl?: string }) => ({
    '@type': 'Organization',
    name: org.org,
    ...(org.orgUrl ? { url: org.orgUrl } : {}),
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    description,
    url: siteUrl,
    ...(current ? { jobTitle: current.role, worksFor: organization(current) } : {}),
    ...(past.length ? { alumniOf: past.map(organization) } : {}),
    sameAs: socials.map((social) => social.url),
  }
}
