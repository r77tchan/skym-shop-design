import { Badge } from '@/components/ui/badge'
import { isOnSale } from '@/lib/product-status'
import {
  getProductDiscountRate,
  getProductPrice,
  getProductRegularPrice,
  type Product,
} from '@/lib/shop-content'
import { cn } from '@/lib/utils'

type ProductPriceVariant = 'card' | 'detail' | 'rail'

const priceClassNames: Record<ProductPriceVariant, string> = {
  card: 'text-base leading-none font-semibold',
  detail: 'text-3xl leading-none font-semibold',
  rail: 'text-sm leading-none font-semibold',
}

const originalPriceClassNames: Record<ProductPriceVariant, string> = {
  card: 'text-xs leading-none font-semibold',
  detail: 'text-2xl leading-none font-semibold',
  rail: 'text-xs leading-none font-semibold',
}

export function ProductPrice({
  className,
  muted = false,
  product,
  variant = 'card',
}: {
  className?: string
  muted?: boolean
  product: Product
  variant?: ProductPriceVariant
}) {
  const priceClassName = cn(
    priceClassNames[variant],
    muted ? 'text-muted-foreground' : 'text-foreground',
  )

  if (!isOnSale(product)) {
    return (
      <p className={cn(priceClassName, className)}>
        {getProductPrice(product)}
      </p>
    )
  }

  const discountRate = getProductDiscountRate(product)

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-1',
        variant === 'detail' && 'items-end gap-x-3 gap-y-2',
        className,
      )}
    >
      <p
        className={cn(
          originalPriceClassNames[variant],
          'text-muted-foreground line-through decoration-muted-foreground/70',
        )}
      >
        {getProductRegularPrice(product)}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <p className={priceClassName}>{getProductPrice(product)}</p>
        {variant === 'detail' && discountRate ? (
          <Badge className="bg-product-sale text-product-sale-foreground">
            {discountRate} OFF
          </Badge>
        ) : null}
      </div>
    </div>
  )
}
