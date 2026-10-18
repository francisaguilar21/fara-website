import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { MDXContent } from '@/components/mdx/MDXContent'
import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import { UnderlineLink } from '@/components/ui/UnderlineLink'
import { NowPlaying } from '@/components/widgets/NowPlaying'
import { StravaStats } from '@/components/widgets/StravaStats'
import { getPage } from '@/lib/content'
import { formatDate } from '@/lib/content/format'
import { NOW_PLAYING_SAMPLE, STRAVA_SAMPLE } from '@/lib/integrations/fallbacks'
import { daysSince, isStale, STALE_AFTER_DAYS } from '@/lib/now'
import { pageMetadata } from '@/lib/seo'

const DESCRIPTION = "What I'm focused on this month, plus this week's run and what's playing."

export const metadata = pageMetadata({ title: 'Now', description: DESCRIPTION, path: '/now' })

// The staleness note depends on today's date, so the page is rebuilt once a day. Phase 7 replaces
// this with the 1-hour revalidation of the live Strava and Spotify data.
export const revalidate = 86400

export default function NowPage() {
  const page = getPage('now')
  const updatedAt = page?.updatedAt?.slice(0, 10)
  const now = new Date()
  const stale = updatedAt ? isStale(updatedAt, now) : false

  const summary = [
    ['Focus', page?.focus],
    ['Reading', page?.reading],
    ['Building', page?.building],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]))

  return (
    <Container className="py-16 md:py-24">
      <PageHeader path="/now" title="What I'm up to now." description={DESCRIPTION} />

      {updatedAt ? (
        <div className="mt-8">
          <Label>
            Updated on <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
            {page?.draft ? <DraftChip className="ml-2" /> : null}
          </Label>
          {stale ? (
            <p
              role="note"
              className="mt-4 max-w-[60ch] border-l-2 border-accent pl-4 text-muted"
              data-testid="stale-note"
            >
              This page was last updated {daysSince(updatedAt, now)} days ago, more than{' '}
              {STALE_AFTER_DAYS}, so it may be out of date.
            </p>
          ) : null}
        </div>
      ) : null}

      {summary.length > 0 ? (
        <dl className="mt-[clamp(40px,6vw,72px)] grid gap-x-12 gap-y-6 border-t border-line pt-6 sm:grid-cols-3">
          {summary.map(([label, text]) => (
            <div key={label}>
              <Label as="dt">{label}</Label>
              <dd className="mt-2 text-[1.125rem]">{text}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {page ? (
        <div className="prose mt-[clamp(40px,6vw,72px)]">
          <MDXContent code={page.body} />
        </div>
      ) : null}

      <section
        aria-labelledby="live-heading"
        className="mt-[clamp(48px,8vw,96px)] border-t border-line pt-8"
      >
        <h2 id="live-heading" className="mb-6 h2">
          This week
        </h2>
        <div className="grid gap-4 min-[900px]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Phase 7 swaps both samples for live data. */}
          <div className="flex min-w-0 flex-col gap-3.5 border border-line bg-bg p-[clamp(18px,2.4vw,28px)]">
            <Label>
              Strava
              {STRAVA_SAMPLE.isSample ? <DraftChip className="ml-1.5">sample</DraftChip> : null}
            </Label>
            <StravaStats strava={STRAVA_SAMPLE} />
          </div>
          <div className="flex min-w-0 flex-col gap-3.5 border border-line bg-bg p-[clamp(18px,2.4vw,28px)]">
            <Label>Spotify</Label>
            <NowPlaying track={NOW_PLAYING_SAMPLE} className="mt-auto" />
          </div>
        </div>
      </section>

      <p className="mt-16 max-w-[60ch] text-sm text-muted">
        This is a{' '}
        <UnderlineLink href="https://nownownow.com/about" external>
          /now page
        </UnderlineLink>
        : a short note on what I am focused on at the moment, a habit started by Derek Sivers.
        nownownow.com explains the idea and lists more of them.
      </p>
    </Container>
  )
}
