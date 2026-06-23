import { HeartIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useFavorites } from '@/hooks/use-favorites'
import type { Product } from '@/lib/shop-content'
import { cn } from '@/lib/utils'

export function FavoriteToggleButton({
  className,
  product,
}: {
  className?: string
  product: Product
}) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(product.id)
  const label = favorite
    ? `${product.name}をお気に入りから削除`
    : `${product.name}をお気に入りに追加`

  return (
    <Button
      aria-label={label}
      aria-pressed={favorite}
      className={cn(
        'size-8 shrink-0 bg-card/92 text-foreground shadow-sm backdrop-blur hover:border-favorite/55 hover:bg-favorite/10 hover:text-favorite',
        favorite &&
          'border-favorite/35 bg-favorite/12 text-favorite hover:bg-favorite/16 hover:text-favorite',
        className,
      )}
      onClick={() => toggleFavorite(product.id)}
      size="icon"
      title={favorite ? 'お気に入りから削除' : 'お気に入りに追加'}
      type="button"
      variant="outline"
    >
      <HeartIcon
        aria-hidden="true"
        className={cn('size-4', favorite && 'fill-current')}
      />
    </Button>
  )
}
