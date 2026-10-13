export type HeadlineSegment = { text: string; underline: boolean }
export type HeadlineLine = HeadlineSegment[]

/** How many words at the end of the headline get the rose underline ("long distances."). */
const UNDERLINED_WORDS = 2

/**
 * Breaks the hero headline into lines that rise in one after the other, and marks the last phrase
 * for the rose underline. Lines are filled greedily up to `maxLine` characters, which turns
 * "I build software & run long distances." into three lines, as in the mockup.
 *
 * Each line is a list of segments: plain text, then (on the lines that hold it) the underlined
 * phrase. The space between the two stays in the plain segment, so the underline never runs
 * under a space.
 */
export function splitHeadline(headline: string, maxLine = 16): HeadlineLine[] {
  const words = headline.split(/\s+/).filter(Boolean)
  const firstUnderlined = words.length - UNDERLINED_WORDS

  const rows: { plain: string[]; underlined: string[] }[] = []
  let length = 0
  words.forEach((word, index) => {
    const row = rows[rows.length - 1]
    if (row && length + 1 + word.length <= maxLine) {
      length += 1 + word.length
      pushWord(row, word, index >= firstUnderlined)
    } else {
      length = word.length
      const next = { plain: [], underlined: [] }
      rows.push(next)
      pushWord(next, word, index >= firstUnderlined)
    }
  })

  return rows.map(({ plain, underlined }) => {
    const line: HeadlineLine = []
    if (plain.length) {
      line.push({ text: plain.join(' ') + (underlined.length ? ' ' : ''), underline: false })
    }
    if (underlined.length) line.push({ text: underlined.join(' '), underline: true })
    return line
  })
}

function pushWord(
  row: { plain: string[]; underlined: string[] },
  word: string,
  underline: boolean
) {
  ;(underline ? row.underlined : row.plain).push(word)
}
