import { DraftChip } from '@/components/ui/DraftChip'
import { Label } from '@/components/ui/Label'
import { UnderlineLink } from '@/components/ui/UnderlineLink'
import type { Certification } from '@/lib/content'

/** Certifications as a ruled list: name, then issuer and year, and a link to verify it. */
export function CertList({ certifications }: { certifications: Certification[] }) {
  if (certifications.length === 0) return null

  return (
    <div>
      <Label as="h3">
        Certifications
        {certifications.some((cert) => cert.draft) ? <DraftChip className="ml-1.5" /> : null}
      </Label>
      <ul className="mt-3 border-t border-line">
        {certifications.map((cert) => (
          <li
            key={`${cert.name}-${cert.year}`}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 border-b border-line py-3.5"
          >
            <span>
              {cert.name}
              {cert.credentialUrl ? (
                <>
                  {' '}
                  <UnderlineLink
                    href={cert.credentialUrl}
                    external
                    className="font-mono text-xs text-muted"
                    aria-label={`Verify ${cert.name}`}
                  >
                    verify ↗
                  </UnderlineLink>
                </>
              ) : null}
            </span>
            <Label>
              {cert.issuer} · {cert.year}
            </Label>
          </li>
        ))}
      </ul>
    </div>
  )
}
