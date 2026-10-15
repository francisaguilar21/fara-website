import { Section } from '@/components/layout/Section'
import { LifeGrid } from './LifeGrid'
import { SectionTitle } from './SectionTitle'

/** Section 5, `/life`: the four tiles that show what a résumé leaves out. */
export function LifeSection(props: React.ComponentProps<typeof LifeGrid>) {
  return (
    <Section id="life" eyebrow="/life" label="Beyond work" aria-labelledby="life-heading">
      <SectionTitle
        id="life-heading"
        title="Off the keyboard."
        description="Running, community and the startup story. The parts of me a résumé leaves out."
      />
      <LifeGrid {...props} />
    </Section>
  )
}
