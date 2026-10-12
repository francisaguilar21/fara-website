import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Section } from '@/components/layout/Section'
import { ThemePanel } from '@/components/layout/ThemePanel'
import { Button } from '@/components/ui/Button'
import { DraftChip } from '@/components/ui/DraftChip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Label } from '@/components/ui/Label'
import { Logo } from '@/components/ui/Logo'
import { SlashDivider } from '@/components/ui/SlashDivider'
import { Tag } from '@/components/ui/Tag'
import { UnderlineLink } from '@/components/ui/UnderlineLink'
import { AA_TEXT, contrastRatio } from '@/lib/design/contrast'
import { readTokens, TEXT_PAIRS, TOKEN_NAMES, type Theme } from '@/lib/design/tokens'

export const metadata: Metadata = { title: 'Styleguide', robots: { index: false, follow: false } }

const THEMES: Theme[] = ['dark', 'light']

export default function StyleguidePage() {
  // Development and preview only.
  if (process.env.VERCEL_ENV === 'production') notFound()

  const tokens = readTokens()

  return (
    <div className="mx-auto max-w-[1240px] px-[clamp(16px,4vw,40px)] py-16">
      <p className="label">/styleguide</p>
      <h1 className="mt-4 h1">Design system</h1>
      <p className="mt-4 max-w-[60ch] text-muted">
        Every token and component, in both themes. Development and preview only: this page returns
        404 in production.
      </p>

      <StyleSection id="colors" title="Colors">
        <div className="grid gap-6 lg:grid-cols-2">
          {THEMES.map((theme) => (
            <ThemePanel key={theme} theme={theme}>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {TOKEN_NAMES.map((name) => (
                  <li key={name} className="flex items-center gap-3">
                    <span
                      className="size-10 shrink-0 border border-line"
                      style={{ background: `var(--${name})` }}
                      aria-hidden="true"
                    />
                    <span className="data text-sm">
                      --{name}
                      <br />
                      <span className="text-muted">{tokens[theme][name]}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 mb-3 h3">Text contrast</h3>
              <table className="w-full text-left small">
                <thead>
                  <tr className="label">
                    <th className="py-1 font-medium">Text</th>
                    <th className="py-1 font-medium">On</th>
                    <th className="py-1 font-medium">Ratio</th>
                    <th className="py-1 font-medium">AA</th>
                  </tr>
                </thead>
                <tbody>
                  {TEXT_PAIRS.map(([text, background]) => {
                    const ratio = contrastRatio(tokens[theme][text], tokens[theme][background])
                    const pass = ratio >= AA_TEXT
                    return (
                      <tr key={`${text}-${background}`} className="border-t border-line">
                        <td className="py-1.5">
                          <span
                            className="px-2 py-0.5"
                            style={{ color: `var(--${text})`, background: `var(--${background})` }}
                          >
                            Aa {text}
                          </span>
                        </td>
                        <td className="py-1.5">{background}</td>
                        <td className="py-1.5 data">{ratio.toFixed(2)}:1</td>
                        <td className={pass ? 'py-1.5 text-ok' : 'py-1.5 text-error'}>
                          {pass ? 'Pass' : 'Fail'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </ThemePanel>
          ))}
        </div>
      </StyleSection>

      <StyleSection id="type" title="Type scale">
        <div className="grid gap-6 lg:grid-cols-2">
          {THEMES.map((theme) => (
            <ThemePanel key={theme} theme={theme} className="space-y-6">
              <Specimen name=".display-xl · Space Grotesk 600">
                <p className="display-xl">I build software &amp; run long distances.</p>
              </Specimen>
              <Specimen name=".h1 · Space Grotesk 600">
                <p className="h1">Page title</p>
              </Specimen>
              <Specimen name=".h2 · Space Grotesk 500">
                <p className="h2">Section title</p>
              </Specimen>
              <Specimen name=".h3 · Space Grotesk 500">
                <p className="h3">Card or timeline role</p>
              </Specimen>
              <Specimen name=".body · Inter 400, 68ch max">
                <p className="body">
                  Body copy is set in Inter at 17px with a 1.65 line height. It stays under 68
                  characters per line so long paragraphs remain easy to read.
                </p>
              </Specimen>
              <Specimen name=".small · Inter 400">
                <p className="small">Metadata and captions.</p>
              </Specimen>
              <Specimen name=".label · JetBrains Mono 500">
                <p className="label">Experience &amp; milestones</p>
              </Specimen>
              <Specimen name=".data · JetBrains Mono 500, tabular">
                <p className="data text-5xl">41.2 km</p>
              </Specimen>
            </ThemePanel>
          ))}
        </div>

        <h3 className="mt-10 mb-4 h3">Prose (blog posts)</h3>
        <div className="grid gap-6 lg:grid-cols-2">
          {THEMES.map((theme) => (
            <ThemePanel key={theme} theme={theme}>
              <article className="prose">
                <h2>A heading in Space Grotesk</h2>
                <p>
                  Body text in Inter with a <a href="#prose">rose link</a> and some{' '}
                  <code>inline code</code> in JetBrains Mono.
                </p>
                <blockquote>
                  <p>Quotes use the display face and a rose rule.</p>
                </blockquote>
                <ul>
                  <li>List item one</li>
                  <li>List item two</li>
                </ul>
                <pre>
                  <code>{`const pace = km / hours // mono, on --surface`}</code>
                </pre>
              </article>
            </ThemePanel>
          ))}
        </div>
      </StyleSection>

      <StyleSection id="logo" title="Logo">
        <div className="grid gap-6 lg:grid-cols-2">
          {THEMES.map((theme) => (
            <ThemePanel key={theme} theme={theme} className="flex flex-wrap items-end gap-10">
              <Specimen name="<Logo />">
                <Logo className="h-12" />
              </Specimen>
              <Specimen name="<Logo accent />">
                <Logo accent className="h-12" />
              </Specimen>
              <Specimen name="Small, in a link">
                <Logo accent className="h-6" />
              </Specimen>
            </ThemePanel>
          ))}
        </div>
      </StyleSection>

      <StyleSection id="components" title="UI primitives">
        <div className="grid gap-6 lg:grid-cols-2">
          {THEMES.map((theme) => (
            <ThemePanel key={theme} theme={theme} className="space-y-8">
              <Specimen name="<Button />: solid, ghost, sm">
                <div className="flex flex-wrap items-center gap-3">
                  <Button href="#components">See my work</Button>
                  <Button href="#components" variant="ghost">
                    Book a call
                  </Button>
                  <Button href="#components" size="sm">
                    Let&apos;s talk
                  </Button>
                  <Button href="#components" variant="ghost" size="sm">
                    Full timeline →
                  </Button>
                </div>
              </Specimen>
              <Specimen name="<Eyebrow /> and <Label />">
                <div className="flex items-center gap-4">
                  <Eyebrow path="/work" />
                  <Label>Experience &amp; milestones</Label>
                </div>
              </Specimen>
              <Specimen name="<Tag />">
                <div className="flex flex-wrap gap-1.5">
                  <Tag>TypeScript</Tag>
                  <Tag>React</Tag>
                  <Tag>Cloud</Tag>
                </div>
              </Specimen>
              <Specimen name="<DraftChip />">
                <p>
                  Senior Software Engineer <DraftChip>company?</DraftChip> <DraftChip />
                </p>
              </Specimen>
              <Specimen name="<UnderlineLink /> (hover or focus)">
                <UnderlineLink href="#components">
                  A link with a growing rose underline
                </UnderlineLink>
              </Specimen>
              <Specimen name="<SlashDivider />">
                <SlashDivider />
              </Specimen>
            </ThemePanel>
          ))}
        </div>
      </StyleSection>

      <StyleSection id="layout" title="Layout">
        <p className="mb-6 max-w-[60ch] text-muted">
          The sticky <code className="data">&lt;SiteHeader /&gt;</code> and the{' '}
          <code className="data">&lt;SiteFooter /&gt;</code> are this page&apos;s own header and
          footer. Below is <code className="data">&lt;Section eyebrow label /&gt;</code>.
        </p>
        <div className="border border-line">
          <Section eyebrow="/work" label="Experience" className="py-12 md:py-12">
            <h3 className="h2">Section content sits in the right column.</h3>
            <p className="mt-4 body text-muted">
              The eyebrow and label live in a narrow rail on the left. Under 820px they stack.
            </p>
          </Section>
        </div>
      </StyleSection>
    </div>
  )
}

function StyleSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mt-20" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="mb-8 h2">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Specimen({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 label">{name}</p>
      {children}
    </div>
  )
}
