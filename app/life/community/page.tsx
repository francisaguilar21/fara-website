import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/layout/PageHeader'
import { TalkList } from '@/components/life/TalkList'
import { Button } from '@/components/ui/Button'
import { getTalks } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'

const DESCRIPTION = 'Talks, meetups and events, and the runners I pace.'

export const metadata = pageMetadata({
  title: 'Community',
  description: DESCRIPTION,
  path: '/life/community',
})

export default function CommunityPage() {
  const talks = getTalks()

  return (
    <Container className="py-16 md:py-24">
      <Breadcrumbs
        trail={[
          { name: 'Home', path: '/' },
          { name: 'Life', path: '/life' },
          { name: 'Community', path: '/life/community' },
        ]}
      />
      <PageHeader
        className="mt-10"
        path="/life/community"
        title="Community"
        description={DESCRIPTION}
      />

      <div className="mt-[clamp(40px,6vw,72px)]">
        {talks.length > 0 ? (
          <TalkList talks={talks} />
        ) : (
          <p className="text-muted">Talks and events are on the way.</p>
        )}
      </div>

      <section
        aria-labelledby="pacing-heading"
        className="mt-[clamp(64px,10vw,128px)] max-w-[60ch] border-t border-line pt-8"
      >
        <h2 id="pacing-heading" className="h2">
          Pacing
        </h2>
        <p className="mt-4 text-muted">
          Beyond the stage, I pace runners to their goal times at local races and club runs. The
          paces I lead and the races I have run are on the running page.
        </p>
        <div className="mt-6">
          <Button href="/life/running" variant="ghost" size="sm">
            Pacing and race log <span aria-hidden="true">→</span>
          </Button>
        </div>
      </section>
    </Container>
  )
}
