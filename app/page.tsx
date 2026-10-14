import { ContactSection } from '@/components/home/ContactSection'
import { GithubSection } from '@/components/home/GithubSection'
import { Hero } from '@/components/home/Hero'
import { LatestPosts } from '@/components/home/LatestPosts'
import { LifeSection } from '@/components/home/LifeSection'
import { NowStrip } from '@/components/home/NowStrip'
import { Proof } from '@/components/home/Proof'
import { ProjectsSection } from '@/components/home/ProjectsSection'
import { StackGrid } from '@/components/home/StackGrid'
import { WorkSection } from '@/components/home/WorkSection'
import { SlashDivider } from '@/components/ui/SlashDivider'
import { getBookingUrl } from '@/lib/booking'
import {
  getCertifications,
  getExperience,
  getGallery,
  getPage,
  getPosts,
  getProjects,
  getRecommendations,
  getSite,
  getTalks,
  getUses,
} from '@/lib/content'
import { githubUsername } from '@/lib/home/format'
import { buildNowItems } from '@/lib/home/now-items'
import {
  CONTRIBUTIONS_SAMPLE,
  NOW_PLAYING_SAMPLE,
  STRAVA_SAMPLE,
} from '@/lib/integrations/fallbacks'

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
      <StackGrid groups={getUses()} />
      <Proof recommendations={getRecommendations()} certifications={getCertifications()} />
      <SlashDivider />
      <LatestPosts posts={getPosts({ limit: 3 })} />
      <GithubSection calendar={CONTRIBUTIONS_SAMPLE} username={githubUsername(site.socials)} />
      <ContactSection bookingUrl={getBookingUrl()} />
    </>
  )
}
