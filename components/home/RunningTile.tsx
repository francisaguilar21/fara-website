import { DraftChip } from '@/components/ui/DraftChip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Label } from '@/components/ui/Label'
import { formatDuration } from '@/lib/content/format'
import { formatKm, formatRunStart } from '@/lib/home/format'
import type { StravaSummary } from '@/lib/integrations/fallbacks'
import { WeeklyBars } from './WeeklyBars'

function Stat({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div>
      <div className="data text-[clamp(1.375rem,2.4vw,2.125rem)] leading-none tracking-[-0.03em]">
        {value}
        <small className="ml-1 text-[0.45em] tracking-normal text-muted">{unit}</small>
      </div>
      <Label>{label}</Label>
    </div>
  )
}

/** Tile 1: three Strava numbers, 12 weeks of distance, and the last run. */
export function RunningTile({ strava }: { strava: StravaSummary }) {
  const { lastRun } = strava

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

      <div className="grid grid-cols-3 gap-4">
        <Stat value={formatKm(strava.weekKm)} unit="km" label="This week" />
        <Stat value={formatKm(strava.ytdKm)} unit="km" label="Year to date" />
        <Stat value={formatDuration(strava.avgPaceSecPerKm)} unit="/km" label="Avg pace" />
      </div>

      <WeeklyBars weeks={strava.weeks} sample={strava.isSample} />

      {lastRun ? (
        <p className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line pt-3 font-mono text-[0.8125rem] leading-snug text-muted">
          <span>Last run</span>
          <b className="font-medium text-fg">{formatKm(lastRun.km)} km</b>
          <span>{formatDuration(lastRun.paceSecPerKm)} /km</span>
          {lastRun.avgHr ? <span>{lastRun.avgHr} bpm</span> : null}
          <span>{formatRunStart(lastRun.startedAt)}</span>
        </p>
      ) : null}
    </article>
  )
}
