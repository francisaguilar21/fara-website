import * as runtime from 'react/jsx-runtime'
import { mdxComponents, type MDXComponents } from './index'

type MDXModule = (props: { components?: MDXComponents }) => React.ReactNode

/**
 * Velite compiles MDX to a function body that expects the JSX runtime. This evaluates it on the
 * server, at render time, from our own build output.
 */
function evaluate(code: string): MDXModule {
  return new Function(code)({ ...runtime }).default
}

export function MDXContent({ code, components }: { code: string; components?: MDXComponents }) {
  return evaluate(code)({ components: { ...mdxComponents, ...components } })
}
