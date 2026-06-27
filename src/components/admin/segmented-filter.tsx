import { cn } from '@/lib/utils'

export function SegmentedFilter<TValue extends string>({
  columns = 4,
  label,
  onChange,
  options,
  value,
  variant = 'grid',
}: {
  columns?: 3 | 4
  label: string
  onChange: (value: TValue) => void
  options: ReadonlyArray<{ label: string; value: TValue; count: number }>
  value: TValue
  variant?: 'grid' | 'wrap'
}) {
  const isWrap = variant === 'wrap'

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div
        aria-label={label}
        className={cn(
          'max-w-full rounded-lg border bg-background p-1',
          isWrap
            ? 'flex min-h-11 w-fit flex-wrap'
            : cn(
                'grid h-11 w-full sm:w-fit',
                columns === 3 ? 'grid-cols-3' : 'grid-cols-4',
              ),
        )}
        role="group"
      >
        {options.map((option) => {
          const active = option.value === value

          return (
            <button
              aria-pressed={active ? 'true' : 'false'}
              className={cn(
                'inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap',
                isWrap
                  ? 'h-9 min-w-20 gap-1.5 px-3 text-sm'
                  : 'h-full min-w-0 gap-1 px-1.5 text-xs sm:min-w-20 sm:gap-1.5 sm:px-3 sm:text-sm',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent/55 hover:text-foreground',
              )}
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
            >
              <span className="truncate">{option.label}</span>
              <span
                className={cn(
                  'inline-block shrink-0 text-right text-[0.68rem] tabular-nums',
                  isWrap ? 'w-[3ch]' : 'w-[2ch] sm:w-[3ch]',
                  active
                    ? 'text-primary-foreground/75'
                    : 'text-muted-foreground',
                )}
              >
                {option.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
