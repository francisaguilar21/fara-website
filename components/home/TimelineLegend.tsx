/** Explains the two kinds of dot on the timeline: work is filled, life is a ring. */
export function TimelineLegend() {
  return (
    <div className="mt-4 flex gap-4.5 label">
      <span className="inline-flex items-center gap-2">
        <i
          aria-hidden="true"
          className="inline-block size-2.5 rounded-full border-2 border-accent bg-accent"
        />
        Work
      </span>
      <span className="inline-flex items-center gap-2">
        <i
          aria-hidden="true"
          className="inline-block size-2.5 rounded-full border-2 border-accent"
        />
        Life
      </span>
    </div>
  )
}
