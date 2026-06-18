import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

const themeOptions = [
  { value: 'light', label: 'ライト', icon: SunIcon },
  { value: 'dark', label: 'ダーク', icon: MoonIcon },
  { value: 'system', label: '自動', icon: MonitorIcon },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      aria-label="テーマ切替"
      className="inline-flex items-center gap-1 rounded-lg border bg-background p-1"
      role="group"
    >
      {themeOptions.map(({ value, label, icon: Icon }) => (
        <Button
          aria-pressed={theme === value}
          className="h-7 px-2 text-xs"
          key={value}
          onClick={() => setTheme(value)}
          size="sm"
          variant={theme === value ? 'secondary' : 'ghost'}
        >
          <Icon
            aria-hidden="true"
            className="size-3.5"
            data-icon="inline-start"
          />
          {label}
        </Button>
      ))}
    </div>
  )
}
