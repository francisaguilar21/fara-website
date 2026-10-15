// Lists every placeholder still on the site and exits 1 if there is any (P5-R2, `pnpm check:drafts`).
// Run it before launch: Phase 8 makes it a CI gate. Until then placeholders are expected, so it is
// not part of CI.
import { findDrafts } from '../lib/home/drafts'

const drafts = findDrafts()

if (drafts.length === 0) {
  console.log('No draft content or sample data left.')
  process.exit(0)
}

const bySource = Map.groupBy(drafts, (draft) => draft.source)
for (const [source, items] of bySource) {
  console.log(`\n${source} (${items.length})`)
  for (const item of items) console.log(`  - ${item.label}`)
}

const samples = bySource.get('sample')?.length ?? 0
console.log(
  `\n${drafts.length - samples} draft entries and ${samples} sample fallbacks to replace.`
)
process.exit(1)
