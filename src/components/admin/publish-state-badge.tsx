import { CircleCheckIcon, EyeOffIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export function PublishStateBadge({ isPublished }: { isPublished: boolean }) {
  const Icon = isPublished ? CircleCheckIcon : EyeOffIcon

  return (
    <span
      className={cn(
        'inline-flex h-7 min-w-20 items-center justify-center gap-1.5 rounded-full border px-2 text-xs font-semibold',
        isPublished
          ? 'border-primary/40 bg-primary/15 text-primary'
          : 'border-muted-foreground/35 bg-muted-foreground/15 text-foreground',
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {isPublished ? '公開' : '非公開'}
    </span>
  )
}
