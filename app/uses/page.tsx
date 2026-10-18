import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import { UnderlineLink } from '@/components/ui/UnderlineLink'
import { getUses } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

const DESCRIPTION = 'The tech stack, tools and gear I use, with a note on why.'

export const metadata = pageMetadata({ title: 'Uses', description: DESCRIPTION, path: '/uses' })

export default function UsesPage() {
  const groups = getUses()

  return (
    <Container className="py-16 md:py-24">
      <PageHeader path="/uses" title="What I use." description={DESCRIPTION} />

      <div className="mt-[clamp(40px,6vw,72px)]">
        {groups.length > 0 ? (
          groups.map((group) => (
            <section
              key={group.category}
              aria-labelledby={`uses-${group.category}`}
              className="grid gap-x-12 gap-y-4 border-t border-line py-8 min-[760px]:grid-cols-[220px_minmax(0,1fr)]"
            >
              <h2 id={`uses-${group.category}`} className="h3">
                {group.category}
                {group.draft ? <DraftChip className="ml-2" /> : null}
              </h2>
              <ul className="grid gap-5">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <span className="font-display text-[1.125rem]">
                      {item.url ? (
                        <UnderlineLink href={item.url} external>
                          {item.name} ↗
                        </UnderlineLink>
                      ) : (
                        item.name
                      )}
                    </span>
                    {item.note ? (
                      <Label className="mt-1.5 block normal-case">{item.note}</Label>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))
        ) : (
          <p className="text-muted">The list is on the way.</p>
        )}
      </div>
    </Container>
  )
}
