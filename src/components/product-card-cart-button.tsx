import { ShoppingCartIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { isSoldOut } from '@/lib/product-status'
import type { Product } from '@/lib/shop-content'
import { cn } from '@/lib/utils'

export function ProductCardCartButton({ product }: { product: Product }) {
  const soldOut = isSoldOut(product)
  const { addItem, getAvailableQuantity, getCartQuantity } = useCart()
  const cartQuantity = getCartQuantity(product.id)
  const canAddToCart = !soldOut && getAvailableQuantity(product.id) > 0
  const isInCart = cartQuantity > 0
  const label = getCartButtonLabel(product.name, cartQuantity, canAddToCart)

  return (
    <Button
      aria-label={label}
      className={cn(
        'relative size-8 shrink-0',
        !canAddToCart &&
          'disabled:pointer-events-auto disabled:cursor-not-allowed',
        isInCart
          ? 'border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary/85 disabled:bg-primary disabled:text-primary-foreground disabled:opacity-100 disabled:hover:bg-primary'
          : canAddToCart
            ? 'bg-card/92 text-foreground shadow-sm backdrop-blur hover:border-primary/55 hover:bg-primary hover:text-primary-foreground'
            : 'disabled:hover:bg-secondary',
      )}
      disabled={!canAddToCart}
      onClick={() => addItem(product.id)}
      size="icon"
      title={label}
      type="button"
      variant={isInCart ? 'default' : canAddToCart ? 'outline' : 'secondary'}
    >
      <ShoppingCartIcon aria-hidden="true" className="size-4" />
      {isInCart ? (
        <span className="pointer-events-none absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-primary/25 bg-card px-1 text-[0.62rem] leading-none font-semibold text-primary shadow-xs">
          {formatCartQuantity(cartQuantity)}
        </span>
      ) : null}
    </Button>
  )
}

function getCartButtonLabel(
  productName: string,
  cartQuantity: number,
  canAddToCart: boolean,
) {
  if (cartQuantity > 0) {
    return canAddToCart
      ? `${productName}はカートに${cartQuantity}点入っています。さらに追加`
      : `${productName}はカートに${cartQuantity}点入っています。在庫上限に達しています`
  }

  return canAddToCart
    ? `${productName}をカートに追加`
    : `${productName}は在庫上限に達しています`
}

function formatCartQuantity(quantity: number) {
  return quantity > 99 ? '99+' : String(quantity)
}
