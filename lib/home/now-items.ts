import type { NowStripItem } from '@/components/home/NowStrip'
import type { NowPlaying, StravaSummary } from '@/lib/integrations/fallbacks'

/** The slice of `content/pages/now.mdx` that feeds the strip. */
type NowPage = { focus?: string; reading?: string; building?: string; draft?: boolean }

type Sources = {
  now?: NowPage
  nowPlaying: NowPlaying
  strava: StravaSummary
}

/** `41.2` stays `41.2`, and `41` stays `41`: one decimal only when there is one. */
const formatKm = (km: number) => `${Number(km.toFixed(1))} km`

/**
 * The items of the now strip, in order: NOW, READING, LISTENING, THIS WEEK, BUILDING. The three
 * written by hand come from the `now.mdx` frontmatter and carry its draft flag, the other two
 * from the widget data, where a sample says so.
 */
export function buildNowItems({ now, nowPlaying, strava }: Sources): NowStripItem[] {
  const written = (label: string, text: string | undefined): NowStripItem[] =>
    text ? [{ label, text, badge: now?.draft ? 'draft' : undefined }] : []

  return [
    ...written('NOW', now?.focus),
    ...written('READING', now?.reading),
    {
      label: nowPlaying.isPlaying ? 'LISTENING' : 'LAST PLAYED',
      text: `${nowPlaying.title} · ${nowPlaying.artist}`,
      badge: nowPlaying.isSample ? 'sample' : undefined,
      playing: nowPlaying.isPlaying,
    },
    {
      label: 'THIS WEEK',
      text: `${formatKm(strava.weekKm)} run`,
      badge: strava.isSample ? 'sample' : undefined,
    },
    ...written('BUILDING', now?.building),
  ]
}
