import { cn } from '@/lib/cn'

type LabelProps<T extends React.ElementType> = {
  as?: T
  className?: string
  children?: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>

/** Mono uppercase label (the `.label` type style). Renders a `<span>` unless told otherwise. */
export function Label<T extends React.ElementType = 'span'>({
  as,
  className,
  ...props
}: LabelProps<T>) {
  const Component: React.ElementType = as ?? 'span'
  return <Component className={cn('label', className)} {...props} />
}
