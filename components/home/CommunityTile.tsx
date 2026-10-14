import { DraftChip } from '@/components/ui/DraftChip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Label } from '@/components/ui/Label'
import { NowPlaying } from '@/components/widgets/NowPlaying'
import type { Talk } from '@/lib/content'
import type { NowPlaying as NowPlayingData } from '@/lib/integrations/fallbacks'

/** Tile 2: the latest talks and events, and the Spotify card. */
export function CommunityTile({ talks, track }: { talks: Talk[]; track: NowPlayingData }) {
  return (
    <article className="col-span-12 flex min-w-0 flex-col gap-3.5 border border-line bg-bg p-[clamp(18px,2.4vw,28px)] min-[901px]:col-span-5">
      <Eyebrow path="/life/community" />
      <h3 className="h3">Pacing, talks &amp; showing up.</h3>

      {talks.length > 0 ? (
        <ul>
          {talks.map((talk) => (
            <li
              key={`${talk.date}-${talk.title}`}
              className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 border-t border-line py-3"
            >
              <Label>{talk.date.slice(0, 4)}</Label>
              <span>
                {talk.title} <span className="text-muted">· {talk.event}</span>
                {talk.draft ? <DraftChip className="ml-1.5" /> : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <NowPlaying track={track} className="mt-auto" />
    </article>
  )
}
