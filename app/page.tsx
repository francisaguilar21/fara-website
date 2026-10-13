import { Hero } from '@/components/home/Hero'
import { NowStrip } from '@/components/home/NowStrip'
import { WorkSection } from '@/components/home/WorkSection'
import { getExperience, getPage, getSite } from '@/lib/content'
import { buildNowItems } from '@/lib/home/now-items'
import { NOW_PLAYING_SAMPLE, STRAVA_SAMPLE } from '@/lib/integrations/fallbacks'

// The homepage is the one-scroll story (DESIGN §5). Each section is a component in
// `components/home/` that takes typed data from `lib/content`. Strava, Spotify and GitHub show
// their sample data until Phase 7 swaps in the live calls.
export default function Home() {
  const site = getSite()
  const now = getPage('now')

  return (
    <>
      <Hero
        name={site.name}
        headline={site.headline}
        intro={site.intro}
        location={site.location}
        bookingUrl={site.bookingUrl}
      />
      <NowStrip
        items={buildNowItems({ now, nowPlaying: NOW_PLAYING_SAMPLE, strava: STRAVA_SAMPLE })}
      />
      <WorkSection entries={getExperience({ featured: true, limit: 6 })} />
    </>
  )
}
