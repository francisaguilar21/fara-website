import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbJsonLd, type BreadcrumbItem } from '@/lib/seo'

/**
 * The back link of a sub-page (`/life/running` goes back to `/life`) and the matching
 * `BreadcrumbList` JSON-LD (P6-R5). `trail` runs from the top: the last item is the current page,
 * and the one before it is where the link goes.
 */
export function Breadcrumbs({ trail }: { trail: BreadcrumbItem[] }) {
  const parent = trail.at(-2)

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      {parent ? (
        <Link
          href={parent.path}
          className="inline-flex items-center gap-2 label transition-colors hover:text-accent"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {parent.name}
        </Link>
      ) : null}
    </>
  )
}
