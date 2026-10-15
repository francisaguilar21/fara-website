/**
 * The big year in the left column. It sticks at 40% of the viewport and cross-fades when the
 * active entry changes (the keyed child remounts and fades in). Decorative: every entry already
 * shows its own dates, so assistive tech skips this. Desktop only.
 */
export function TimelineYear({ year, sub }: { year: string; sub: string }) {
  return (
    <div
      aria-hidden="true"
      className="sticky top-[40vh] hidden self-start font-display text-[clamp(3rem,6vw,5rem)] leading-none font-semibold tracking-[-0.04em] min-[821px]:block"
    >
      <div key={`${year}-${sub}`} className="animate-fade-in" data-testid="timeline-year">
        {year}
        <span className="mt-2.5 block label">{sub}</span>
      </div>
    </div>
  )
}
