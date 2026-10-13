import { Section } from '@/components/layout/Section'
import { Magnetic } from '@/components/motion/Magnetic'
import { Button } from '@/components/ui/Button'
import { SectionTitle } from './SectionTitle'
import { Timeline } from './Timeline'
import { TimelineLegend } from './TimelineLegend'
import type { TimelineEntry } from './TimelineItem'

/** Section 3, `/work`: the latest featured entries on the scroll-drawn timeline. */
export function WorkSection({ entries }: { entries: TimelineEntry[] }) {
  return (
    <Section
      id="work"
      eyebrow="/work"
      label="Experience & milestones"
      aside={<TimelineLegend />}
      aria-labelledby="work-heading"
    >
      <SectionTitle
        id="work-heading"
        title={
          <>
            A decade of shipping,
            <br />
            one milestone at a time.
          </>
        }
        description="Scroll and the line follows."
        action={
          <Magnetic>
            <Button href="/work" variant="ghost" size="sm">
              Full timeline <span aria-hidden="true">→</span>
            </Button>
          </Magnetic>
        }
      />
      <Timeline entries={entries} />
    </Section>
  )
}
