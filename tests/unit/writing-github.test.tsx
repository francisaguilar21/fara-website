import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LatestPosts } from '@/components/home/LatestPosts'
import { StackGrid } from '@/components/home/StackGrid'
import { ContributionGraph } from '@/components/widgets/ContributionGraph'
import { cellAt, dateAt, heatmapGeometry, LEVELS } from '@/lib/home/heatmap'
import type { Post } from '@/lib/content'
import { formatPostDate, formatReadMinutes, githubUsername } from '@/lib/home/format'
import { CONTRIBUTIONS_SAMPLE } from '@/lib/integrations/fallbacks'

const post = (slug: string, date: string, readingTime: number) =>
  ({
    slug,
    title: `Title ${slug}`,
    summary: `Summary ${slug}`,
    date,
    permalink: `/blog/${slug}`,
    metadata: { readingTime, wordCount: 100 },
  }) as Post

describe('formatting for writing and GitHub', () => {
  it('writes a post date as day, short month, year, in UTC', () => {
    expect(formatPostDate('2024-01-12T00:00:00.000Z')).toBe('12 Jan 2024')
    expect(formatPostDate('2023-12-21T00:00:00.000Z')).toBe('21 Dec 2023')
    // Late in the day in UTC is still the same day for everyone.
    expect(formatPostDate('2024-01-12T23:59:59.000Z')).toBe('12 Jan 2024')
  })

  it('rounds reading time up to whole minutes, at least one', () => {
    expect([0.2, 1, 2.4, 5].map(formatReadMinutes)).toEqual(['1 min', '1 min', '3 min', '5 min'])
  })

  it('finds the GitHub username in the socials', () => {
    expect(
      githubUsername([
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/someone' },
        { label: 'GitHub', url: 'https://github.com/francisaguilar21/' },
      ])
    ).toBe('francisaguilar21')
    expect(githubUsername([{ label: 'X', url: 'https://twitter.com/x' }])).toBeUndefined()
  })
})

