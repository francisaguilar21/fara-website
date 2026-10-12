/** First focusable element on the page. Jumps past the header to `#main`. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-[100] rounded-full bg-accent px-4 py-2 font-display text-sm font-medium text-accent-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
    >
      Skip to content
    </a>
  )
}
