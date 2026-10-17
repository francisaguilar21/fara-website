export type TocEntry = { title: string; url: string; items?: TocEntry[] }

function Entries({ entries }: { entries: TocEntry[] }) {
  return (
    <ol className="grid gap-2.5">
      {entries.map((entry) => (
        <li key={entry.url}>
          <a href={entry.url} className="text-muted transition-colors hover:text-accent">
            {entry.title}
          </a>
          {entry.items?.length ? (
            <div className="mt-2.5 pl-4">
              <Entries entries={entry.items} />
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

/** "On this page": links to the headings of a long page. Hidden under 1024px, where the page is one short column. */
export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  if (entries.length === 0) return null

  return (
    <nav
      aria-label="On this page"
      className="sticky top-28 hidden self-start text-sm min-[1024px]:block"
    >
      <p className="mb-4 label">On this page</p>
      <Entries entries={entries} />
    </nav>
  )
}
