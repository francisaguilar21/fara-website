import { DraftChip } from '@/components/ui/DraftChip'
import { Equalizer } from '@/components/widgets/Equalizer'

export type NowStripItem = {
  /** Mono label in rose: NOW, READING, LISTENING, THIS WEEK, BUILDING. */
  label: string
  text: string
  /** Marks placeholder or sample content with a chip. */
  badge?: 'draft' | 'sample'
  /** Show the equaliser bars before the label (Spotify). */
  playing?: boolean
}

// The items repeat so the track can slide by one copy and loop without a gap (`marquee`
// keyframes move it 25%). Only the first copy is read by assistive tech.
const COPIES = 4

function Items({ items }: { items: NowStripItem[] }) {
  return items.map((item) => (
    <li
      key={item.label}
      className="flex items-center gap-3 px-7 py-3.5 font-mono text-sm leading-none whitespace-nowrap after:ml-7 after:text-xl after:text-line after:content-['/']"
    >
      {item.playing ? <Equalizer /> : null}
      <b className="font-medium text-accent">{item.label}</b>
      <span>{item.text}</span>
      {item.badge ? <DraftChip>{item.badge}</DraftChip> : null}
    </li>
  ))
}

/**
 * The ticker under the hero. It is pure CSS, so it runs without JavaScript: it pauses on hover,
 * and with reduced motion it stops and becomes a static wrapping row (the copies are hidden).
 */
export function NowStrip({ items }: { items: NowStripItem[] }) {
  return (
    <section
      id="now"
      aria-label="What I'm doing now"
      className="group overflow-hidden border-y border-line bg-surface"
    >
      <div className="flex w-max marquee-track motion-reduce:w-auto motion-reduce:flex-wrap">
        <ul className="flex shrink-0 motion-reduce:flex-wrap">
          <Items items={items} />
        </ul>
        {Array.from({ length: COPIES - 1 }, (_, copy) => (
          <ul key={copy} aria-hidden="true" className="flex shrink-0 motion-reduce:hidden">
            <Items items={items} />
          </ul>
        ))}
      </div>
    </section>
  )
}
