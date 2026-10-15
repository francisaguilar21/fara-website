import { Section } from '@/components/layout/Section'
import { SectionTitle } from './SectionTitle'
import { Timeline } from './Timeline'
import type { TimelineEntry } from './TimelineItem'

/** Section 3, `/work`: the latest featured entries on the scroll-drawn timeline. */
export function WorkSection({ entries }: { entries: TimelineEntry[] }) {
  // Nothing to draw (every entry was a hidden draft): render no section, and the header drops
  // its `#work` anchor in favor of the `/work` route.
  if (entries.length === 0) return null

  return (
    <Section
      id="work"
      eyebrow="/work"
      label="Experience & milestones"
      aside={
        // Explains the two kinds of dot on the timeline: work is filled, life is a ring.
        <div className="mt-4 flex gap-4.5 label">
          {[
            ['Work', 'bg-accent'],
            ['Life', ''],
          ].map(([name, fill]) => (
            <span key={name} className="inline-flex items-center gap-2">
              <i
                aria-hidden="true"
                className={`inline-block size-2.5 rounded-full border-2 border-accent ${fill}`}
              />
              {name}
            </span>
          ))}
        </div>
      }
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
        more={{ href: '/work', label: 'Full timeline' }}
      />
      <Timeline entries={entries} />
    </Section>
  )
}
