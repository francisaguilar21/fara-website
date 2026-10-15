/** Route-style section label, for example `/work`. */
export function Eyebrow({ path }: { path: string }) {
  return <span className="font-mono text-sm leading-none font-medium text-accent">{path}</span>
}
