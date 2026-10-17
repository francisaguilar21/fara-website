/**
 * Groups items by the year of their `date` (`YYYY-MM-DD`), newest year first. Inside a year the
 * items keep the order they came in.
 */
export function groupByYear<T extends { date: string }>(
  items: T[]
): { year: string; items: T[] }[] {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const year = item.date.slice(0, 4)
    groups.set(year, [...(groups.get(year) ?? []), item])
  }
  return [...groups]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, grouped]) => ({ year, items: grouped }))
}
