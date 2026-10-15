import { Section } from '@/components/layout/Section'
import { DraftChip } from '@/components/ui/DraftChip'
import { ContributionGraph } from '@/components/widgets/ContributionGraph'
import type { ContributionCalendar } from '@/lib/integrations/fallbacks'

/** Section 9, `/github`: the contribution heatmap. It follows the writing list closely. */
export function GithubSection({
  calendar,
  username,
}: {
  calendar: ContributionCalendar
  username?: string
}) {
  return (
    <Section
      id="github"
      eyebrow="/github"
      label={
        <>
          Last 52 weeks
          {calendar.isSample ? (
            <>
              {' '}
              · <DraftChip className="ml-1">sample</DraftChip>
            </>
          ) : null}
        </>
      }
      aria-labelledby="github-heading"
      className="pt-0 md:pt-0"
    >
      <ContributionGraph calendar={calendar} username={username} />
    </Section>
  )
}
