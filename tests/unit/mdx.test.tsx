import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Callout } from '@/components/mdx/Callout'
import { Figure } from '@/components/mdx/Figure'
import { mdxComponents } from '@/components/mdx'
import { MdxLink } from '@/components/mdx/MdxLink'
import { MDXContent } from '@/components/mdx/MDXContent'

describe('MdxLink', () => {
  it('opens absolute links in a new tab with rel=noopener', () => {
    render(<MdxLink href="https://posthog.com">PostHog</MdxLink>)
    const link = screen.getByRole('link', { name: 'PostHog' })
    expect(link).toHaveAttribute('href', 'https://posthog.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
  })

  it('keeps site paths in the same tab', () => {
    render(<MdxLink href="/blog/231221-hello-world">Hello</MdxLink>)
    const link = screen.getByRole('link', { name: 'Hello' })
    expect(link).toHaveAttribute('href', '/blog/231221-hello-world')
    expect(link).not.toHaveAttribute('target')
  })

  it('leaves heading anchors and mailto links plain', () => {
    render(
      <>
        <MdxLink href="#reason-1">Anchor</MdxLink>
        <MdxLink href="mailto:someone@example.com">Mail</MdxLink>
      </>
    )
    expect(screen.getByRole('link', { name: 'Anchor' })).not.toHaveClass('underline-grow')
    expect(screen.getByRole('link', { name: 'Mail' })).not.toHaveAttribute('target')
  })
})

describe('Figure', () => {
  it('renders the image with its intrinsic size and a caption from the title', () => {
    render(
      <Figure src="/static/images/a.webp" alt="A photo" width="1500" height="500" title="Caption" />
    )
    const img = screen.getByRole('img', { name: 'A photo' })
    expect(img).toHaveAttribute('width', '1500')
    expect(img).toHaveAttribute('height', '500')
    expect(screen.getByText('Caption').tagName).toBe('FIGCAPTION')
  })

  it('falls back to a plain image when there is no size (remote images)', () => {
    render(<Figure src="https://example.com/a.png" alt="Remote" />)
    expect(screen.getByRole('img', { name: 'Remote' })).toHaveAttribute(
      'src',
      'https://example.com/a.png'
    )
  })
})

describe('Callout', () => {
  it('is a note landmark with an optional title', () => {
    render(<Callout title="Heads up">Careful.</Callout>)
    expect(screen.getByRole('complementary')).toHaveTextContent('Heads upCareful.')
  })
})

describe('MDXContent', () => {
  it('evaluates compiled MDX with the shared components', () => {
    // What Velite emits for: [link](https://example.com) and <Callout>note</Callout>
    const code = `const{Fragment:e,jsx:i,jsxs:t}=arguments[0];function _createMdxContent(s){const n={a:"a",p:"p",...s.components},{Callout:c}=n;return t(e,{children:[i(n.p,{children:i(n.a,{href:"https://example.com",children:"link"})}),i(c,{children:"note"})]})}return{default:function(s={}){return i(_createMdxContent,s)}}`
    render(<MDXContent code={code} />)
    expect(screen.getByRole('link', { name: 'link' })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('complementary')).toHaveTextContent('note')
    expect(Object.keys(mdxComponents)).toEqual(
      expect.arrayContaining(['img', 'a', 'pre', 'table', 'Callout'])
    )
  })
})
