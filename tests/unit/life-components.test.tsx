import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BuildingTile } from '@/components/home/BuildingTile'
import { CommunityTile } from '@/components/home/CommunityTile'
import { ProjectRow } from '@/components/home/ProjectRow'
import { RunningTile } from '@/components/home/RunningTile'
import { NowPlaying } from '@/components/widgets/NowPlaying'
import type { Project, Talk } from '@/lib/content'
import { NOW_PLAYING_SAMPLE, STRAVA_SAMPLE } from '@/lib/integrations/fallbacks'

const project = {
  slug: 'fitscovery',
  title: 'Fitscovery',
  year: 2019,
  role: 'Co-founder and CTO',
  summary: 'A platform for discovering fitness events.',
  stack: ['TypeScript', 'AWS'],
  links: {},
  featured: true,
  order: 1,
  draft: false,
} as Project

describe('ProjectRow', () => {
  it('links to the case study and shows year, title, role and stack, and the summary', () => {
    render(
      <ul>
        <ProjectRow project={project} />
      </ul>
    )
    const link = screen.getByRole('link', { name: /Fitscovery/ })
    expect(link).toHaveAttribute('href', '/projects/fitscovery')
    expect(link).toHaveAttribute('data-cursor', 'View')
    expect(screen.getByText('2019')).toBeInTheDocument()
    expect(screen.getByText('Co-founder and CTO · TypeScript · AWS')).toBeInTheDocument()
    expect(screen.getByText('A platform for discovering fitness events.')).toBeInTheDocument()
  })

  it('prefers the outcome to the summary, and adds the metric', () => {
    render(
      <ul>
        <ProjectRow project={{ ...project, outcome: 'Cut onboarding to a day.', metric: '5x' }} />
      </ul>
    )
    expect(screen.getByText(/Cut onboarding to a day\./)).toBeInTheDocument()
    expect(screen.getByText(/5x/)).toBeInTheDocument()
    expect(screen.queryByText(/platform for discovering/)).not.toBeInTheDocument()
  })

  it('only hands rows with a cover to the cursor preview', () => {
    const { rerender } = render(
      <ul>
        <ProjectRow project={project} />
      </ul>
    )
    expect(screen.getByRole('link')).not.toHaveAttribute('data-peek')
    rerender(
      <ul>
        <ProjectRow project={{ ...project, cover: '/static/images/gallery/rings.webp' }} />
      </ul>
    )
    expect(screen.getByRole('link')).toHaveAttribute('data-peek', 'fitscovery')
  })

  it('shows a draft chip for placeholders only', () => {
    const { rerender } = render(
      <ul>
        <ProjectRow project={{ ...project, draft: true }} />
      </ul>
    )
    expect(screen.getByText('draft')).toBeInTheDocument()
    rerender(
      <ul>
        <ProjectRow project={project} />
      </ul>
    )
    expect(screen.queryByText('draft')).not.toBeInTheDocument()
  })
})

describe('RunningTile', () => {
  it('shows the three stats, the chart with its text alternative, and the last run', () => {
    render(<RunningTile strava={STRAVA_SAMPLE} />)
    expect(screen.getByText('This week').previousElementSibling).toHaveTextContent('41.2km')
    expect(screen.getByText('Year to date').previousElementSibling).toHaveTextContent('1,284km')
    expect(screen.getByText('Avg pace').previousElementSibling).toHaveTextContent('5:42/km')
    expect(
      screen.getByRole('img', { name: /last 12 weeks.*This week: 41.2 km/ })
    ).toBeInTheDocument()
    expect(screen.getByText('Sun 06:10')).toBeInTheDocument()
    expect(screen.getByText('152 bpm')).toBeInTheDocument()
    expect(screen.getByText('sample')).toBeInTheDocument()
  })

  it('drops the sample chip for live data, and the last run when there is none', () => {
    render(<RunningTile strava={{ ...STRAVA_SAMPLE, isSample: false, lastRun: undefined }} />)
    expect(screen.queryByText('sample')).not.toBeInTheDocument()
    expect(screen.queryByText('Last run')).not.toBeInTheDocument()
  })
})

const talks: Talk[] = [
  { title: 'Talk A', event: 'Event A', date: '2026-01-01', draft: true },
  { title: 'Talk B', event: 'Event B', date: '2025-06-01' },
]

describe('CommunityTile', () => {
  it('lists the talks with their year, marks drafts, and shows the Spotify card', () => {
    render(<CommunityTile talks={talks} track={NOW_PLAYING_SAMPLE} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(within(items[0]!).getByText('2026')).toBeInTheDocument()
    expect(within(items[0]!).getByText('draft')).toBeInTheDocument()
    expect(within(items[1]!).getByText('2025')).toBeInTheDocument()
    expect(within(items[1]!).queryByText('draft')).not.toBeInTheDocument()
    expect(screen.getByText('Running Up That Hill')).toBeInTheDocument()
  })
})

describe('NowPlaying', () => {
  it('says "Now playing" with the equaliser while a track plays, and flags a sample', () => {
    render(<NowPlaying track={NOW_PLAYING_SAMPLE} />)
    expect(screen.getByText('Now playing')).toBeInTheDocument()
    expect(screen.getByTestId('equalizer')).toBeInTheDocument()
    expect(screen.getByText('sample')).toBeInTheDocument()
    expect(screen.getByText('Kate Bush')).toBeInTheDocument()
  })

  it('says "Last played" and has no equaliser when idle', () => {
    render(<NowPlaying track={{ ...NOW_PLAYING_SAMPLE, isPlaying: false, isSample: false }} />)
    expect(screen.getByText('Last played')).toBeInTheDocument()
    expect(screen.queryByTestId('equalizer')).not.toBeInTheDocument()
    expect(screen.queryByText('sample')).not.toBeInTheDocument()
  })

  it('links to the track when it has a URL', () => {
    render(
      <NowPlaying track={{ ...NOW_PLAYING_SAMPLE, url: 'https://open.spotify.com/track/1' }} />
    )
    const link = screen.getByRole('link', { name: 'Running Up That Hill by Kate Bush on Spotify' })
    expect(link).toHaveAttribute('href', 'https://open.spotify.com/track/1')
    expect(link).toHaveAttribute('target', '_blank')
  })
})

describe('BuildingTile', () => {
  const page = { quote: 'Shipping is *a team sport*.', teaser: 'The founder story.', draft: true }

  it('shows the quote with the starred words emphasized, the teaser and the link', () => {
    const { container } = render(<BuildingTile page={page} />)
    expect(container.querySelector('blockquote')).toHaveTextContent('Shipping is a team sport.')
    expect(container.querySelector('blockquote em')).toHaveTextContent('a team sport')
    expect(screen.getByText('The founder story.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Read the story/ })).toHaveAttribute(
      'href',
      '/life/building'
    )
  })

  it('is marked draft until the story exists', () => {
    const { rerender } = render(<BuildingTile page={page} />)
    expect(screen.getByText('copy')).toBeInTheDocument()
    rerender(<BuildingTile page={{ ...page, draft: false }} />)
    expect(screen.queryByText('copy')).not.toBeInTheDocument()
  })
})
