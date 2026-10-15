import { Callout } from './Callout'
import { Figure } from './Figure'
import { MdxLink } from './MdxLink'

export type MDXComponents = Record<string, React.ElementType>

/** `pre` keeps long lines scrollable inside the column. Colors come from `app/globals.css`. */
function Pre(props: React.ComponentProps<'pre'>) {
  return <pre {...props} className="overflow-x-auto" />
}

/** Wide tables scroll inside their own container instead of the page. */
function Table(props: React.ComponentProps<'table'>) {
  return (
    <div className="my-8 overflow-x-auto">
      <table {...props} className="my-0" />
    </div>
  )
}

/** The element overrides and extra components available in every MDX file. */
export const mdxComponents: MDXComponents = {
  img: Figure,
  a: MdxLink,
  pre: Pre,
  table: Table,
  Callout,
}
