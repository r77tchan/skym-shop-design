import { Link } from 'react-router'

import { FavoriteToggleButton } from '@/components/favorite-toggle-button'
import { ProductCardCartButton } from '@/components/product-card-cart-button'
import { ProductPrice } from '@/components/product-price'
import { ProductStatusBadge } from '@/components/product-status-badge'
import { assetUrl } from '@/lib/asset-url'
import { getPrimaryProductStatus, isSoldOut } from '@/lib/product-status'
import { getProductStockLabel } from '@/lib/product-stock'
import {
  getProductBrand,
  getProductPath,
  type Product,
} from '@/lib/shop-content'
import {
  interactiveCardLinkClassName,
  interactiveCardMutedTextClassName,
  interactiveCardSurfaceClassName,
  interactiveCardTitleClassName,
} from '@/lib/ui-styles'
import { cn } from '@/lib/utils'

type ProductCardTitleElement = 'h2' | 'h3' | 'p'
type ProductCardVariant = 'grid' | 'rail'

export function ProductCard({
  detailState,
  product,
  titleElement = 'h2',
  variant = 'grid',
}: {
  detailState?: { fromProductList?: boolean }
  product: Product
  titleElement?: ProductCardTitleElement
  variant?: ProductCardVariant
}) {
  if (variant === 'rail') {
    return <ProductRailCard product={product} />
  }

  const soldOut = isSoldOut(product)
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
          <ProductCardMedia
            imageClassName={soldOut && 'opacity-64'}
            product={product}
            showSoldOutOverlay={soldOut}
            surfaceClassName="relative aspect-[3/4] overflow-hidden rounded-lg border bg-muted group-hover:border-primary/40"
          />

          <ProductCardSummary
            product={product}
            titleClassName="mt-1 [display:-webkit-box] min-h-10 overflow-hidden text-sm leading-5 font-semibold [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
            titleElement={titleElement}
          />
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

function ProductRailCard({ product }: { product: Product }) {
  return (
    <Link
      className={cn(
        interactiveCardLinkClassName,
        'grid w-48 shrink-0 gap-3 p-3 sm:w-52',
      )}
      to={getProductPath(product)}
    >
      <ProductCardMedia
        product={product}
        surfaceClassName="relative aspect-[3/4] overflow-hidden rounded-md bg-muted"
      />
      <div className="grid min-w-0 gap-2">
        <ProductCardSummary
          product={product}
          titleClassName="mt-0.5 [display:-webkit-box] min-h-10 overflow-hidden text-sm leading-5 font-medium [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
          titleElement="p"
        />
        <ProductPrice product={product} variant="rail" />
      </div>
    </Link>
  )
}

function ProductCardMedia({
  imageClassName,
  product,
  showSoldOutOverlay = false,
  surfaceClassName,
}: {
  imageClassName?: string | false
  product: Product
  showSoldOutOverlay?: boolean
  surfaceClassName: string
}) {
  const primaryStatus = getPrimaryProductStatus(product)

  return (
    <div className={surfaceClassName}>
      <img
        alt=""
        className={cn('size-full object-cover', imageClassName)}
        src={assetUrl(product.image)}
      />
      {primaryStatus ? (
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <ProductStatusBadge status={primaryStatus} />
        </div>
      ) : null}
      {showSoldOutOverlay ? (
        <div className="absolute inset-x-0 bottom-0 bg-card/88 px-3 py-2 text-center text-xs font-semibold text-muted-foreground">
          SOLD OUT
        </div>
      ) : null}
    </div>
  )
}

function ProductCardSummary({
  product,
  titleClassName,
  titleElement: Title,
}: {
  product: Product
  titleClassName: string
  titleElement: ProductCardTitleElement
}) {
  return (
    <div className="min-w-0">
      <p
        className={cn(
          'truncate text-xs font-medium text-muted-foreground',
          interactiveCardMutedTextClassName,
        )}
      >
        {getProductBrand(product)}
      </p>
      <Title className={cn(titleClassName, interactiveCardTitleClassName)}>
        {product.name}
      </Title>
    </div>
  )
}
