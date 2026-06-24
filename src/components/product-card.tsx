import { Link } from 'react-router'

import { FavoriteToggleButton } from '@/components/favorite-toggle-button'
import { ProductCardCartButton } from '@/components/product-card-cart-button'
import { ProductPrice } from '@/components/product-price'
import { ProductStatusBadge } from '@/components/product-status-badge'
import { assetUrl } from '@/lib/asset-url'
import { getPrimaryProductStatus, isSoldOut } from '@/lib/product-status'
import { getProductStockLabel } from '@/lib/product-stock'
import { getProductPath, type Product } from '@/lib/shop-content'
import {
  interactiveCardMutedTextClassName,
  interactiveCardSurfaceClassName,
  interactiveCardTitleClassName,
} from '@/lib/ui-styles'
import { cn } from '@/lib/utils'

type ProductCardTitleElement = 'h2' | 'h3' | 'p'

export function ProductCard({
  detailState,
  product,
  titleElement: Title = 'h2',
}: {
  detailState?: { fromProductList?: boolean }
  product: Product
  titleElement?: ProductCardTitleElement
}) {
  const soldOut = isSoldOut(product)
  const primaryStatus = getPrimaryProductStatus(product)
  const stockLabel = getProductStockLabel(product)

  return (
    <article className="h-full min-w-0">
      <div
        className={cn(
          interactiveCardSurfaceClassName,
          'flex h-full min-w-0 flex-col gap-3 p-3',
        )}
      >
        <Link
          aria-label={`${product.name}の商品プレビュー`}
          className="grid min-w-0 gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          state={detailState}
          to={getProductPath(product)}
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border bg-muted group-hover:border-primary/40">
            <img
              alt=""
              className={cn('size-full object-cover', soldOut && 'opacity-64')}
              src={assetUrl(product.image)}
            />
            {primaryStatus ? (
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                <ProductStatusBadge status={primaryStatus} />
              </div>
            ) : null}
            {soldOut ? (
              <div className="absolute inset-x-0 bottom-0 bg-card/88 px-3 py-2 text-center text-xs font-semibold text-muted-foreground">
                SOLD OUT
              </div>
            ) : null}
          </div>

          <div className="min-w-0">
            <p
              className={cn(
                'truncate text-xs font-medium text-muted-foreground',
                interactiveCardMutedTextClassName,
              )}
            >
              {product.brand}
            </p>
            <Title
              className={cn(
                'mt-1 [display:-webkit-box] min-h-10 overflow-hidden text-sm leading-5 font-semibold [-webkit-box-orient:vertical] [-webkit-line-clamp:2]',
                interactiveCardTitleClassName,
              )}
            >
              {product.name}
            </Title>
          </div>
        </Link>

        <div className="mt-auto flex min-h-12 min-w-0 items-center justify-between gap-3 sm:min-h-8">
          <div className="min-w-0">
            <ProductPrice
              className="min-w-0"
              muted={soldOut}
              product={product}
            />
            <p className="mt-1 text-[0.68rem] leading-none font-medium text-muted-foreground">
              {stockLabel}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <FavoriteToggleButton product={product} />
            <ProductCardCartButton product={product} />
          </div>
        </div>
      </div>
    </article>
  )
}
