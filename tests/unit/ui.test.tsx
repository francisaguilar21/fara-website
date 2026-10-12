import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from '@/components/ui/Button'
import { DraftChip } from '@/components/ui/DraftChip'
import { Logo } from '@/components/ui/Logo'
import { UnderlineLink } from '@/components/ui/UnderlineLink'

describe('Button', () => {
  it('renders as a link when given an href', () => {
    render(<Button href="/contact">Let&apos;s talk</Button>)
    const link = screen.getByRole('link', { name: "Let's talk" })
    expect(link).toHaveAttribute('href', '/contact')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('opens external links in a new tab safely', () => {
    render(<Button href="https://cal.example.com/book">Book a call</Button>)
    const link = screen.getByRole('link', { name: 'Book a call' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders a button by default', () => {
    render(<Button>Send</Button>)
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'button')
  })

  it('styles the child element with asChild', () => {
    render(
      <Button asChild variant="ghost">
        <a href="/x" className="extra">
          Child
        </a>
      </Button>
    )
    const link = screen.getByRole('link', { name: 'Child' })
    expect(link).toHaveClass('extra', 'rounded-full', 'border-line')
  })

  it('switches classes with variant and size', () => {
    render(
      <Button variant="ghost" size="sm">
        Small
      </Button>
    )
    expect(screen.getByRole('button')).toHaveClass('border-line', 'text-[0.8125rem]')
  })
})

describe('DraftChip', () => {
  it('says "draft" by default', () => {
    render(<DraftChip />)
    expect(screen.getByText('draft')).toBeInTheDocument()
  })

  it('renders custom text', () => {
    render(<DraftChip>company?</DraftChip>)
    expect(screen.getByText('company?')).toBeInTheDocument()
  })
})

describe('Logo', () => {
  it('draws the letters in currentColor', () => {
    const { container } = render(<Logo />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('fill', 'currentColor')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    const [letters, slash] = Array.from(container.querySelectorAll('path'))
    expect(letters).not.toHaveAttribute('fill')
    expect(slash).not.toHaveAttribute('fill')
  })

  it('colors only the slash with the accent token', () => {
    const { container } = render(<Logo accent />)
    const [letters, slash] = Array.from(container.querySelectorAll('path'))
    expect(letters).not.toHaveAttribute('fill')
    expect(slash).toHaveAttribute('fill', 'var(--accent)')
  })

  it('is exposed to assistive tech when given a title', () => {
    render(<Logo title="Francis Aguilar" />)
    expect(screen.getByRole('img', { name: 'Francis Aguilar' })).toBeInTheDocument()
  })
})

describe('UnderlineLink', () => {
  it('renders an internal link with the growing underline', () => {
    render(<UnderlineLink href="/work">Work</UnderlineLink>)
    const link = screen.getByRole('link', { name: 'Work' })
    expect(link).toHaveAttribute('href', '/work')
    expect(link).toHaveClass('underline-grow')
    expect(link).not.toHaveAttribute('target')
  })

  it('opens external links in a new tab', () => {
    render(
      <UnderlineLink href="https://github.com/francisaguilar21" external>
        GitHub
      </UnderlineLink>
    )
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('target', '_blank')
  })
})
