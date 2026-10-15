import Link from 'next/link'
import { cn } from '@/lib/cn'

const base =
  'font-display inline-flex items-center gap-2.5 rounded-full border font-medium whitespace-nowrap transition-colors duration-[250ms] cursor-pointer'

const variants = {
  solid: 'border-fg bg-fg text-bg hover:border-accent hover:bg-accent hover:text-accent-ink',
  ghost: 'border-line text-fg hover:border-accent hover:text-accent bg-transparent',
}

const sizes = {
  md: 'px-5 py-3 text-[0.9375rem] leading-none',
  sm: 'px-3.5 py-[9px] text-[0.8125rem] leading-none',
}

type ButtonOwnProps = {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  className?: string
  children?: React.ReactNode
}

type ButtonProps = ButtonOwnProps &
  (
    | ({ href: string } & Omit<React.ComponentProps<'a'>, 'href'>)
    | ({ href?: never } & React.ComponentProps<'button'>)
  )

const isExternal = (href: string) => /^(https?:)?\/\//.test(href) || href.startsWith('mailto:')

/**
 * Pill button. Pass `href` to render a link, or leave it out for a `<button>`.
 */
export function Button({
  variant = 'solid',
  size = 'md',
  className,
  children,
  href,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (href !== undefined) {
    const anchorProps = rest as Omit<React.ComponentProps<'a'>, 'href'>
    if (isExternal(href)) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...anchorProps}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    )
  }

  const buttonProps = rest as React.ComponentProps<'button'>
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
