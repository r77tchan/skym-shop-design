import { HeartIcon, ShoppingCartIcon, Trash2Icon, XIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Dialog } from 'radix-ui'

import { ProductPrice } from '@/components/product-price'
import { ProductStatusBadge } from '@/components/product-status-badge'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { useFavorites } from '@/hooks/use-favorites'
import { assetUrl } from '@/lib/asset-url'
import { getPrimaryProductStatus, isSoldOut } from '@/lib/product-status'
import { getProductPath, type Product } from '@/lib/shop-content'
import { cn } from '@/lib/utils'

type FavoritesDrawerProps = {
  buttonClassName?: string
}

export function FavoritesDrawer({ buttonClassName }: FavoritesDrawerProps) {
  const { favoriteProducts, removeFavorite } = useFavorites()
  const favoriteCount = favoriteProducts.length

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          aria-label={
            favoriteCount > 0 ? `お気に入り ${favoriteCount}件` : 'お気に入り'
          }
          className={cn('relative', buttonClassName)}
          size="icon-sm"
          title="お気に入り"
          variant="ghost"
        >
          <HeartIcon
            aria-hidden="true"
            className={cn('size-3.5', favoriteCount > 0 && 'fill-current')}
          />
          {favoriteCount > 0 ? (
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full border border-border bg-secondary text-[0.62rem] leading-none font-semibold text-secondary-foreground shadow-sm"
            >
              {favoriteCount}
            </span>
          ) : null}
          <span className="sr-only">お気に入り</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/45" />
        <Dialog.Content className="cart-drawer-panel fixed inset-y-0 right-0 z-[80] flex flex-col border-l bg-background shadow-2xl outline-none">
          <div className="flex items-start justify-between gap-4 border-b px-4 py-4 sm:px-5">
            <div>
              <Dialog.Title className="font-heading text-xl font-semibold">
                お気に入り
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                保存した商品を確認します。
              </Dialog.Description>
              <p className="mt-1 text-xs text-muted-foreground">
                {favoriteCount > 0
                  ? `${favoriteCount}件の商品を保存中`
                  : '保存した商品はありません'}
              </p>
            </div>

            <Dialog.Close asChild>
              <Button aria-label="閉じる" size="icon" variant="ghost">
                <XIcon aria-hidden="true" className="size-4" />
              </Button>
            </Dialog.Close>
          </div>

          {favoriteProducts.length > 0 ? (
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2 sm:px-5">
              <ul className="divide-y">
                {favoriteProducts.map((product) => (
                  <FavoriteProductItem
                    key={product.id}
                    onRemove={removeFavorite}
                    product={product}
                  />
                ))}
              </ul>
            </div>
          ) : (
            <div className="grid flex-1 place-items-center px-6 text-center">
              <div className="max-w-72">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <HeartIcon aria-hidden="true" className="size-5" />
                </div>
                <p className="mt-4 text-base font-semibold">
                  お気に入りはありません
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  気になる商品を保存しておくと、あとからまとめて確認できます。
                </p>
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

function FavoriteProductItem({
  onRemove,
  product,
}: {
  onRemove: (productId: number) => void
  product: Product
}) {
  const productPath = getProductPath(product)
  const primaryStatus = getPrimaryProductStatus(product)
  const soldOut = isSoldOut(product)
  const { addItem, getAvailableQuantity } = useCart()
  const canAddToCart = !soldOut && getAvailableQuantity(product.id) > 0

  return (
    <li className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-3 py-4">
      <Dialog.Close asChild>
        <Link
          aria-label={`${product.name}の商品詳細を見る`}
          className="relative overflow-hidden rounded-lg border bg-muted"
          to={productPath}
        >
          <img
            alt=""
            className={cn(
              'aspect-[3/4] size-full object-cover',
              soldOut && 'opacity-64',
            )}
            src={assetUrl(product.image)}
          />
          {primaryStatus ? (
            <span className="absolute top-1.5 left-1.5">
              <ProductStatusBadge status={primaryStatus} />
            </span>
          ) : null}
        </Link>
      </Dialog.Close>

      <div className="grid min-w-0 content-start gap-3">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs font-medium text-muted-foreground">
              {product.brand}
            </p>
            <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[0.68rem] leading-4 font-medium text-muted-foreground">
              {product.category}
            </span>
          </div>
          <Dialog.Close asChild>
            <Link
              className="mt-1 [display:-webkit-box] overflow-hidden text-sm leading-5 font-semibold [-webkit-box-orient:vertical] [-webkit-line-clamp:2] hover:text-primary"
              to={productPath}
            >
              {product.name}
            </Link>
          </Dialog.Close>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
            {product.summary}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <ProductPrice muted={soldOut} product={product} variant="rail" />

          <div className="flex items-center gap-1">
            <Button
              aria-label={`${product.name}をカートに追加`}
              className={cn(
                'size-8',
                !canAddToCart &&
                  'disabled:pointer-events-auto disabled:cursor-not-allowed disabled:hover:bg-secondary',
                canAddToCart &&
                  'bg-card/92 text-foreground shadow-sm hover:border-primary/55 hover:bg-primary hover:text-primary-foreground',
              )}
              disabled={!canAddToCart}
              onClick={() => addItem(product.id)}
              size="icon"
              title={canAddToCart ? 'カートに追加' : '在庫上限に達しています'}
              type="button"
              variant={canAddToCart ? 'outline' : 'secondary'}
            >
              <ShoppingCartIcon aria-hidden="true" className="size-4" />
            </Button>
            <Button
              aria-label={`${product.name}をお気に入りから削除`}
              className="size-8 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(product.id)}
              size="icon"
              title="お気に入りから削除"
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
