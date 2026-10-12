import Link from 'next/link'
import { Label } from '@/components/ui/Label'
import { UnderlineLink } from '@/components/ui/UnderlineLink'
import { Container } from './Container'
import { NAV_LINKS, REPO_URL, SOCIAL_LINKS } from './nav'

const SITE_LINKS = [
  ...NAV_LINKS.map((link) => ({ label: link.label, href: link.href })),
  { label: 'uses', href: '/uses' },
  { label: 'contact', href: '/contact' },
]

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-line pt-14 pb-10">
      <Container>
        <div className="flex flex-wrap justify-between gap-x-12 gap-y-6">
          <FooterColumn title="Elsewhere">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <UnderlineLink href={link.href} external>
                  {link.label}
                </UnderlineLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Site">
            {SITE_LINKS.map((link) => (
              <li key={link.href}>
                <UnderlineLink href={link.href}>{link.label}</UnderlineLink>
              </li>
            ))}
            <li>
              <UnderlineLink href="/rss.xml">rss</UnderlineLink>
            </li>
          </FooterColumn>

          <FooterColumn title="Archive">
            <li>
              <UnderlineLink href={`${REPO_URL}/tree/v2024.1`} external>
                The 2024 site
              </UnderlineLink>
            </li>
            <li>
              <UnderlineLink href={REPO_URL} external>
                Built with Next.js
              </UnderlineLink>
            </li>
          </FooterColumn>
        </div>

        {/* Decorative: the outlined wordmark fills in on hover. */}
        <div
          aria-hidden="true"
          className="mt-10 font-display text-[clamp(6rem,30vw,24rem)] leading-[0.8] font-bold tracking-[-0.06em] text-outline select-none"
        >
          F<span className="hover:text-accent">/</span>A
        </div>

        <p className="mt-8 small text-muted">
          <Link href="/" className="hover:text-fg">
            © {new Date().getFullYear()} Francis Aguilar
          </Link>
        </p>
      </Container>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <Label as="h2">{title}</Label>
      <ul className="mt-2.5 grid gap-1.5">{children}</ul>
    </div>
  )
}
