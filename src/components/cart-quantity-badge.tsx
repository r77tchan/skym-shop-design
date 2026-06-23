import { cn } from '@/lib/utils'

export function CartQuantityBadge({
  className,
  quantity,
}: {
  className?: string
  quantity: number
}) {
  if (quantity <= 0) {
    return null
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-primary/25 bg-card px-1 text-[0.62rem] leading-none font-semibold text-primary shadow-xs',
        className,
      )}
    >
      {formatCartQuantity(quantity)}
    </span>
  )
}

function formatCartQuantity(quantity: number) {
  return quantity > 99 ? '99+' : String(quantity)
}
