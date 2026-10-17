import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { TableOfContents } from '@/components/life/TableOfContents'
import { MDXContent } from '@/components/mdx/MDXContent'
import { DraftChip } from '@/components/ui/DraftChip'
import { getPage } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

const DESCRIPTION =
  'The founder story: what we built, what broke, and what I took back into engineering.'

export function generateMetadata() {
  const page = getPage('life/building')
  return pageMetadata({
    title: page?.title ?? 'Building',
    description: page?.teaser ?? DESCRIPTION,
    path: '/life/building',
  })
}

export default function BuildingPage() {
  // A draft is left out in production: no page, like the card that would link to it.
  const page = getPage('life/building')
  if (!page) notFound()

  return (
    <Container className="py-16 md:py-24">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Life', path: '/life' },
          { name: 'Building', path: '/life/building' },
        ]}
      />
      <PageHeader
        className="mt-10"
        path="/life/building"
        title={
          <>
            {page.title}
            {page.draft ? (
              <>
                {' '}
                <DraftChip />
              </>
            ) : null}
          </>
        }
        description={page.teaser ?? DESCRIPTION}
      />

      <div className="mt-[clamp(40px,6vw,72px)] grid gap-x-[clamp(32px,6vw,88px)] min-[1024px]:grid-cols-[minmax(0,1fr)_220px]">
        <div className="prose min-w-0">
          <MDXContent code={page.body} />
        </div>
        <div className="min-[1024px]:order-last">
          <TableOfContents entries={page.toc} />
        </div>
      </div>
    </Container>
  )
}
