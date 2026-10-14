import Image from 'next/image'
import { DraftChip } from '@/components/ui/DraftChip'
import { cn } from '@/lib/cn'
import type { NowPlaying as NowPlayingData } from '@/lib/integrations/fallbacks'
import { Equalizer } from './Equalizer'

/**
 * The Spotify card: album art, track, artist, and the equaliser while it plays ("Last played"
 * when idle). Phase 7 feeds it live data and polls `/api/now-playing`; until then it shows the
 * sample track, flagged as a sample.
 */
export function NowPlaying({ track, className }: { track: NowPlayingData; className?: string }) {
  const body = (
    <>
      {track.albumArt ? (
        <Image
          src={track.albumArt}
          alt=""
          width={52}
          height={52}
          // Spotify's CDN serves it already sized. Phase 7 can allow the host in `next.config.ts`.
          unoptimized
          className="size-[52px] flex-none rounded-[4px]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="size-[52px] flex-none rounded-[4px] bg-[conic-gradient(from_200deg,var(--accent),var(--fg)_40%,var(--accent)_70%,var(--bg))]"
        />
      )}
      <div className="min-w-0 [&>div]:truncate">
        <div className="flex items-center gap-1.5 label">
          {track.isPlaying ? <Equalizer className="mr-0.5" /> : null}
          {track.isPlaying ? 'Now playing' : 'Last played'}
          {track.isSample ? <DraftChip>sample</DraftChip> : null}
        </div>
        <div>{track.title}</div>
        <div className="text-[0.875rem] text-muted">{track.artist}</div>
      </div>
    </>
  )

  const classes = cn(
    'flex items-center gap-3.5 rounded-md border border-line bg-surface p-3',
    className
  )

  return track.url ? (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${track.title} by ${track.artist} on Spotify`}
      className={classes}
    >
      {body}
    </a>
  ) : (
    <div className={classes}>{body}</div>
  )
}
