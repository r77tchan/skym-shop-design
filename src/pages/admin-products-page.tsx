import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  EyeIcon,
  FileDownIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import { ProductPrice } from '@/components/product-price'
import { ProductStatusBadge } from '@/components/product-status-badge'
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
import { cn } from '@/lib/utils'

const stockLevels = [18, 9, 0, 7, 0, 14, 4, 6, 21, 11, 3, 5] as const

const adminProductRows = products.map((product, index) => {
  const soldOut = isSoldOut(product)
  const stock = soldOut ? 0 : stockLevels[index % stockLevels.length]

  return {
    product,
    stock,
    publishState: soldOut ? '売り切れ表示' : '公開中',
    updatedAt: `2026.06.${String(18 - (index % 8)).padStart(2, '0')}`,
  }
})

const productStats = [
  {
    label: '登録商品',
    value: `${products.length}件`,
    detail: `${productCategories.length - 1}カテゴリ / ${productBrands.length}ブランド`,
  },
  {
    label: '公開中',
    value: `${products.filter((product) => !isSoldOut(product)).length}件`,
    detail: 'ストアに表示中',
  },
  {
    label: '在庫注意',
    value: `${adminProductRows.filter((row) => row.stock > 0 && row.stock <= 5).length}件`,
    detail: '残り5点以下',
  },
  {
    label: 'セール',
    value: `${products.filter((product) => isOnSale(product)).length}件`,
    detail: '割引価格を表示中',
  },
]

const quickFilters = [
  {
    label: '全て',
    count: products.length,
    active: true,
  },
  {
    label: '公開中',
    count: products.filter((product) => !isSoldOut(product)).length,
  },
  {
    label: '在庫注意',
    count: adminProductRows.filter((row) => row.stock > 0 && row.stock <= 5)
      .length,
  },
  {
    label: 'SOLD OUT',
    count: products.filter((product) => isSoldOut(product)).length,
  },
  {
    label: 'SALE',
    count: products.filter((product) => isOnSale(product)).length,
  },
]

function getStockClassName(stock: number) {
  if (stock === 0) {
    return 'bg-chart-5/12 text-chart-5'
  }

  if (stock <= 5) {
    return 'bg-chart-4/14 text-chart-4'
  }

  return 'bg-chart-3/12 text-chart-3'
}

function getPublishStateClassName(state: string) {
  if (state === '公開中') {
    return 'bg-primary/10 text-primary'
  }

  return 'bg-muted text-muted-foreground'
}

