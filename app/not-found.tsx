'use client'

import { usePathname } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { useIsClient } from '@/lib/motion'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/writings', label: 'Writings' },
  { href: '/work', label: 'Work' },
]

/**
 * The branded 404 (P6-R17): the rose F/A mark on black, the path that was asked for, and three ways
 * out. Next answers 404 for it, both for an unknown URL and for a `notFound()` call. The panel
 * stays dark in the light theme too (`data-theme="dark"` brings the dark tokens to it).
 *
 * The page is built once, so the server HTML cannot know the path; the browser fills it in.
 */
export default function NotFound() {
  const pathname = usePathname()
  const isClient = useIsClient()

  return (
    <div data-theme="dark" className="bg-bg text-fg">
      <Container className="flex min-h-[70vh] flex-col items-start justify-center gap-6 py-24">
        <Logo accent title="F/A" className="h-16 text-fg md:h-24" />
        <h1 className="h1">This path doesn&apos;t exist</h1>
        <p className="font-mono text-base break-all text-muted">
          {isClient ? (
            <code data-testid="requested-path" className="text-accent">
              {pathname}
            </code>
          ) : (
            <span aria-hidden="true">&nbsp;</span>
          )}
        </p>
        <ul className="flex flex-wrap gap-3">
          {LINKS.map((link, index) => (
            <li key={link.href}>
              <Button href={link.href} variant={index === 0 ? 'solid' : 'ghost'}>
                {link.label}
              </Button>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  )
}
