import type { Metadata } from 'next'
import { RSS_ALTERNATE, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo'
import { Hero } from '@/components/home/Hero'
import { LifeSection } from '@/components/home/LifeSection'
import { NowStrip } from '@/components/home/NowStrip'
import { ProjectsSection } from '@/components/home/ProjectsSection'
import { WorkSection } from '@/components/home/WorkSection'
import { SlashDivider } from '@/components/ui/SlashDivider'
import { getBookingUrl } from '@/lib/booking'
import { getExperience, getGallery, getPage, getProjects, getSite, getTalks } from '@/lib/content'
import { buildNowItems } from '@/lib/home/now-items'
import { NOW_PLAYING_SAMPLE, STRAVA_SAMPLE } from '@/lib/integrations/fallbacks'

// Canonical URL and share URL for the home page. A page's `openGraph` replaces the layout's, so it
// repeats the rest of it.
export const metadata: Metadata = {
  alternates: { canonical: '/', types: RSS_ALTERNATE },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: '/',
  },
}

// The homepage is the one-scroll story (DESIGN §5). Each section is a component in
// `components/home/` that takes typed data from `lib/content`. Strava, Spotify and GitHub show
// their sample data until Phase 7 swaps in the live calls.
export default function Home() {
  const site = getSite()
  const now = getPage('now')
  const building = getPage('life/building')

  return (
    <>
      <Hero
        name={site.name}
        headline={site.headline}
        intro={site.intro}
        location={site.location}
        bookingUrl={getBookingUrl()}
      />
      <NowStrip
        items={buildNowItems({ now, nowPlaying: NOW_PLAYING_SAMPLE, strava: STRAVA_SAMPLE })}
      />
      <WorkSection entries={getExperience({ featured: true, limit: 6 })} />
      <SlashDivider />
      <ProjectsSection projects={getProjects({ featured: true, limit: 3 })} />
      <LifeSection
        strava={STRAVA_SAMPLE}
        talks={getTalks({ limit: 3 })}
        nowPlaying={NOW_PLAYING_SAMPLE}
        gallery={getGallery({ limit: 5 })}
        building={building}
      />
      <SlashDivider />
    </>
  )
}
