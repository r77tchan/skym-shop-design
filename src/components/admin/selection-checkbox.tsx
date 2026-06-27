import { CheckIcon } from 'lucide-react'

export function SelectionCheckbox({
  ariaLabel,
  checked,
  onCheckedChange,
}: {
  ariaLabel: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label className="grid size-8 cursor-pointer place-items-center rounded-md hover:bg-accent/55">
      <input
        aria-label={ariaLabel}
        checked={checked}
        className="peer sr-only"
        onChange={(event) => onCheckedChange(event.currentTarget.checked)}
        type="checkbox"
      />
      <span className="grid size-5 place-items-center rounded border border-input bg-background text-transparent peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
        <CheckIcon aria-hidden="true" className="size-3.5" />
      </span>
    </label>
  )
}
