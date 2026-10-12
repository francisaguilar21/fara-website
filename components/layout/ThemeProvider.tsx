'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

// Dark by default, whatever the OS prefers. The choice is stored by next-themes and applied by an
// inline script before first paint, so there is no flash of the wrong theme.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
