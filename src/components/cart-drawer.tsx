import {
  CreditCardIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react'
import { Link } from 'react-router'
import { Dialog } from 'radix-ui'

import { ProductPrice } from '@/components/product-price'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { assetUrl } from '@/lib/asset-url'
import type { CartLine } from '@/lib/cart-context'
import { getProductStock } from '@/lib/product-stock'
import { getProductPath, type Product } from '@/lib/shop-content'
import { cn } from '@/lib/utils'

type CartDrawerProps = {
  buttonClassName?: string
}

export function CartDrawer({ buttonClassName }: CartDrawerProps) {
  const { cartLines, itemCount, removeItem, subtotal, updateQuantity } =
    useCart()

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          aria-label={itemCount > 0 ? `カート ${itemCount}点` : 'カート'}
          className={cn('relative', buttonClassName)}
          size="icon-sm"
          title="カート"
          variant="ghost"
        >
          <ShoppingCartIcon aria-hidden="true" className="size-3.5" />
          {itemCount > 0 ? (
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-product-sale text-[0.62rem] leading-none font-semibold text-product-sale-foreground"
            >
              {itemCount}
            </span>
          ) : null}
          <span className="sr-only">カート</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/45" />
        <Dialog.Content className="cart-drawer-panel fixed inset-y-0 right-0 z-[80] flex flex-col border-l bg-background shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4 border-b px-4 py-4 sm:px-5">
            <div>
              <Dialog.Title className="font-heading text-xl font-semibold">
                カート
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                カートに入っている商品を確認します。
              </Dialog.Description>
              <p className="mt-1 text-xs text-muted-foreground">
                {itemCount > 0 ? `${itemCount}点の商品` : '商品はありません'}
              </p>
            </div>

            <Dialog.Close asChild>
              <Button aria-label="閉じる" size="icon" variant="ghost">
                <XIcon aria-hidden="true" className="size-4" />
              </Button>
            </Dialog.Close>
          </div>

          {cartLines.length > 0 ? (
            <>
              <div className="border-b bg-card px-4 py-4 sm:px-5">
                <dl className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">商品小計</dt>
                    <dd className="font-semibold">{formatYen(subtotal)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">送料</dt>
                    <dd className="text-xs font-medium text-muted-foreground">
                      決済時に選択
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  表示価格には消費税が含まれています。別途送料を決済時に選択します。決済には外部サービスのStripeを使用しています。
                </p>
                <Button className="mt-4 h-12 w-full text-base" type="button">
                  <CreditCardIcon data-icon="inline-start" />
                  決済画面へ
                </Button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2 sm:px-5">
                <ul className="divide-y">
                  {cartLines.map((line) => (
                    <CartLineItem
                      key={line.product.id}
                      line={line}
                      onRemove={removeItem}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="grid flex-1 place-items-center px-6 text-center">
              <div className="max-w-64">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <ShoppingCartIcon aria-hidden="true" className="size-5" />
                </div>
                <p className="mt-4 text-base font-semibold">カートは空です</p>
                <Dialog.Close asChild>
                  <Button asChild className="mt-5 h-10 px-4">
                    <Link to="/items">商品を見る</Link>
                  </Button>
                </Dialog.Close>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function CartLineItem({
  line,
  onRemove,
  onUpdateQuantity,
}: {
  line: CartLine
  onRemove: (productId: number) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
}) {
  const { product, quantity } = line
  const productPath = getProductPath(product)
  const lineTotal = getProductPriceNumber(product) * quantity
  const stock = getProductStock(product)

  return (
    <li className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-3 py-4">
      <Dialog.Close asChild>
        <Link
          aria-label={`${product.name}の商品詳細を見る`}
          className="overflow-hidden rounded-lg border bg-muted"
          to={productPath}
        >
          <img
            alt=""
            className="aspect-[3/4] size-full object-cover"
            src={assetUrl(product.image)}
          />
        </Link>
      </Dialog.Close>

      <div className="grid min-w-0 content-start gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">
            {product.brand}
          </p>
          <Dialog.Close asChild>
            <Link
              className="mt-1 [display:-webkit-box] overflow-hidden text-sm leading-5 font-semibold [-webkit-box-orient:vertical] [-webkit-line-clamp:2] hover:text-primary"
              to={productPath}
            >
              {product.name}
            </Link>
          </Dialog.Close>
          <ProductPrice className="mt-2" product={product} variant="rail" />
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="flex items-center rounded-lg border bg-background">
            <Button
              aria-label={`${product.name}の数量を減らす`}
              className="size-8 rounded-r-none border-0"
              disabled={quantity <= 1}
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <MinusIcon aria-hidden="true" className="size-3.5" />
            </Button>
            <span className="min-w-7 text-center text-sm font-semibold">
              {quantity}
            </span>
            <Button
              aria-label={`${product.name}の数量を増やす`}
              className="size-8 rounded-l-none border-0"
              disabled={quantity >= stock}
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <PlusIcon aria-hidden="true" className="size-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{formatYen(lineTotal)}</p>
            <Button
              aria-label={`${product.name}を削除`}
              className="size-8 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(product.id)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Trash2Icon aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}

function getProductPriceNumber(product: Product) {
  return Number(product.price.replace(/[^\d]/g, ''))
}

function formatYen(value: number) {
  return `¥${value.toLocaleString('ja-JP')}`
}
