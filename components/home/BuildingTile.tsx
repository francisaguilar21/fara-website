import { Magnetic } from '@/components/motion/Magnetic'
import { Button } from '@/components/ui/Button'
import { DraftChip } from '@/components/ui/DraftChip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { splitEmphasis } from '@/lib/home/emphasis'

type BuildingTileProps = {
  /** `content/pages/life/building.mdx`. The tile shows its `quote` and `teaser`. */
  page: { quote?: string; teaser?: string; draft?: boolean }
}

/** Tile 4: a pull quote and the way into the Fitscovery story, marked draft until it exists. */
export function BuildingTile({ page }: BuildingTileProps) {
  return (
    <article className="col-span-12 grid items-end gap-x-12 gap-y-6 border border-line bg-bg p-[clamp(18px,2.4vw,28px)] min-[761px]:grid-cols-2">
      <div>
        <Eyebrow path="/life/building" />
        {page.draft ? <DraftChip className="ml-1.5">copy</DraftChip> : null}
        {page.quote ? (
          <blockquote className="mt-3.5 font-display text-[clamp(1.375rem,2.8vw,2rem)] leading-[1.2] font-medium tracking-[-0.02em]">
            {splitEmphasis(page.quote).map((part, index) =>
              part.emphasis ? (
                <em key={index} className="text-accent not-italic">
                  {part.text}
                </em>
              ) : (
                part.text
              )
            )}
          </blockquote>
        ) : null}
      </div>
      <div className="grid gap-4">
        {page.teaser ? <p className="text-muted">{page.teaser}</p> : null}
        <div>
          <Magnetic>
            <Button href="/life/building" variant="ghost" size="sm">
              Read the story <span aria-hidden="true">→</span>
            </Button>
          </Magnetic>
        </div>
      </div>
    </article>
  )
}
