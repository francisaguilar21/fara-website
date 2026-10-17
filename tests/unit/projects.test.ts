// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { getAdjacentProjects, getProjects, toProjectSummary } from '@/lib/content'
import { filterByStack, stackOptions } from '@/lib/projects/stack'

const PROJECTS_DIR = path.join(process.cwd(), 'content/projects')

describe('case studies (P6-R8)', () => {
  const files = readdirSync(PROJECTS_DIR).filter((file) => file.endsWith('.mdx'))

  it('finds the case studies', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it.each(files)('%s follows Problem, Role, What we built, Outcome, Stack', (file) => {
    const source = readFileSync(path.join(PROJECTS_DIR, file), 'utf8')
    const headings = [...source.matchAll(/^## (.+)$/gm)].map((match) => match[1])
    expect(headings).toEqual(['Problem', 'Role', 'What we built', 'Outcome', 'Stack'])
  })
})

describe('getAdjacentProjects', () => {
  const slugs = getProjects().map((project) => project.slug)

  it('returns the project before and after, in list order', () => {
    expect(getAdjacentProjects(slugs[1]!)).toMatchObject({
      previous: { slug: slugs[0] },
      next: { slug: slugs[2] },
    })
  })

  it('has no previous for the first and no next for the last', () => {
    expect(getAdjacentProjects(slugs[0]!).previous).toBeUndefined()
    expect(getAdjacentProjects(slugs.at(-1)!).next).toBeUndefined()
  })

  it('returns nothing for an unknown slug', () => {
    expect(getAdjacentProjects('missing')).toEqual({})
  })
})

describe('toProjectSummary', () => {
  it('leaves out the MDX body', () => {
    const [project] = getProjects()
    expect(project).toBeDefined()
    expect(toProjectSummary(project!)).not.toHaveProperty('body')
  })
})

describe('stack filter (P6-R7)', () => {
  const projects = [
    { stack: ['React', 'TypeScript'] },
    { stack: ['react', 'Next.js'] },
    { stack: ['Go', 'Go'] },
    { stack: [] },
  ]

  it('lists each tag once, most used first, then by name', () => {
    expect(stackOptions(projects)).toEqual([
      { slug: 'react', label: 'React', count: 2 },
      { slug: 'go', label: 'Go', count: 1 },
      { slug: 'next-js', label: 'Next.js', count: 1 },
      { slug: 'typescript', label: 'TypeScript', count: 1 },
    ])
  })

  it('keeps the projects that use the tag, whatever its case', () => {
    expect(filterByStack(projects, 'react')).toEqual([projects[0], projects[1]])
    expect(filterByStack(projects, 'REACT')).toEqual([projects[0], projects[1]])
    expect(filterByStack(projects, 'next-js')).toEqual([projects[1]])
  })

  it('keeps everything without a tag, and nothing for a tag nobody uses', () => {
    expect(filterByStack(projects, '')).toBe(projects)
    expect(filterByStack(projects, null)).toBe(projects)
    expect(filterByStack(projects, 'rust')).toEqual([])
  })
})
