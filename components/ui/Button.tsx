import Link from 'next/link'
import { cloneElement, isValidElement } from 'react'
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
    | ({ href: string; asChild?: never } & Omit<React.ComponentProps<'a'>, 'href'>)
    | ({ asChild: true; href?: never } & React.HTMLAttributes<HTMLElement>)
    | ({ href?: never; asChild?: never } & React.ComponentProps<'button'>)
  )

const isExternal = (href: string) => /^(https?:)?\/\//.test(href) || href.startsWith('mailto:')

/**
 * Pill button. Pass `href` to render a link, `asChild` to style your own element (for example a
 * form submit or a custom link), or neither for a `<button>`.
 */
export function Button({
  variant = 'solid',
  size = 'md',
  className,
  children,
  asChild,
  href,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (asChild && isValidElement<{ className?: string }>(children)) {
    return cloneElement(children, {
      ...rest,
      className: cn(classes, children.props.className),
    } as React.HTMLAttributes<HTMLElement>)
  }

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
