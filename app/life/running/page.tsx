import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { PacingBlock } from '@/components/life/PacingBlock'
import { RaceTable } from '@/components/life/RaceTable'
import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import { StravaStats } from '@/components/widgets/StravaStats'
import { getPacing, getRaces } from '@/lib/content'
import { STRAVA_SAMPLE } from '@/lib/integrations/fallbacks'
import { pageMetadata } from '@/lib/seo'

const DESCRIPTION =
  'My running: weekly distance from Strava, the race log with personal records, and the paces I lead.'

export const metadata = pageMetadata({
  title: 'Running',
  description: DESCRIPTION,
  path: '/life/running',
})

// Phase 7 swaps `STRAVA_SAMPLE` for the live summary and turns on ISR (1 hour).
export default function RunningPage() {
  const strava = STRAVA_SAMPLE
  const races = getRaces()
  const pacing = getPacing()

  return (
    <Container className="py-16 md:py-24">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Life', path: '/life' },
          { name: 'Running', path: '/life/running' },
        ]}
      />
      <PageHeader
        className="mt-10"
        path="/life/running"
        title="Running"
        description={DESCRIPTION}
      />

      <section aria-labelledby="strava-heading" className="mt-[clamp(40px,6vw,72px)]">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 id="strava-heading" className="h2">
            This season
          </h2>
          <Label>
            Strava
            {strava.isSample ? <DraftChip className="ml-1.5">sample</DraftChip> : null}
          </Label>
        </div>
        <div className="flex max-w-3xl flex-col gap-3.5">
          <StravaStats strava={strava} />
        </div>
      </section>

      {races.length > 0 ? (
        <section aria-labelledby="races-heading" className="mt-[clamp(64px,10vw,128px)]">
          <h2 id="races-heading" className="mb-6 h2">
            Race log
          </h2>
          <RaceTable races={races} />
        </section>
      ) : null}

      {pacing ? (
        <section aria-labelledby="pacing-heading" className="mt-[clamp(64px,10vw,128px)]">
          <h2 id="pacing-heading" className="mb-6 h2">
            Pacing
          </h2>
          <PacingBlock pacing={pacing} />
        </section>
      ) : null}
    </Container>
  )
}
