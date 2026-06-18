import { createContext } from 'react'

export type Theme = 'dark' | 'light' | 'system'

export type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export function isTheme(value: string | null): value is Theme {
  return value === 'dark' || value === 'light' || value === 'system'
}

export const ThemeProviderContext = createContext<
  ThemeProviderState | undefined
>(undefined)
