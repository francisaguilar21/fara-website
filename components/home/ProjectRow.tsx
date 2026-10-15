import Link from 'next/link'
import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import type { Project } from '@/lib/content'

/**
 * One project as a full-width row, not a card. On hover or keyboard focus the title slides right in
 * rose and the arrow turns 45° up. `data-peek` hands the row to the cursor preview, and
 * `data-cursor` gives the custom cursor its "View" label.
 */
export function ProjectRow({ project }: { project: Project }) {
  const details = [project.role, ...project.stack].join(' · ')

  return (
    <li className="border-b border-line">
      <Link
        href={`/projects/${project.slug}`}
        data-cursor="View"
        data-peek={project.cover ? project.slug : undefined}
        className="group grid grid-cols-[72px_minmax(0,1fr)_minmax(0,0.9fr)_32px] items-baseline gap-5 py-7 max-[760px]:grid-cols-[1fr_24px]"
      >
        <Label className="max-[760px]:col-span-full">{project.year}</Label>
        <div>
          <h3 className="text-[clamp(1.5rem,3.4vw,2.5rem)] leading-tight tracking-[-0.03em] transition-[translate,color] duration-[400ms] ease-out-quint group-hover:text-accent group-focus-visible:text-accent motion-safe:group-hover:translate-x-2.5 motion-safe:group-focus-visible:translate-x-2.5 motion-reduce:transition-none">
            {project.title}
            {project.draft ? <DraftChip className="ml-1.5" /> : null}
          </h3>
          <p className="mt-1.5 font-mono text-xs leading-relaxed text-muted">{details}</p>
        </div>
        <p className="text-[0.9375rem] text-muted max-[760px]:col-start-1">
          {project.outcome ?? project.summary}
          {project.metric ? <b className="font-medium text-fg"> · {project.metric}</b> : null}
        </p>
        <span
          aria-hidden="true"
          className="justify-self-end font-display text-2xl transition-[rotate,color] duration-[350ms] ease-out-quint group-hover:text-accent group-focus-visible:text-accent motion-safe:group-hover:-rotate-45 motion-safe:group-focus-visible:-rotate-45 motion-reduce:transition-none"
        >
          →
        </span>
      </Link>
    </li>
  )
}
