import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function BulkEditField({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  return (
    <div className="grid min-w-0 gap-2 lg:grid-cols-[112px_minmax(0,1fr)] lg:items-start">
      <p className="pt-2 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export function BulkEditSegmentedControl<TValue extends string>({
  onChange,
  options,
  value,
  variant = 'grid',
}: {
  onChange: (value: TValue) => void
  options: ReadonlyArray<{ label: string; value: TValue }>
  value: TValue
  variant?: 'grid' | 'wrap'
}) {
  const isWrap = variant === 'wrap'

  return (
    <div
      className={cn(
        'max-w-full rounded-lg border bg-background',
        isWrap
          ? 'flex w-fit flex-wrap p-0.5'
          : 'grid w-full grid-cols-2 gap-1 p-1 sm:flex sm:w-fit',
      )}
    >
      {options.map((option) => {
        const active = option.value === value

        return (
          <button
            aria-pressed={active ? 'true' : 'false'}
            className={cn(
              'inline-flex h-8 items-center justify-center rounded-md px-2 text-xs font-medium whitespace-nowrap',
              isWrap ? 'min-w-20' : 'min-w-0 sm:min-w-20',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
