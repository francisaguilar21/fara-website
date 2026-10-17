import Image from 'next/image'
import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import type { Recommendation } from '@/lib/content'

/** Every recommendation at once, as a grid of quotes (P6-R6); the homepage shows them one at a time. */
export function RecommendationGrid({ recommendations }: { recommendations: Recommendation[] }) {
  if (recommendations.length === 0) return null

  return (
    <ul className="grid gap-x-12 gap-y-14 md:grid-cols-2">
      {recommendations.map((item, index) => (
        <li key={`${item.name}-${index}`}>
          <blockquote className="m-0 h-full border-l-2 border-accent pl-[clamp(16px,3vw,28px)]">
            <p className="font-display text-[clamp(1.125rem,2vw,1.375rem)] leading-[1.4] tracking-[-0.01em]">
              {item.quote}
            </p>
            <footer className="mt-[18px] flex items-center gap-3">
              {item.avatar ? (
                <Image
                  src={item.avatar}
                  alt=""
                  width={40}
                  height={40}
                  sizes="40px"
                  className="size-10 flex-none rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="size-10 flex-none rounded-full border border-dashed border-muted bg-surface"
                />
              )}
              <div>
                <div>
                  {item.name}
                  {item.draft ? <DraftChip className="ml-1.5" /> : null}
                </div>
                <Label>
                  {item.role} · {item.company} · {item.relationship}
                </Label>
              </div>
            </footer>
          </blockquote>
        </li>
      ))}
    </ul>
  )
}
