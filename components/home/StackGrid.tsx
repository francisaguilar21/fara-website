import { Section } from '@/components/layout/Section'
import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import { UnderlineLink } from '@/components/ui/UnderlineLink'
import type { UsesGroup } from '@/lib/content'
import { SectionTitle } from './SectionTitle'

/**
 * Section 6, `/uses`: the stack in groups on a bordered grid, three columns, then two, then one.
 * A rose `/` appears before the items of the group under the pointer.
 */
export function StackGrid({ groups }: { groups: UsesGroup[] }) {
  if (groups.length === 0) return null

  return (
    <Section
      id="stack"
      eyebrow="/uses"
      label={
        <>
          Stack &amp; tools
          {groups.some((group) => group.draft) ? <DraftChip className="ml-1.5" /> : null}
        </>
      }
      aria-labelledby="stack-heading"
    >
      <SectionTitle
        id="stack-heading"
        title="What I reach for."
        more={{ href: '/uses', label: 'Everything I use' }}
      />
      <div className="grid grid-cols-1 border-t border-l border-line min-[481px]:grid-cols-2 min-[821px]:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.category}
            className="group min-w-0 border-r border-b border-line p-5 transition-colors duration-300 hover:bg-surface motion-reduce:transition-none"
          >
            <Label as="h3">{group.category}</Label>
            <ul className="mt-3 grid gap-1 font-display text-[1.0625rem]">
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className="before:text-accent before:opacity-0 before:transition-opacity before:duration-300 before:content-['/_'] group-hover:before:opacity-100 motion-reduce:before:transition-none"
                >
                  {item.url ? (
                    <UnderlineLink href={item.url} external>
                      {item.name}
                    </UnderlineLink>
                  ) : (
                    item.name
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
