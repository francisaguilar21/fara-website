import Link from 'next/link'
import { cn } from '@/lib/cn'

type UnderlineLinkProps = {
  href: string
  /** Opens in a new tab with `rel="noopener noreferrer"`. */
  external?: boolean
} & Omit<React.ComponentProps<'a'>, 'href'>

/** Link with a rose underline that grows from 0 to 100% on hover and focus. */
export function UnderlineLink({
  href,
  external,
  className,
  children,
  ...rest
}: UnderlineLinkProps) {
  const classes = cn('underline-grow', className)

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  )
}
