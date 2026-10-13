import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom has no `matchMedia`, which the motion hooks (`lib/motion.ts`) read. Nothing matches, so
// components render as they do for a mouse with no reduced-motion preference. Tests that need
// another answer replace `window.matchMedia` themselves. The `node` environment has no `window`.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList
}

afterEach(() => {
  cleanup()
})
