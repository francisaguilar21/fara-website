import { describe, expect, it } from 'vitest'
import { splitHeadline } from '@/lib/home/headline'

const text = (line: { text: string }[]) => line.map((segment) => segment.text).join('')

describe('splitHeadline', () => {
  it('splits the default headline into the three lines of the mockup', () => {
    const lines = splitHeadline('I build software & run long distances.')
    expect(lines.map(text)).toEqual(['I build software', '& run long', 'distances.'])
  })

  it('underlines the last two words, even when they wrap onto two lines', () => {
    const lines = splitHeadline('I build software & run long distances.')
    expect(lines[0]).toEqual([{ text: 'I build software', underline: false }])
    expect(lines[1]).toEqual([
      { text: '& run ', underline: false },
      { text: 'long', underline: true },
    ])
    expect(lines[2]).toEqual([{ text: 'distances.', underline: true }])
  })

  it('keeps underlined words on one line in one segment', () => {
    expect(splitHeadline('Shipping code. Pacing miles.', 40)).toEqual([
      [
        { text: 'Shipping code. ', underline: false },
        { text: 'Pacing miles.', underline: true },
      ],
    ])
  })

  it('never loses words, and handles short or empty input', () => {
    expect(splitHeadline('')).toEqual([])
    expect(splitHeadline('Hello')).toEqual([[{ text: 'Hello', underline: true }]])
    const headline = 'Engineer by trade. Runner by choice.'
    expect(splitHeadline(headline).map(text).join(' ')).toBe(headline)
  })
})
