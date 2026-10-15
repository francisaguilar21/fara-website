import { UnderlineLink } from '@/components/ui/UnderlineLink'

/**
 * MDX `a`. Absolute links open in a new tab with `rel="noopener noreferrer"`, site paths go through
 * the router, and anchors (the heading links) and `mailto:` stay plain.
 */
export function MdxLink({ href = '', children, ...rest }: React.ComponentProps<'a'>) {
  if (href.startsWith('#') || /^(mailto|tel):/.test(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }

  const external = /^(https?:)?\/\//.test(href)
  return (
    <UnderlineLink href={href} external={external} {...rest}>
      {children}
    </UnderlineLink>
  )
}
