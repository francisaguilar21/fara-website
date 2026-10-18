import { Label } from '@/components/ui/Label'
import { UnderlineLink } from '@/components/ui/UnderlineLink'

/** Where else to find me: the socials, and the email when the site has one. */
export function Socials({
  socials,
  email,
}: {
  socials: { label: string; url: string }[]
  email?: string
}) {
  return (
    <div className="mt-10">
      <Label as="h2">Elsewhere</Label>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-display text-[1.0625rem]">
        {socials.map((social) => (
          <li key={social.url}>
            <UnderlineLink href={social.url} external>
              {social.label} ↗
            </UnderlineLink>
          </li>
        ))}
        {email ? (
          <li>
            <UnderlineLink href={`mailto:${email}`}>{email}</UnderlineLink>
          </li>
        ) : null}
      </ul>
    </div>
  )
}
