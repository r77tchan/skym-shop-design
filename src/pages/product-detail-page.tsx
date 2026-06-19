import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  PackageCheckIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  TruckIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'

import { ProductStatusBadge } from '@/components/product-status-badge'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assetUrl } from '@/lib/asset-url'
import { getProductPath, products, type Product } from '@/lib/shop-content'
import {
  interactiveCardLinkClassName,
  interactiveCardMutedTextClassName,
  interactiveCardTitleClassName,
} from '@/lib/ui-styles'
import { cn } from '@/lib/utils'

const deliveryOptions = [
  { name: 'クリックポスト', price: '¥185', note: '小型ルアー向け' },
  { name: '宅急便コンパクト', price: '¥600', note: '追跡対応' },
  { name: 'レターパックプラス', price: '¥600', note: '厚みのある商品向け' },
]

const serviceNotes = [
  {
    icon: PackageCheckIcon,
    title: '丁寧な梱包',
    text: '小型ルアーも緩衝材と厚紙で保護して発送します。',
  },
  {
    icon: TruckIcon,
    title: '配送方法を選択',
    text: '商品サイズに合わせて購入時に配送方法を選べます。',
  },
  {
    icon: ShieldCheckIcon,
    title: '税込表示',
    text: '表示価格には消費税が含まれています。',
  },
]