describe('LatestPosts', () => {
  const posts = [
    post('b', '2024-01-12T00:00:00.000Z', 3),
    post('a', '2023-12-21T00:00:00.000Z', 1.2),
  ]

  it('lists the posts with date, title, summary and reading time, linking to each', () => {
    render(<LatestPosts posts={posts} />)
    const links = screen.getAllByRole('link', { name: /Title/ })
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/blog/b', '/blog/a'])
    expect(links[0]).toHaveTextContent('12 Jan 2024')
    expect(links[0]).toHaveTextContent('Summary b')
    expect(links[0]).toHaveTextContent('3 min')
    expect(links[1]).toHaveTextContent('2 min')
    expect(screen.getByRole('link', { name: /All posts/ })).toHaveAttribute('href', '/blog')
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'writing-heading')
  })

  it('uses a time element with the machine-readable date', () => {
    const { container } = render(<LatestPosts posts={posts} />)
    expect(container.querySelector('time')).toHaveAttribute('datetime', '2024-01-12T00:00:00.000Z')
  })

  it('renders nothing when there are no posts', () => {
    const { container } = render(<LatestPosts posts={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('StackGrid', () => {
  const groups = [
    { category: 'Languages', items: [{ name: 'TypeScript' }, { name: 'SQL' }], draft: true },
    { category: 'Product', items: [{ name: 'PostHog', url: 'https://posthog.com' }] },
  ]

  it('shows each group with its items, and links the ones that have a URL', () => {
    render(<StackGrid groups={groups} />)
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Languages',
      'Product',
    ])
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'PostHog' })).toHaveAttribute(
      'href',
      'https://posthog.com'
    )
    expect(screen.getByRole('link', { name: /Everything I use/ })).toHaveAttribute('href', '/uses')
  })

  it('marks the section as a draft while any group is', () => {
    render(<StackGrid groups={groups} />)
    expect(screen.getByText('draft')).toBeInTheDocument()
  })

  it('renders nothing without groups', () => {
    const { container } = render(<StackGrid groups={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('ContributionGraph', () => {
  it('draws the heatmap as one SVG with a path per level, and shows the total', () => {
    const { container } = render(
      <ContributionGraph calendar={CONTRIBUTIONS_SAMPLE} username="francisaguilar21" />
    )
    const svg = screen.getByTestId('contribution-heatmap')
    expect(svg.querySelectorAll('path')).toHaveLength(5)
    expect(Array.from(svg.querySelectorAll('path'), (path) => path.dataset.level)).toEqual([
      '0',
      '1',
      '2',
      '3',
      '4',
    ])
    // Nothing is drawn as a box per day.
    expect(container.querySelectorAll('main i, [data-date]')).toHaveLength(0)
    expect(screen.getByTestId('contribution-total')).toHaveTextContent(
      CONTRIBUTIONS_SAMPLE.total.toLocaleString('en-US')
    )
  })

  it('has a text alternative, scrolls inside its own focusable box, and credits the account', () => {
    render(<ContributionGraph calendar={CONTRIBUTIONS_SAMPLE} username="francisaguilar21" />)
    const image = screen.getByRole('img', { name: /GitHub contributions over the last 53 weeks/ })
    expect(image).toHaveAccessibleName(/in total.*Sample data/)
    const region = screen.getByRole('region', { name: /Contribution heatmap/ })
    expect(region).toHaveAttribute('tabindex', '0')
    expect(region).toHaveClass('overflow-x-auto')
    expect(screen.getByRole('link', { name: /francisaguilar21 on GitHub/ })).toHaveAttribute(
      'href',
      'https://github.com/francisaguilar21'
    )
  })

  it('shows a tooltip with the date and count for the cell under the pointer', () => {
    render(<ContributionGraph calendar={CONTRIBUTIONS_SAMPLE} username="francisaguilar21" />)
    const svg = screen.getByTestId('contribution-heatmap')
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    // jsdom has no layout, so the SVG sits at (0, 0) at its own size: the pointer position is the
    // position in the graph. (7, 7) is the middle of the first cell.
    fireEvent.pointerMove(svg, { clientX: 7, clientY: 7, pointerType: 'mouse' })
    const first = CONTRIBUTIONS_SAMPLE.weeks[0]![0]!
    expect(screen.getByRole('tooltip')).toHaveTextContent(
      `${first.count === 0 ? 'No' : first.count} contribution${first.count === 1 ? '' : 's'} on Oct 12, 2025`
    )
    // A gap between cells shows nothing, and so does leaving the graph.
    fireEvent.pointerMove(svg, { clientX: 12, clientY: 7, pointerType: 'mouse' })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    fireEvent.pointerMove(svg, { clientX: 7 + 14 * 20, clientY: 7 + 14 * 3, pointerType: 'mouse' })
    const day = CONTRIBUTIONS_SAMPLE.weeks[20]![3]!
    expect(screen.getByRole('tooltip')).toHaveTextContent(day.date.slice(8).replace(/^0/, ''))
    fireEvent.pointerLeave(svg)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('ignores touch, where there is no hover', () => {
    render(<ContributionGraph calendar={CONTRIBUTIONS_SAMPLE} username="francisaguilar21" />)
    fireEvent.pointerMove(screen.getByTestId('contribution-heatmap'), {
      clientX: 7,
      clientY: 7,
      pointerType: 'touch',
    })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('leaves out the account link when there is none', () => {
    render(<ContributionGraph calendar={CONTRIBUTIONS_SAMPLE} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})

describe('heatmap geometry', () => {
  const geometry = heatmapGeometry(CONTRIBUTIONS_SAMPLE)

  it('is 53 columns of 14px (11 plus a 3px gap) and 7 rows, without the trailing gap', () => {
    expect(geometry.width).toBe(53 * 14 - 3)
    expect(geometry.height).toBe(7 * 14 - 3)
    expect(geometry.start).toBe('2025-10-12')
  })

  it('draws every day once, in the path of its level', () => {
    const days = CONTRIBUTIONS_SAMPLE.weeks.flat()
    expect(geometry.counts).toEqual(days.map((day) => day.count))
    for (const level of LEVELS) {
      const expected = days.filter((day) => day.level === level).length
      // Each cell starts with one `M`.
      expect(geometry.paths[level].split('M').length - 1).toBe(expected)
    }
  })

  it('finds the cell under a point, and nothing in the gaps or outside', () => {
    const { counts } = geometry
    expect(cellAt(0, 0, counts)).toEqual({ column: 0, row: 0, index: 0 })
    expect(cellAt(10.9, 10.9, counts)).toEqual({ column: 0, row: 0, index: 0 })
    expect(cellAt(11, 5, counts)).toBeNull() // in the gap
    expect(cellAt(5, 11, counts)).toBeNull()
    expect(cellAt(14, 14, counts)).toEqual({ column: 1, row: 1, index: 8 })
    expect(cellAt(-1, 5, counts)).toBeNull()
    expect(cellAt(5, 7 * 14, counts)).toBeNull()
    // The last week is short: Sunday, Monday and Tuesday exist, Wednesday does not.
    const lastWeek = CONTRIBUTIONS_SAMPLE.weeks.length - 1
    expect(cellAt(lastWeek * 14 + 5, 2 * 14 + 5, counts)?.index).toBe(lastWeek * 7 + 2)
    expect(cellAt(lastWeek * 14 + 5, 3 * 14 + 5, counts)).toBeNull()
  })

  it('counts days from the first cell', () => {
    expect(dateAt('2025-10-12', 0)).toBe('2025-10-12')
    expect(dateAt('2025-10-12', 7)).toBe('2025-10-19')
    expect(dateAt('2025-12-28', 5)).toBe('2026-01-02')
    const last = CONTRIBUTIONS_SAMPLE.weeks.flat().at(-1)!
    expect(dateAt(geometry.start, geometry.counts.length - 1)).toBe(last.date)
  })
})
