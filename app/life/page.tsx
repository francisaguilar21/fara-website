import Image from 'next/image'
import { LifeCard } from '@/components/life/LifeCard'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import { getGallery, getPage, getTalks } from '@/lib/content'
import { formatKm } from '@/lib/home/format'
import { splitEmphasis } from '@/lib/home/emphasis'
import { getBlurDataURL } from '@/lib/images'
import { STRAVA_SAMPLE } from '@/lib/integrations/fallbacks'
import { pageMetadata } from '@/lib/seo'

const DESCRIPTION = 'Running, community and the startup story: the parts of me a résumé leaves out.'

export const metadata = pageMetadata({ title: 'Life', description: DESCRIPTION, path: '/life' })

// Phase 7 swaps `STRAVA_SAMPLE` for the live summary (and turns on ISR); until then the card shows the sample.
export default async function LifePage() {
  const strava = STRAVA_SAMPLE
  const [latestTalk] = getTalks({ limit: 1 })
  const photos = getGallery({ limit: 3 })
  const building = getPage('life/building')
  const blurs = await Promise.all(photos.map((photo) => getBlurDataURL(photo.src)))

  return (
    <Container className="py-16 md:py-24">
      <PageHeader path="/life" title="Off the keyboard." description={DESCRIPTION} />

      <div className="mt-[clamp(40px,6vw,72px)] grid gap-4 min-[760px]:grid-cols-2">
        <LifeCard href="/life/running" title="Running">
          <div className="data text-[clamp(2.25rem,5vw,3.5rem)] leading-none tracking-[-0.03em]">
            {formatKm(strava.weekKm)}
            <small className="ml-1.5 text-[0.4em] tracking-normal text-muted">km this week</small>
          </div>
          <p className="mt-3 flex items-center gap-2 label">
            Strava
            {strava.isSample ? <DraftChip>sample</DraftChip> : null}
          </p>
        </LifeCard>

        <LifeCard href="/life/community" title="Community">
          {latestTalk ? (
            <>
              <Label>Latest</Label>
              <p className="mt-2 text-[1.125rem]">
                {latestTalk.title} <span className="text-muted">· {latestTalk.event}</span>
                {latestTalk.draft ? <DraftChip className="ml-1.5" /> : null}
              </p>
            </>
          ) : (
            <p className="text-muted">Talks, meetups and pacing.</p>
          )}
        </LifeCard>

        {photos.length > 0 ? (
          <LifeCard href="/life/gallery" title="Gallery">
            <ul className="grid grid-cols-3 gap-2">
              {photos.map((photo, index) => (
                <li key={photo.src} className="relative aspect-square overflow-hidden bg-surface">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 760px) 14vw, 30vw"
                    placeholder="blur"
                    blurDataURL={blurs[index]}
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </LifeCard>
        ) : null}

        {building ? (
          <LifeCard href="/life/building" title="Building">
            {building.quote ? (
              <blockquote className="m-0 font-display text-[1.25rem] leading-[1.3] font-medium tracking-[-0.01em]">
                {splitEmphasis(building.quote).map((part, index) =>
                  part.emphasis ? (
                    <em key={index} className="text-accent not-italic">
                      {part.text}
                    </em>
                  ) : (
                    part.text
                  )
                )}
              </blockquote>
            ) : (
              <p className="text-muted">{building.teaser}</p>
            )}
            {building.draft ? <DraftChip className="mt-3">copy</DraftChip> : null}
          </LifeCard>
        ) : null}
      </div>
    </Container>
  )
}