export function ProductDetailPage() {
  const { productId } = useParams()
  const product = products.find((item) => item.id === productId)

  if (!product) {
    return <Navigate replace to="/items" />
  }

  const soldOut = product.status === 'SOLD OUT'
  const relatedProducts = getRelatedProducts(product)

  return (
    <main className="min-h-svh bg-background text-foreground">
      <SiteHeader />

      <article>
        <section className="border-b bg-muted/35 pt-20">
          <div className="mx-auto grid max-w-7xl gap-3 px-gutter py-5 sm:gap-5 sm:py-10">
            <nav
              aria-label="パンくず"
              className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground"
            >
              <Link
                className="underline decoration-foreground/35 underline-offset-4 hover:text-foreground hover:decoration-foreground"
                to="/"
              >
                トップ
              </Link>
              <span aria-hidden="true" className="text-border">
                /
              </span>
              <Link
                className="underline decoration-foreground/35 underline-offset-4 hover:text-foreground hover:decoration-foreground"
                to="/items"
              >
                商品一覧
              </Link>
              <span aria-hidden="true" className="text-border">
                /
              </span>
              <span className="text-foreground">商品詳細</span>
            </nav>

            <Button asChild className="w-fit px-3" size="sm" variant="ghost">
              <Link to="/items">
                <ArrowLeftIcon data-icon="inline-start" />
                Back
              </Link>
            </Button>
          </div>
        </section>

        <section>
          <div className="mx-auto grid max-w-7xl gap-8 px-gutter py-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:gap-10 lg:py-10">
            <ProductMedia key={product.id} product={product} />
            <ProductPurchasePanel product={product} soldOut={soldOut} />
          </div>
        </section>

        <section className="border-y bg-muted/25">
          <div className="mx-auto grid max-w-7xl gap-6 px-gutter py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-10">
            <div className="grid content-start gap-5">
              <SectionHeading eyebrow="DETAIL" title="商品説明" />
              <div className="grid gap-4">
                {product.description.map((paragraph) => (
                  <p
                    className="text-sm leading-8 text-foreground/86 sm:text-base"
                    key={paragraph}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm font-semibold">スペック</p>
              <dl className="mt-4 grid gap-3">
                {product.specs.map((spec) => (
                  <div
                    className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 border-b pb-3 last:border-b-0 last:pb-0"
                    key={spec.label}
                  >
                    <dt className="text-xs font-medium text-muted-foreground">
                      {spec.label}
                    </dt>
                    <dd className="text-sm font-medium">{spec.value}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3">
                  <dt className="text-xs font-medium text-muted-foreground">
                    ブランド
                  </dt>
                  <dd className="text-sm font-medium">{product.brand}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto grid max-w-7xl gap-6 px-gutter py-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)] lg:py-10">
            <div className="grid gap-4">
              <SectionHeading
                eyebrow="SHIPPING"
                title="送料・配送"
                text="配送方法は購入時に選択できます。商品サイズや同梱内容によって適した方法が変わります。"
              />
              <div className="grid gap-3 sm:grid-cols-3">
                {deliveryOptions.map((option) => (
                  <div
                    className="rounded-lg border bg-card p-4"
                    key={option.name}
                  >
                    <p className="text-sm font-semibold">{option.name}</p>
                    <p className="mt-2 text-2xl leading-none font-semibold">
                      {option.price}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {option.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {serviceNotes.map((note) => (
                <div
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 rounded-lg border bg-card p-4"
                  key={note.title}
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <note.icon aria-hidden="true" className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{note.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {note.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/25">
          <div className="mx-auto grid max-w-7xl gap-5 px-gutter py-8 lg:py-10">
            <div className="flex items-center justify-between gap-4">
              <SectionHeading eyebrow="RELATED" title="関連商品" />
              <Button
                asChild
                className="h-11 shrink-0 border-primary/25 bg-primary/10 px-4 text-primary hover:bg-primary hover:text-primary-foreground"
                variant="outline"
              >
                <Link to="/items">
                  全ての商品
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4 xl:gap-x-6">
              {relatedProducts.map((relatedProduct) => (
                <RelatedProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        </section>
      </article>

      <SiteFooter />
    </main>
  )
}

function ProductMedia({ product }: { product: Product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const selectedImage = product.images[selectedImageIndex] ?? product.image

  return (
    <div className="grid gap-3">
      <div className="overflow-hidden rounded-lg border bg-muted">
        <img
          alt=""
          className="aspect-square size-full object-cover lg:aspect-[5/6]"
          src={assetUrl(selectedImage)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {product.images.map((image, index) => {
          const selected = index === selectedImageIndex

          return (
            <button
              aria-label={`商品画像 ${index + 1} を表示`}
              aria-pressed={selected}
              className={cn(
                'size-16 overflow-hidden rounded-lg border-2 bg-muted p-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                selected
                  ? 'border-primary'
                  : 'border-border hover:border-primary/55',
              )}
              key={image}
              onClick={() => setSelectedImageIndex(index)}
              type="button"
            >
              <img
                alt=""
                className="size-full object-cover"
                src={assetUrl(image)}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ProductPurchasePanel({
  product,
  soldOut,
}: {
  product: Product
  soldOut: boolean
}) {
  return (
    <div className="h-fit rounded-lg border bg-card p-5 lg:sticky lg:top-20">
      <div className="flex flex-wrap items-center gap-2">
        <ProductStatusBadge status={product.status} />
        <Badge variant="outline">{product.category}</Badge>
      </div>

      <p className="mt-5 text-sm font-medium text-muted-foreground">
        {product.brand}
      </p>
      <h1 className="mt-1 font-heading text-2xl leading-tight font-semibold sm:text-3xl">
        {product.name}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {product.summary}
      </p>

      <div className="mt-6 border-y py-5">
        <p className="text-3xl leading-none font-semibold text-foreground">
          {product.price}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          表示価格には消費税が含まれています。別途送料がかかります。
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">数量</span>
          <div className="relative">
            <select
              className="h-11 w-full cursor-pointer appearance-none rounded-lg border bg-background py-0 pr-12 pl-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={soldOut}
              defaultValue="1"
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-foreground"
            />
          </div>
        </label>

        <div className="grid gap-2">
          <Button
            className={cn(
              'h-12 text-base',
              soldOut &&
                'disabled:pointer-events-auto disabled:cursor-not-allowed disabled:hover:bg-primary',
            )}
            disabled={soldOut}
          >
            <ShoppingCartIcon data-icon="inline-start" />
            {soldOut ? 'SOLD OUT' : 'カートに入れる'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  text,
  title,
}: {
  eyebrow: string
  text?: string
  title: string
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-primary">{eyebrow}</p>
      <h2 className="mt-1 font-heading text-xl font-semibold">{title}</h2>
      {text ? (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {text}
        </p>
      ) : null}
    </div>
  )
}

function RelatedProductCard({ product }: { product: Product }) {
  const soldOut = product.status === 'SOLD OUT'

  return (
    <article className="min-w-0">
      <div className="relative min-w-0">
        <Link
          aria-label={`${product.name}の商品プレビュー`}
          className={cn(interactiveCardLinkClassName, 'grid min-w-0 gap-3 p-3')}
          to={getProductPath(product)}
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border bg-muted group-hover:border-primary/40">
            <img
              alt=""
              className={cn('size-full object-cover', soldOut && 'opacity-64')}
              src={assetUrl(product.image)}
            />
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              <ProductStatusBadge status={product.status} />
            </div>
            {soldOut ? (
              <div className="absolute inset-x-0 bottom-0 bg-card/88 px-3 py-2 text-center text-xs font-semibold text-muted-foreground">
                SOLD OUT
              </div>
            ) : null}
          </div>

          <div className="grid min-w-0 gap-2">
            <div>
              <div className="flex items-center justify-between gap-2">
                <p
                  className={cn(
                    'truncate text-xs font-medium text-muted-foreground',
                    interactiveCardMutedTextClassName,
                  )}
                >
                  {product.brand}
                </p>
                <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[0.68rem] leading-4 font-medium text-muted-foreground">
                  {product.category}
                </span>
              </div>
              <p
                className={cn(
                  'mt-1 [display:-webkit-box] min-h-10 overflow-hidden text-sm leading-5 font-semibold [-webkit-box-orient:vertical] [-webkit-line-clamp:2]',
                  interactiveCardTitleClassName,
                )}
              >
                {product.name}
              </p>
            </div>

            <div className="min-w-0 pr-11">
              <p
                className={cn(
                  'text-base leading-none font-semibold',
                  soldOut ? 'text-muted-foreground' : 'text-foreground',
                )}
              >
                {product.price}
              </p>
            </div>
          </div>
        </Link>

        <Button
          aria-label="カートに追加"
          className={cn(
            'absolute right-3 bottom-3 size-8',
            soldOut &&
              'disabled:pointer-events-auto disabled:cursor-not-allowed disabled:hover:bg-secondary',
            !soldOut &&
              'bg-card/92 text-foreground shadow-sm backdrop-blur hover:border-primary/55 hover:bg-primary hover:text-primary-foreground',
          )}
          disabled={soldOut}
          size="icon"
          title="カートに追加"
          variant={soldOut ? 'secondary' : 'outline'}
        >
          <ShoppingCartIcon aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </article>
  )
}

function getRelatedProducts(product: Product) {
  return [
    ...products.filter(
      (item) => item.id !== product.id && item.category === product.category,
    ),
    ...products.filter(
      (item) => item.id !== product.id && item.category !== product.category,
    ),
  ].slice(0, 4)
}
