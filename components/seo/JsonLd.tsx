/**
 * A `<script type="application/ld+json">` for structured data (P6-R5, P6-R6). `JSON.stringify`
 * does not escape `<`, so a string holding `</script>` would end the tag early; it is written as
 * `<` instead, which JSON parsers read as the same character.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
