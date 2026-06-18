import { useEffect, useMemo, useState, type ReactNode } from 'react'

import {
  isTheme,
  ThemeProviderContext,
  type Theme,
  type ThemeProviderState,
} from '@/lib/theme-context'

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'skym-shop-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey)

    return isTheme(storedTheme) ? storedTheme : defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = useMemo<ThemeProviderState>(
    () => ({
      theme,
      setTheme: (theme) => {
        localStorage.setItem(storageKey, theme)
        setThemeState(theme)
      },
    }),
    [storageKey, theme],
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
