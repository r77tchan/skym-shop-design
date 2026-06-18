import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

const themeOptions = [
  { value: 'light', label: 'ライト', icon: SunIcon },
  { value: 'system', label: '自動', icon: MonitorIcon },
  { value: 'dark', label: 'ダーク', icon: MoonIcon },
] as const

type ThemeToggleProps = {
  activeButtonClassName?: string
  buttonClassName?: string
  className?: string
}

export function ThemeToggle({
  activeButtonClassName,
  buttonClassName,
  className,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div
      aria-label="テーマ切替"
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border bg-background p-1',
        className,
      )}
      role="group"
    >
      {themeOptions.map(({ value, label, icon: Icon }) => (
        <Button
          aria-label={`${label}テーマに切り替え`}
          aria-pressed={theme === value}
          className={cn(
            buttonClassName,
            theme === value && activeButtonClassName,
          )}
          key={value}
          onClick={() => setTheme(value)}
          size="icon-sm"
          title={label}
          variant={theme === value ? 'secondary' : 'ghost'}
        >
          <Icon aria-hidden="true" className="size-3.5" />
        </Button>
      ))}
    </div>
  )
}
