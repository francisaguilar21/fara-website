import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ThemePanel } from '@/components/layout/ThemePanel'
import { AA_TEXT, contrastRatio } from '@/lib/design/contrast'
import { readTokens, TEXT_PAIRS, TOKEN_NAMES, type Theme } from '@/lib/design/tokens'

export const metadata: Metadata = { title: 'Styleguide', robots: { index: false, follow: false } }

const THEMES: Theme[] = ['dark', 'light']

export default function StyleguidePage() {
  // Development and preview only.
  if (process.env.VERCEL_ENV === 'production') notFound()

  const tokens = readTokens()

  return (
    <main id="main" className="mx-auto max-w-[1240px] px-[clamp(16px,4vw,40px)] py-16">
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
    </main>
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
