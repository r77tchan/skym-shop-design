import { ImageOffIcon } from 'lucide-react'

import { assetUrl } from '@/lib/asset-url'
import { cn } from '@/lib/utils'

export function NewsImage({
  alt,
  className,
  src,
}: {
  alt: string
  className?: string
  src: string | null
}) {
  return (
    <span
      className={cn(
        'grid place-items-center overflow-hidden bg-muted text-muted-foreground',
        className,
      )}
    >
      {src ? (
        <img alt={alt} className="size-full object-cover" src={assetUrl(src)} />
      ) : (
        <ImageOffIcon aria-hidden="true" className="size-8" />
      )}
    </span>
  )
}
