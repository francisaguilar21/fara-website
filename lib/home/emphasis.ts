export type EmphasisPart = { text: string; emphasis: boolean }

/**
 * Splits `text` on `*asterisks*`: the words between a pair are emphasized (set in rose on the
 * page). An unpaired asterisk is kept as plain text.
 */
export function splitEmphasis(text: string): EmphasisPart[] {
  const parts: EmphasisPart[] = []
  const pattern = /\*([^*]+)\*/g
  let last = 0
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index), emphasis: false })
    parts.push({ text: match[1]!, emphasis: true })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last), emphasis: false })
  return parts
}
