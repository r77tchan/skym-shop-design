import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  SearchIcon,
  ShoppingCartIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import { useId, useState } from 'react'
import { Link } from 'react-router'

import { ProductPrice } from '@/components/product-price'
import { ProductStatusBadge } from '@/components/product-status-badge'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { assetUrl } from '@/lib/asset-url'
import {
  getPrimaryProductStatus,
  isOnSale,
  isSoldOut,
} from '@/lib/product-status'
import {
  getProductPath,
  productBrands,
  productCategories,
  products,
  type Product,
} from '@/lib/shop-content'
import {
  interactiveCardMutedTextClassName,
  interactiveCardSurfaceClassName,
  interactiveCardTitleClassName,
} from '@/lib/ui-styles'
import { cn } from '@/lib/utils'

const allFilterLabel = '全て'

function getProductPriceNumber(product: Product) {
  return Number(product.price.replace(/[^\d]/g, ''))
}

const quickFilters = [
  {
    label: allFilterLabel,
    count: products.length,
    active: true,
  },
  {
    label: '在庫あり',
    count: products.filter((product) => !isSoldOut(product)).length,
  },
  {
    label: 'セール中',
    count: products.filter((product) => isOnSale(product)).length,
  },
]

const priceRanges = [
  { label: allFilterLabel, count: products.length },
  {
    label: '〜 ¥500',
    count: products.filter((product) => getProductPriceNumber(product) <= 500)
      .length,
  },
  {
    label: '¥501 〜 ¥1,000',
    count: products.filter((product) => {
      const price = getProductPriceNumber(product)
      return price >= 501 && price <= 1000
    }).length,
  },
  {
    label: '¥1,001 〜',
    count: products.filter((product) => getProductPriceNumber(product) >= 1001)
      .length,
  },
]

type FilterItem = {
  label: string
  count: number
}

export function ProductListPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <SiteHeader />

      <section className="border-b bg-muted/35 pt-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-gutter py-10 sm:py-12">
          <nav
            aria-label="パンくず"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
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
            <span className="text-foreground">商品一覧</span>
          </nav>

          <div className="max-w-3xl">
            <p className="text-xs font-semibold text-primary">ITEMS</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
              商品一覧
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              エリアトラウトを中心に、カラー・ウェイト・在庫状態を見比べながら選べる商品リストです。
            </p>
          </div>
        </div>
      </section>

      <section className="border-b bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-gutter py-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <label className="relative block min-w-0">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                aria-label="商品検索"
                className="bg-card pr-3 pl-10"
                placeholder="商品名・ブランドで探す"
                type="search"
              />
            </label>

            <div className="flex items-center gap-2">
              <Button
                className="h-11 flex-1 justify-start px-3 lg:hidden"
                variant="outline"
              >
                <SlidersHorizontalIcon data-icon="inline-start" />
                絞り込み
              </Button>
              <Button className="h-11 px-3" variant="outline">
                <ArrowUpDownIcon data-icon="inline-start" />
                新着順
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            </div>
          </div>

          <div className="-mx-gutter [scrollbar-width:none] overflow-x-auto px-gutter [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2">
              {quickFilters.map((filter) => (
                <button
                  aria-pressed={filter.active ? 'true' : 'false'}
                  className={cn(
                    'inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium whitespace-nowrap',
                    filter.active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card hover:bg-accent/55',
                  )}
                  key={filter.label}
                  type="button"
                >
                  <span>{filter.label}</span>
                  <span
                    className={cn(
                      'text-xs',
                      filter.active
                        ? 'text-primary-foreground/75'
                        : 'text-muted-foreground',
                    )}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="items">
        <div className="mx-auto grid max-w-7xl gap-6 px-gutter py-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:py-10">
          <FilterPanel />

          <div className="grid content-start gap-5">
            <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">全ての商品</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {products.length}件中 {products.length}件を表示
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">新着順</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-5 sm:gap-y-8 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="border-t pt-6">
              <p className="text-xs text-muted-foreground">
                表示価格には消費税が含まれています。別途送料がかかります。
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function FilterPanel() {
  const categoryItems = productCategories.map((category) => ({
    label: category,
    count:
      category === allFilterLabel
        ? products.length
        : products.filter((product) => product.category === category).length,
  }))

  const brandItems = [
    { label: allFilterLabel, count: products.length },
    ...productBrands.map((brand) => ({
      label: brand,
      count: products.filter((product) => product.brand === brand).length,
    })),
  ]

  return (
    <aside
      aria-label="商品フィルター"
      className="hidden h-fit rounded-lg border bg-card p-4 lg:sticky lg:top-20 lg:block"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">絞り込み</p>
        <SlidersHorizontalIcon
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
      </div>

      <div className="mt-4 grid gap-3">
        <FilterGroup defaultOpen items={categoryItems} title="カテゴリー" />
        <FilterGroup items={brandItems} title="ブランド" />
        <FilterGroup items={priceRanges} title="価格帯" />
      </div>
    </aside>
  )
}

function FilterGroup({
  defaultOpen = false,
  items,
  title,
}: {
  defaultOpen?: boolean
  items: FilterItem[]
  title: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  const contentId = useId()
  const selectedItem = items[0]

  return (
    <section className="border-t pt-3 first:border-t-0 first:pt-0">
      <button
        aria-controls={contentId}
        aria-expanded={open}
        className="flex h-8 w-full items-center justify-between gap-3 rounded-lg px-2 text-left hover:bg-muted"
        onClick={() => setOpen((isOpen) => !isOpen)}
        type="button"
      >
        <span className="text-xs font-semibold text-muted-foreground">
          {title}
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          {selectedItem.label}
          <ChevronDownIcon
            aria-hidden="true"
            className={cn('size-3.5', open && 'rotate-180')}
          />
        </span>
      </button>

      <div className={cn('mt-2 grid gap-1', !open && 'hidden')} id={contentId}>
        {items.map((item, index) => (
          <button
            aria-pressed={index === 0 ? 'true' : 'false'}
            className={cn(
              'flex h-8 items-center justify-between gap-3 rounded-lg px-2.5 text-sm font-medium',
              index === 0
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            key={item.label}
            type="button"
          >
            <span>{item.label}</span>
            <span className="text-xs">{item.count}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const soldOut = isSoldOut(product)
  const primaryStatus = getPrimaryProductStatus(product)

  return (
    <article className="min-w-0">
      <div
        className={cn(
          interactiveCardSurfaceClassName,
          'grid min-w-0 gap-3 p-3',
        )}
      >
        <Link
          aria-label={`${product.name}の商品プレビュー`}
          className="grid min-w-0 gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
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
            <h2
              className={cn(
                'mt-1 [display:-webkit-box] min-h-10 overflow-hidden text-sm leading-5 font-semibold [-webkit-box-orient:vertical] [-webkit-line-clamp:2]',
                interactiveCardTitleClassName,
              )}
            >
              {product.name}
            </h2>
          </div>
        </Link>

        <div className="flex min-w-0 items-center justify-between gap-3">
          <ProductPrice className="min-w-0" muted={soldOut} product={product} />

          <Button
            aria-label="カートに追加"
            className={cn(
              'size-8 shrink-0',
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
      </div>
    </article>
  )
}