export function AdminProductsPage() {
  return (
    <>
      <ProductsPageHeader />

      <section
        aria-label="商品管理の主要指標"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {productStats.map((stat) => (
          <article
            className="min-w-0 rounded-lg border bg-card p-4"
            key={stat.label}
          >
            <p className="truncate text-xs font-medium text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 font-heading text-2xl font-semibold">
              {stat.value}
            </p>
            <p className="mt-3 truncate text-xs text-muted-foreground">
              {stat.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 rounded-lg border bg-card p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block min-w-0">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="商品検索"
              className="bg-background pr-3 pl-10"
              placeholder="商品名・ブランド・SKUで検索"
              type="search"
            />
          </label>

          <div className="flex items-center gap-2">
            <Button className="h-11 px-3 lg:hidden" variant="outline">
              <SlidersHorizontalIcon data-icon="inline-start" />
              絞り込み
            </Button>
            <Button className="h-11 px-3" variant="outline">
              <ArrowUpDownIcon data-icon="inline-start" />
              更新日順
              <ChevronDownIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>

        <div className="-mx-4 [scrollbar-width:none] overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            {quickFilters.map((filter) => (
              <button
                aria-pressed={filter.active ? 'true' : 'false'}
                className={cn(
                  'inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium whitespace-nowrap',
                  filter.active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-accent/55',
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
      </section>

      <ProductsTable />
    </>
  )
}

function ProductsPageHeader() {
  return (
    <section className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
          商品管理
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button className="h-10 px-3" variant="outline">
          <FileDownIcon data-icon="inline-start" />
          CSV
        </Button>
        <Button className="h-10 px-3">
          <PlusIcon data-icon="inline-start" />
          商品登録
        </Button>
      </div>
    </section>
  )
}

function ProductsTable() {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">商品一覧</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {products.length}件中 {products.length}件を表示
          </p>
        </div>
        <Button className="w-fit" size="sm" variant="outline">
          <PencilIcon data-icon="inline-start" />
          一括編集
        </Button>
      </div>

      <div className="hidden border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground lg:grid lg:grid-cols-[minmax(280px,1.35fr)_104px_112px_104px_112px_104px_36px] lg:items-center lg:gap-3">
        <span>商品</span>
        <span>カテゴリ</span>
        <span>価格</span>
        <span>在庫</span>
        <span>公開状態</span>
        <span>更新日</span>
        <span aria-hidden="true" />
      </div>

      <div className="hidden divide-y lg:block">
        {adminProductRows.map((row) => (
          <ProductTableRow
            key={row.product.id}
            product={row.product}
            publishState={row.publishState}
            stock={row.stock}
            updatedAt={row.updatedAt}
          />
        ))}
      </div>

      <div className="grid divide-y lg:hidden">
        {adminProductRows.map((row) => (
          <ProductMobileCard
            key={row.product.id}
            product={row.product}
            publishState={row.publishState}
            stock={row.stock}
            updatedAt={row.updatedAt}
          />
        ))}
      </div>
    </section>
  )
}

function ProductTableRow({
  product,
  publishState,
  stock,
  updatedAt,
}: {
  product: Product
  publishState: string
  stock: number
  updatedAt: string
}) {
  const primaryStatus = getPrimaryProductStatus(product)

  return (
    <article className="grid px-4 py-3 lg:grid-cols-[minmax(280px,1.35fr)_104px_112px_104px_112px_104px_36px] lg:items-center lg:gap-3">
      <div className="grid min-w-0 grid-cols-[56px_minmax(0,1fr)] items-center gap-3">
        <img
          alt=""
          className="aspect-square w-14 rounded-lg bg-muted object-cover"
          src={assetUrl(product.image)}
        />
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-semibold">{product.name}</p>
            <ProductStatusBadge status={primaryStatus} />
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {product.brand} / {product.id}
          </p>
        </div>
      </div>

      <p className="truncate text-sm">{product.category}</p>
      <ProductPrice product={product} variant="rail" />
      <Badge className={cn('w-fit', getStockClassName(stock))}>
        {stock === 0 ? '在庫なし' : `${stock}点`}
      </Badge>
      <Badge className={cn('w-fit', getPublishStateClassName(publishState))}>
        {publishState}
      </Badge>
      <p className="text-xs text-muted-foreground">{updatedAt}</p>
      <Button
        aria-label={`${product.name}の操作`}
        size="icon-sm"
        variant="ghost"
      >
        <MoreHorizontalIcon aria-hidden="true" />
      </Button>
    </article>
  )
}

function ProductMobileCard({
  product,
  publishState,
  stock,
  updatedAt,
}: {
  product: Product
  publishState: string
  stock: number
  updatedAt: string
}) {
  const primaryStatus = getPrimaryProductStatus(product)

  return (
    <article className="grid gap-4 p-4">
      <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-3">
        <img
          alt=""
          className="aspect-square w-[72px] rounded-lg bg-muted object-cover"
          src={assetUrl(product.image)}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <ProductStatusBadge status={primaryStatus} />
            <Badge
              className={cn('w-fit', getPublishStateClassName(publishState))}
            >
              {publishState}
            </Badge>
          </div>
          <h2 className="mt-2 line-clamp-2 text-sm leading-5 font-semibold">
            {product.name}
          </h2>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {product.brand} / {product.category}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/35 p-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">価格</p>
          <ProductPrice className="mt-1" product={product} variant="rail" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">在庫</p>
          <Badge className={cn('mt-1', getStockClassName(stock))}>
            {stock === 0 ? '在庫なし' : `${stock}点`}
          </Badge>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">更新日</p>
          <p className="mt-1 font-medium">{updatedAt}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">商品ID</p>
          <p className="mt-1 truncate font-medium">{product.id}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button className="h-9 px-3" variant="outline">
          <PencilIcon data-icon="inline-start" />
          編集
        </Button>
        <Button asChild className="h-9 px-3" variant="outline">
          <Link to={getProductPath(product)}>
            <EyeIcon data-icon="inline-start" />
            表示
          </Link>
        </Button>
      </div>
    </article>
  )
}
