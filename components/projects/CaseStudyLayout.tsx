import Image from 'next/image'
import Link from 'next/link'
import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import { Tag } from '@/components/ui/Tag'
import { UnderlineLink } from '@/components/ui/UnderlineLink'
import type { Project } from '@/lib/content'

type Neighbor = Pick<Project, 'slug' | 'title'>

type CaseStudyLayoutProps = {
  project: Pick<
    Project,
    'title' | 'year' | 'role' | 'summary' | 'stack' | 'cover' | 'links' | 'draft'
  >
  /** Blur placeholder for `project.cover`, made on the server. */
  coverBlur?: string
  previous?: Neighbor
  next?: Neighbor
  /** The MDX body. */
  children: React.ReactNode
}

/**
 * A case study (P6-R8): title block, cover, the write-up beside a metadata sidebar (year, role,
 * stack, links), and the neighbouring projects. The write-up follows the fixed structure
 * Problem, Role, What we built, Outcome, Stack, which lives in the MDX itself.
 */
export function CaseStudyLayout({
  project,
  coverBlur,
  previous,
  next,
  children,
}: CaseStudyLayoutProps) {
  const links = [
    project.links.live ? { label: 'Live site', href: project.links.live } : null,
    project.links.repo ? { label: 'Source code', href: project.links.repo } : null,
  ].filter((link) => link !== null)

  return (
    <>
      <header className="mt-10 max-w-[68ch]">
        <h1 className="h1">
          {project.title}
          {project.draft ? (
            <>
              {' '}
              <DraftChip />
            </>
          ) : null}
        </h1>
        <p className="mt-6 text-lg text-muted">{project.summary}</p>
      </header>

      {project.cover ? (
        <div className="relative mt-10 aspect-video w-full overflow-hidden border border-line bg-surface">
          <Image
            src={project.cover}
            alt=""
            fill
            priority
            sizes="(min-width: 1240px) 1160px, 100vw"
            placeholder={coverBlur ? 'blur' : 'empty'}
            blurDataURL={coverBlur}
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="mt-12 grid gap-x-[clamp(32px,6vw,88px)] gap-y-12 min-[900px]:grid-cols-[minmax(0,1fr)_260px]">
        <div className="prose min-w-0">{children}</div>

        <aside aria-label="Project details" className="min-[900px]:order-last">
          <dl className="grid gap-6 border-t border-line pt-6 min-[900px]:sticky min-[900px]:top-28">
            <div>
              <Label as="dt">Year</Label>
              <dd className="mt-2">{project.year}</dd>
            </div>
            <div>
              <Label as="dt">Role</Label>
              <dd className="mt-2">{project.role}</dd>
            </div>
            {project.stack.length > 0 ? (
              <div>
                <Label as="dt">Stack</Label>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-1.5">
                    {project.stack.map((tag) => (
                      <li key={tag}>
                        <Tag>{tag}</Tag>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
            {links.length > 0 ? (
              <div>
                <Label as="dt">Links</Label>
                <dd className="mt-2">
                  <ul className="grid gap-1.5">
                    {links.map((link) => (
                      <li key={link.href}>
                        <UnderlineLink href={link.href} external>
                          {link.label} ↗
                        </UnderlineLink>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>
        </aside>
      </div>

      {previous || next ? (
        <nav
          aria-label="More projects"
          className="mt-20 grid gap-6 border-t border-line pt-8 sm:grid-cols-2"
        >
          {previous ? (
            <Link href={`/projects/${previous.slug}`} rel="prev" className="group block">
              <span className="label">Previous project</span>
              <span className="mt-2 block font-display text-lg leading-snug font-medium group-hover:text-accent">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              rel="next"
              className="group block sm:col-start-2 sm:text-right"
            >
              <span className="label">Next project</span>
              <span className="mt-2 block font-display text-lg leading-snug font-medium group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  )
}
