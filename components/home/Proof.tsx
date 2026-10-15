import { Section } from '@/components/layout/Section'
import type { Certification, Recommendation } from '@/lib/content'
import { getBlurDataURL } from '@/lib/images'
import { CertList } from './CertList'
import { QuoteCarousel } from './QuoteCarousel'
import { SectionTitle } from './SectionTitle'

type ProofProps = {
  recommendations: Recommendation[]
  certifications: Certification[]
}

/** Section 7, `/proof`: the recommendations carousel next to the certifications list. */
export async function Proof({ recommendations, certifications }: ProofProps) {
  if (recommendations.length === 0 && certifications.length === 0) return null

  const quotes = await Promise.all(
    recommendations.map(async (rec) => ({
      ...rec,
      blurDataURL: rec.avatar ? await getBlurDataURL(rec.avatar) : undefined,
    }))
  )

  return (
    <Section
      id="proof"
      eyebrow="/proof"
      label="Recommendations & certifications"
      aria-labelledby="proof-heading"
    >
      <SectionTitle id="proof-heading" title="In other people's words." />
      <div className="grid gap-x-12 gap-y-6 min-[861px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <QuoteCarousel quotes={quotes} />
        <CertList certifications={certifications} />
      </div>
    </Section>
  )
}
