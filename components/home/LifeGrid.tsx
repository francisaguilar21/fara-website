import type { GalleryImage, Talk } from '@/lib/content'
import type { NowPlaying, StravaSummary } from '@/lib/integrations/fallbacks'
import { BuildingTile } from './BuildingTile'
import { CommunityTile } from './CommunityTile'
import { GalleryStrip } from './GalleryStrip'
import { RunningTile } from './RunningTile'

type LifeGridProps = {
  strava: StravaSummary
  talks: Talk[]
  nowPlaying: NowPlaying
  gallery: GalleryImage[]
  building: { quote?: string; teaser?: string; draft?: boolean }
}

/** The four tiles of `/life` on a 12-column grid: running, community, gallery and building. */
export function LifeGrid({ strava, talks, nowPlaying, gallery, building }: LifeGridProps) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <RunningTile strava={strava} />
      <CommunityTile talks={talks} track={nowPlaying} />
      <GalleryStrip images={gallery} />
      <BuildingTile page={building} />
    </div>
  )
}
