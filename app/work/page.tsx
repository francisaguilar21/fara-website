import { Timeline } from '@/components/home/Timeline'
import { CertList } from '@/components/home/CertList'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { JsonLd } from '@/components/seo/JsonLd'
import { Button } from '@/components/ui/Button'
import { RecommendationGrid } from '@/components/work/RecommendationGrid'
import {
  getCertifications,
  getExperience,
  getRecommendations,
  getResumeUrl,
  getSite,
} from '@/lib/content'
import { pageMetadata, personJsonLd } from '@/lib/seo'

const DESCRIPTION =
  'Where I have worked, what I shipped, and the milestones along the way: the full timeline, certifications and recommendations.'

export const metadata = pageMetadata({ title: 'Work', description: DESCRIPTION, path: '/work' })

export default function WorkPage() {
  const site = getSite()
  const experience = getExperience()
  const certifications = getCertifications()
  const recommendations = getRecommendations()
  const resumeUrl = getResumeUrl()

  const work = experience.filter((entry) => entry.kind === 'work')
  const current = work.find((entry) => !entry.end)

  return (
    <Container className="py-16 md:py-24">
      <JsonLd
        data={personJsonLd({
          name: site.name,
          description: site.tagline,
          socials: site.socials,
          current,
          past: work.filter((entry) => entry.end),
        })}
      />

      <PageHeader
        path="/work"
        title="Experience & milestones"
        description={DESCRIPTION}
        actions={
          resumeUrl ? (
            <Button href={resumeUrl} variant="ghost" target="_blank" rel="noopener noreferrer">
              Résumé (PDF) <span aria-hidden="true">↗</span>
            </Button>
          ) : null
        }
      />

      {experience.length > 0 ? (
        <section aria-labelledby="timeline-heading" className="mt-[clamp(48px,8vw,96px)]">
          <h2 id="timeline-heading" className="sr-only">
            Timeline
          </h2>
          <Timeline entries={experience} />
        </section>
      ) : null}

      {certifications.length > 0 ? (
        <section aria-labelledby="certifications-heading" className="mt-[clamp(64px,10vw,128px)]">
          <h2 id="certifications-heading" className="sr-only">
            Credentials
          </h2>
          <CertList certifications={certifications} />
        </section>
      ) : null}

      {recommendations.length > 0 ? (
        <section aria-labelledby="recommendations-heading" className="mt-[clamp(64px,10vw,128px)]">
          <h2 id="recommendations-heading" className="mb-10 h2">
            Recommendations
          </h2>
          <RecommendationGrid recommendations={recommendations} />
        </section>
      ) : null}
    </Container>
  )
}
