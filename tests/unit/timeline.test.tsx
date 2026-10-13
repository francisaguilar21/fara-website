import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TimelineItem, type TimelineEntry } from '@/components/home/TimelineItem'
import { TimelineLegend } from '@/components/home/TimelineLegend'
import { activeEntries, entrySub, entryYear, formatRange } from '@/lib/home/timeline'

describe('activeEntries', () => {
  // Entries 200px apart, newest first. The reading line is at 550px.
  const tops = (scrolled: number) => [0, 1, 2, 3, 4].map((index) => 700 + index * 200 - scrolled)

  it('lights only the first entry before anything has passed the line', () => {
    expect(activeEntries(tops(0), 550)).toEqual({
      lit: [true, false, false, false, false],
      active: 0,
    })
  })

  it('lights entries in order as their tops pass the line, and the last lit one is active', () => {
    expect(activeEntries(tops(400), 550)).toEqual({
      lit: [true, true, false, false, false],
      active: 1,
    })
    expect(activeEntries(tops(600), 550)).toEqual({
      lit: [true, true, true, false, false],
      active: 2,
    })
    expect(activeEntries(tops(1000), 550)).toEqual({
      lit: [true, true, true, true, true],
      active: 4,
    })
  })

  it('switches an entry on exactly when its top crosses the line', () => {
    expect(activeEntries([700, 551], 550).lit).toEqual([true, false])
    expect(activeEntries([700, 549.9], 550).lit).toEqual([true, true])
  })

  it('turns entries off again when scrolling back up', () => {
    const down = activeEntries(tops(1000), 550)
    const up = activeEntries(tops(600), 550)
    expect(down.active).toBe(4)
    expect(up).toEqual({ lit: [true, true, true, false, false], active: 2 })
  })

  it('keeps the first entry active even when it is already below the line', () => {
    expect(activeEntries([900, 1100], 550).active).toBe(0)
    expect(activeEntries([], 550)).toEqual({ lit: [], active: 0 })
  })
})

describe('timeline dates', () => {
  it('formats a span as years, a single moment as a month, and an ongoing entry as "→ Now"', () => {
    expect(formatRange({ start: '2019-01', end: '2024-01' })).toBe('2019 → 2024')
    expect(formatRange({ start: '2024-01', end: '2024-01' })).toBe('Jan 2024')
    expect(formatRange({ start: '2023-01', end: '' })).toBe('2023 → Now')
    expect(formatRange({ start: '2023-01' })).toBe('2023 → Now')
  })

  it('shows the year and a short note in the sticky column', () => {
    expect(entryYear({ start: '2019-01', end: '2024-01' })).toBe('2019')
    expect(entrySub({ start: '2019-01', end: '2024-01' })).toBe('→ 2024')
    expect(entrySub({ start: '2023-12', end: '2023-12' })).toBe('Dec')
    expect(entrySub({ start: '2023-01', end: '' })).toBe('→ Now')
  })
})

const entry: TimelineEntry = {
  role: 'Co-founder & CTO',
  org: 'Fitscovery',
  start: '2019-01',
  end: '2024-01',
  kind: 'work',
  summary: 'Built the product.',
  tags: ['Founder', 'Architecture', 'Hiring', 'Extra'],
  draft: true,
}

describe('TimelineItem', () => {
  it('shows the role, org, dates, summary, at most 3 tags and a draft chip', () => {
    render(<TimelineItem entry={entry} lit />)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Co-founder & CTO · Fitscovery'
    )
    expect(screen.getByText('2019 → 2024')).toBeInTheDocument()
    expect(screen.getByText('Built the product.')).toBeInTheDocument()
    expect(
      within(screen.getByRole('list', { name: 'Tags' })).getAllByRole('listitem')
    ).toHaveLength(3)
    expect(screen.queryByText('Extra')).not.toBeInTheDocument()
    expect(screen.getByText('draft')).toBeInTheDocument()
  })

  it('fills the dot for work and leaves life as a ring, once lit', () => {
    const { container, rerender } = render(<TimelineItem entry={entry} lit />)
    const dot = () => container.querySelector('li > span') as HTMLElement
    expect(dot()).toHaveClass('border-accent', 'bg-accent')

    rerender(<TimelineItem entry={{ ...entry, kind: 'life' }} lit />)
    expect(dot()).toHaveClass('border-accent')
    expect(dot()).not.toHaveClass('bg-accent')

    rerender(<TimelineItem entry={entry} lit={false} />)
    expect(dot()).not.toHaveClass('border-accent', 'bg-accent')
    expect(container.querySelector('li')).toHaveAttribute('data-lit', 'false')
  })

  it('has no draft chip for real content', () => {
    render(<TimelineItem entry={{ ...entry, draft: false }} lit />)
    expect(screen.queryByText('draft')).not.toBeInTheDocument()
  })
})

describe('TimelineLegend', () => {
  it('explains work and life', () => {
    render(<TimelineLegend />)
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('Life')).toBeInTheDocument()
  })
})
