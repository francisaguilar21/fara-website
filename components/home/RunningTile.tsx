import { StravaStats } from '@/components/widgets/StravaStats'
import { DraftChip } from '@/components/ui/DraftChip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Label } from '@/components/ui/Label'
import type { StravaSummary } from '@/lib/integrations/fallbacks'

/** Tile 1: three Strava numbers, 12 weeks of distance, and the last run. */
export function RunningTile({ strava }: { strava: StravaSummary }) {
  return (
    <article className="col-span-12 flex min-w-0 flex-col gap-3.5 border border-line bg-bg p-[clamp(18px,2.4vw,28px)] min-[901px]:col-span-7">
      <div className="flex items-center justify-between gap-3">
        <Eyebrow path="/life/running" />
        <Label>
          Strava
          {strava.isSample ? (
            <>
              {' '}
              · <DraftChip className="ml-1">sample</DraftChip>
            </>
          ) : null}
        </Label>
      </div>

      <StravaStats strava={strava} />
    </article>
  )
}
