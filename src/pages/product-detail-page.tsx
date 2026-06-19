import {
  ArrowLeftIcon,
  HeartIcon,
  PackageCheckIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TruckIcon,
} from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'

import { ProductStatusBadge } from '@/components/product-status-badge'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assetUrl } from '@/lib/asset-url'
import { getProductPath, products, type Product } from '@/lib/shop-content'
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
                商品一覧へ戻る
              </Link>
            </Button>
          </div>
        </section>

        <section>
          <div className="mx-auto grid max-w-7xl gap-8 px-gutter py-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:gap-10 lg:py-10">
            <ProductMedia product={product} />
            <ProductPurchasePanel product={product} soldOut={soldOut} />
          </div>
        </section>

        <section className="border-y bg-muted/25">
          <div className="mx-auto grid max-w-7xl gap-6 px-gutter py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-10">
            <div className="grid content-start gap-5">
              <SectionHeading
                eyebrow="DETAIL"
                title="商品説明"
                text="フィールドでの使いどころと、ローテーションに入れる時の判断材料をまとめています。"
              />
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
                className="shrink-0 px-3"
                size="sm"
                variant="outline"
              >
                <Link to="/items">一覧を見る</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
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
  return (
    <div className="grid gap-3">
      <div className="overflow-hidden rounded-lg border bg-muted">
        <img
          alt=""
          className="aspect-square size-full object-cover lg:aspect-[5/6]"
          src={assetUrl(product.image)}
        />
      </div>
      <div className="flex gap-2">
        <button
          aria-label="商品画像 1"
          aria-pressed="true"
          className="size-16 overflow-hidden rounded-lg border-2 border-primary bg-muted p-0"
          type="button"
        >
          <img
            alt=""
            className="size-full object-cover"
            src={assetUrl(product.image)}
          />
        </button>
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
        <Badge variant="secondary">{product.brand}</Badge>
      </div>

      <h1 className="mt-5 font-heading text-2xl leading-tight font-semibold sm:text-3xl">
        {product.name}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {product.summary}
      </p>

      <div className="mt-6 border-y py-5">
        <p
          className={cn(
            'text-3xl leading-none font-semibold',
            soldOut ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          {product.price}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          表示価格には消費税が含まれています。別途送料がかかります。
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">数量</span>
          <select
            className="h-11 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30 disabled:opacity-50"
            disabled={soldOut}
            defaultValue="1"
          >
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </label>

        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_3rem]">
          <Button className="h-12 text-base" disabled={soldOut}>
            <ShoppingBagIcon data-icon="inline-start" />
            カートに入れる
          </Button>
          <Button
            aria-label="お気に入り"
            className="h-12 sm:size-12"
            title="お気に入り"
            variant="outline"
          >
            <HeartIcon aria-hidden="true" className="size-4" />
          </Button>
        </div>

        {soldOut ? (
          <Button className="h-11" variant="secondary">
            <RotateCcwIcon data-icon="inline-start" />
            再入荷のお知らせ
          </Button>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <span
            className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
            key={tag}
          >
            {tag}
          </span>
        ))}
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
    <Link
      className="group grid min-w-0 gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      to={getProductPath(product)}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg border bg-muted">
        <img
          alt=""
          className={cn(
            'size-full object-cover',
            soldOut ? 'opacity-64' : 'group-hover:opacity-92',
          )}
          src={assetUrl(product.image)}
        />
        <div className="absolute top-2 left-2">
          <ProductStatusBadge status={product.status} />
        </div>
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-muted-foreground">
          {product.brand}
        </p>
        <p className="mt-1 [display:-webkit-box] min-h-10 overflow-hidden text-sm leading-5 font-semibold [-webkit-box-orient:vertical] [-webkit-line-clamp:2] group-hover:text-primary">
          {product.name}
        </p>
        <p
          className={cn(
            'mt-2 text-sm font-semibold',
            soldOut ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          {product.price}
        </p>
      </div>
    </Link>
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
