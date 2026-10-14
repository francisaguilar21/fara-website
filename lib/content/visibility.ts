/**
 * Whether draft content is hidden from the site (P4-R3). Drafts are placeholders waiting for the
 * real thing, so production never shows them. Previews and local runs do, with a `<DraftChip />`,
 * so the layout can still be reviewed.
 *
 * Hidden when `VERCEL_ENV` is `production`, or when `HIDE_DRAFTS=1` (to try the production
 * behavior on a preview or locally). It reads the environment at call time, so tests can stub it.
 * `pnpm check:drafts` ignores it and always lists every draft.
 */
export function shouldHideDrafts(): boolean {
  return process.env.VERCEL_ENV === 'production' || process.env.HIDE_DRAFTS === '1'
}
