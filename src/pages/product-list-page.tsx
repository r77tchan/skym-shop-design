import {
  ArrowRightIcon,
  ArrowUpDownIcon,
  ChevronDownIcon,
  Grid3X3Icon,
  HeartIcon,
  SearchIcon,
  ShoppingBagIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { ProductStatusBadge } from '@/components/product-status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assetUrl } from '@/lib/asset-url'
import {
  getProductPath,
  productBrands,
  productCategories,
  products,
  type Product,
} from '@/lib/shop-content'
import { cn } from '@/lib/utils'

const quickFilters = [
  {
    label: '新着',
    count: products.filter((product) => product.status === 'NEW').length,
    active: true,
  },
  {
    label: '再入荷',
    count: products.filter((product) => product.status === 'RESTOCK').length,
  },
  {
    label: 'セール',
    count: products.filter((product) => product.status === 'SALE').length,
  },
  {
    label: '在庫あり',
    count: products.filter((product) => product.status !== 'SOLD OUT').length,
  },
]

const priceRanges = [
  { label: '〜 ¥500', count: 5 },
  { label: '¥501 〜 ¥1,000', count: 1 },
  { label: '¥1,001 〜', count: 1 },
]

export function ProductListPage() {
  const availableCount = products.filter(
    (product) => product.status !== 'SOLD OUT',
  ).length

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

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold text-primary">ALL ITEMS</p>
              <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
                商品一覧
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                エリアトラウトを中心に、カラー・ウェイト・在庫状態を見比べながら選べる商品リストです。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <CatalogMetric label="掲載" value={`${products.length}点`} />
              <CatalogMetric label="在庫あり" value={`${availableCount}点`} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-gutter py-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <label className="relative block">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                aria-label="商品検索"
                className="h-11 w-full rounded-lg border bg-card pr-3 pl-10 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30"
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
              <Button
                aria-label="グリッド表示"
                className="hidden size-11 sm:inline-flex"
                size="icon-lg"
                title="グリッド表示"
                variant="secondary"
              >
                <Grid3X3Icon aria-hidden="true" className="size-4" />
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
                <p className="text-sm font-semibold">すべての商品</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {products.length}件中 {products.length}件を表示
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">新着順</Badge>
                <Badge variant="outline">SOLD OUT 表示中</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                入荷状況は商品詳細ページで最終確認してください。
              </p>
              <div className="flex items-center gap-2">
                <Button className="size-9" size="icon-lg" variant="secondary">
                  1
                </Button>
                <Button className="size-9" size="icon-lg" variant="outline">
                  2
                </Button>
                <Button className="size-9" size="icon-lg" variant="outline">
                  3
                </Button>
                <Button className="h-9 px-3" variant="outline">
                  次へ
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}

function CatalogMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card px-4 py-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl leading-none font-semibold">{value}</p>
    </div>
  )
}

function FilterPanel() {
  const categoryItems = productCategories.map((category) => ({
    label: category,
    count:
      category === 'すべて'
        ? products.length
        : products.filter(
            (product) =>
              product.category === category || product.status === category,
          ).length,
  }))

  const brandItems = productBrands.map((brand) => ({
    label: brand,
    count: products.filter((product) => product.brand === brand).length,
  }))

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

      <div className="mt-5 grid gap-6">
        <FilterGroup items={categoryItems} title="カテゴリー" />
        <FilterGroup items={brandItems} title="ブランド" />
        <FilterGroup items={priceRanges} title="価格帯" />
      </div>
    </aside>
  )
}

function FilterGroup({
  items,
  title,
}: {
  items: Array<{ label: string; count: number }>
  title: string
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground">{title}</p>
      <div className="mt-2 grid gap-1">
        {items.map((item, index) => (
          <button
            aria-pressed={index === 0 ? 'true' : 'false'}
            className={cn(
              'flex h-9 items-center justify-between gap-3 rounded-lg px-2.5 text-sm font-medium',
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
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const soldOut = product.status === 'SOLD OUT'

  return (
    <article className="group grid min-w-0 gap-3">
      <div className="relative">
        <Link
          aria-label={`${product.name}の商品プレビュー`}
          className="block aspect-[3/4] overflow-hidden rounded-lg border bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          to={getProductPath(product)}
        >
          <img
            alt=""
            className={cn(
              'size-full object-cover',
              soldOut ? 'opacity-64' : 'group-hover:opacity-92',
            )}
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
        </Link>
        <Button
          aria-label="お気に入り"
          className="absolute top-2 right-2 size-8 border-white/45 bg-white/88 text-foreground hover:bg-white"
          size="icon"
          title="お気に入り"
          variant="outline"
        >
          <HeartIcon aria-hidden="true" className="size-4" />
        </Button>
      </div>

      <div className="grid min-w-0 gap-2">
        <Link
          aria-label={`${product.name}の商品プレビュー`}
          className="min-w-0 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          to={getProductPath(product)}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs font-medium text-muted-foreground">
              {product.brand}
            </p>
            <p className="shrink-0 text-xs font-medium text-muted-foreground">
              {product.category}
            </p>
          </div>
          <h2 className="mt-1 [display:-webkit-box] min-h-10 overflow-hidden text-sm leading-5 font-semibold [-webkit-box-orient:vertical] [-webkit-line-clamp:2] group-hover:text-primary">
            {product.name}
          </h2>
        </Link>

        <div className="flex items-end justify-between gap-2">
          <div>
            <p
              className={cn(
                'text-base leading-none font-semibold',
                soldOut ? 'text-muted-foreground' : 'text-foreground',
              )}
            >
              {product.price}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {product.tags.map((tag) => (
                <span
                  className="rounded-md bg-muted px-1.5 py-0.5 text-[0.68rem] leading-4 font-medium text-muted-foreground"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <Button
            aria-label="カート"
            className="size-8"
            disabled={soldOut}
            size="icon"
            title="カート"
            variant={soldOut ? 'secondary' : 'default'}
          >
            <ShoppingBagIcon aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  )
}
