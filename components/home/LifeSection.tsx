import { Section } from '@/components/layout/Section'
import type { GalleryImage, Talk } from '@/lib/content'
import type { NowPlaying, StravaSummary } from '@/lib/integrations/fallbacks'
import { BuildingTile } from './BuildingTile'
import { CommunityTile } from './CommunityTile'
import { GalleryStrip } from './GalleryStrip'
import { RunningTile } from './RunningTile'
import { SectionTitle } from './SectionTitle'

type LifeSectionProps = {
  strava: StravaSummary
  talks: Talk[]
  nowPlaying: NowPlaying
  gallery: GalleryImage[]
  /** `undefined` when the page is a hidden draft: the tile, and its link to a page that is not there, are left out. */
  building?: { quote?: string; teaser?: string; draft?: boolean }
}

/** Section 5, `/life`: four tiles on a 12-column grid (running, community, gallery, building). */
export function LifeSection({ strava, talks, nowPlaying, gallery, building }: LifeSectionProps) {
  return (
    <Section id="life" eyebrow="/life" label="Beyond work" aria-labelledby="life-heading">
      <SectionTitle
        id="life-heading"
        title="Off the keyboard."
        description="Running, community and the startup story. The parts of me a résumé leaves out."
      />
      <div className="grid grid-cols-12 gap-4">
        <RunningTile strava={strava} />
        <CommunityTile talks={talks} track={nowPlaying} />
        <GalleryStrip images={gallery} />
        {building ? <BuildingTile page={building} /> : null}
      </div>
    </Section>
  )
}
