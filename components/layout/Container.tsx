import { cn } from '@/lib/cn'

type ContainerProps<T extends React.ElementType> = {
  as?: T
  className?: string
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className'>

/** Centered column: 1240px max, with gutters of `clamp(16px, 4vw, 40px)`. */
export function Container<T extends React.ElementType = 'div'>({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component: React.ElementType = as ?? 'div'
  return (
    <Component
      className={cn('mx-auto w-full max-w-site px-[clamp(16px,4vw,40px)]', className)}
      {...props}
    />
  )
}
