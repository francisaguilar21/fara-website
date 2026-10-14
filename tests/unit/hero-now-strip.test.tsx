import { render, screen, within } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { Hero } from '@/components/home/Hero'
import { NowStrip, type NowStripItem } from '@/components/home/NowStrip'

// The portrait uses scroll-linked motion and a static image import: covered by the e2e tests.
vi.mock('@/components/home/HeroPortrait', () => ({
  HeroPortrait: () => <div data-testid="portrait" />,
}))

// jsdom has no `matchMedia`, which the motion hooks read.
beforeAll(() => {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList
})

afterEach(() => vi.unstubAllEnvs())

const hero = {
  name: 'Francis Aguilar',
  headline: 'I build software & run long distances.',
  intro: 'An intro.',
  location: 'Manila, PH',
  bookingUrl: 'https://cal.example.com/book',
}

describe('Hero', () => {
  it('renders the headline as the only h1, with every word in reading order', () => {
    render(<Hero {...hero} />)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]?.textContent?.replace(/\s+/g, ' ').trim()).toBe(hero.headline)
  })

  it('shows the label row with the city-level coordinates', () => {
    render(<Hero {...hero} />)
    expect(screen.getByText('Manila, PH · 14.60°N 120.98°E')).toBeInTheDocument()
  })

  it('lists the three roles and marks the unconfirmed employer as a draft', () => {
    vi.stubEnv('VERCEL_ENV', 'preview')
    vi.stubEnv('HIDE_DRAFTS', '')
    render(<Hero {...hero} />)
    for (const path of ['/work', '/build', '/run'])
      expect(screen.getByText(path)).toBeInTheDocument()
    expect(screen.getByText('company?')).toBeInTheDocument()
  })

  it('keeps the roles but drops the draft chip where drafts are hidden', () => {
    for (const [vercel, hide] of [
      ['production', ''],
      ['preview', '1'],
    ]) {
      vi.stubEnv('VERCEL_ENV', vercel!)
      vi.stubEnv('HIDE_DRAFTS', hide!)
      const { unmount } = render(<Hero {...hero} />)
      for (const path of ['/work', '/build', '/run'])
        expect(screen.getByText(path)).toBeInTheDocument()
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument()
      expect(screen.queryByText('company?')).not.toBeInTheDocument()
      unmount()
    }
  })

  it('links the CTAs to the work section and the booking page', () => {
    render(<Hero {...hero} />)
    expect(screen.getByRole('link', { name: /See my work/ })).toHaveAttribute('href', '#work')
    const book = screen.getByRole('link', { name: 'Book a call' })
    expect(book).toHaveAttribute('href', hero.bookingUrl)
    expect(book).toHaveAttribute('target', '_blank')
  })

  it('has no booking button without a booking URL: it points at the contact form instead', () => {
    render(<Hero {...hero} bookingUrl={undefined} />)
    expect(screen.queryByRole('link', { name: 'Book a call' })).not.toBeInTheDocument()
    const message = screen.getByRole('link', { name: 'Send a message' })
    expect(message).toHaveAttribute('href', '#contact')
    expect(message).not.toHaveAttribute('target')
  })
})

const items: NowStripItem[] = [
  { label: 'NOW', text: 'Training block', badge: 'draft' },
  { label: 'LISTENING', text: 'A song', badge: 'sample', playing: true },
  { label: 'BUILDING', text: 'This site' },
]

describe('NowStrip', () => {
  it('is a labelled region with the #now anchor', () => {
    render(<NowStrip items={items} />)
    const region = screen.getByRole('region', { name: "What I'm doing now" })
    expect(region).toHaveAttribute('id', 'now')
  })

  it('exposes one copy of the items to assistive tech and hides the repeats', () => {
    const { container } = render(<NowStrip items={items} />)
    const lists = container.querySelectorAll('ul')
    expect(lists.length).toBeGreaterThan(1)
    expect(lists[0]).not.toHaveAttribute('aria-hidden')
    lists.forEach((list, index) => {
      if (index > 0) expect(list).toHaveAttribute('aria-hidden', 'true')
    })
    // Only the first list is in the accessibility tree.
    expect(screen.getAllByRole('listitem')).toHaveLength(items.length)
    expect(screen.getAllByText('NOW')).toHaveLength(lists.length)
  })

  it('shows draft and sample chips and the equaliser only where they apply', () => {
    render(<NowStrip items={items} />)
    const first = screen.getAllByRole('listitem')
    expect(within(first[0]!).getByText('draft')).toBeInTheDocument()
    expect(within(first[1]!).getByText('sample')).toBeInTheDocument()
    expect(within(first[1]!).getByTestId('equalizer')).toBeInTheDocument()
    expect(within(first[2]!).queryByText(/draft|sample/)).not.toBeInTheDocument()
  })
})
