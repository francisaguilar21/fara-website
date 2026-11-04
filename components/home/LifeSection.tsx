import { Section } from '@/components/layout/Section'
import type { GalleryImage, Talk } from '@/lib/content'
import type { NowPlaying, StravaSummary } from '@/lib/integrations/fallbacks'
import { CommunityTile } from './CommunityTile'
import { GalleryStrip } from './GalleryStrip'
import { RunningTile } from './RunningTile'
import { SectionTitle } from './SectionTitle'

type LifeSectionProps = {
  strava: StravaSummary
  talks: Talk[]
  nowPlaying: NowPlaying
  gallery: GalleryImage[]
}

/** Section 5, `/life`: three tiles on a 12-column grid (running, community, gallery). */
export function LifeSection({ strava, talks, nowPlaying, gallery }: LifeSectionProps) {
  return (
    <Section id="life" eyebrow="/life" label="Beyond work" aria-labelledby="life-heading">
      <SectionTitle
        id="life-heading"
        title="Off the keyboard."
        description="Running, community and photos. The parts of me a résumé leaves out."
      />
      <div className="grid grid-cols-12 gap-4">
        <RunningTile strava={strava} />
        <CommunityTile talks={talks} track={nowPlaying} />
        <GalleryStrip images={gallery} />
      </div>
    </Section>
  )
}
