import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  RotateCcwIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { ProductCard } from '@/components/product-card'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isOnSale, isSoldOut } from '@/lib/product-status'
import {
  productBrands,
  productCategories,
  products,
  type Product,
} from '@/lib/shop-content'
import { cn } from '@/lib/utils'

const allFilterLabel = '全て'

type StatusFilterValue = 'all' | 'sale'
type CategoryFilterValue = (typeof productCategories)[number]
type BrandFilterValue = typeof allFilterLabel | (typeof productBrands)[number]

type SortValue = 'new' | 'price-asc' | 'price-desc'

const sortOptions: Array<{ label: string; value: SortValue }> = [
  { label: '新着順', value: 'new' },
  { label: '価格の安い順', value: 'price-asc' },
  { label: '価格の高い順', value: 'price-desc' },
]

const productOrderIndexes = new Map(
  products.map((product, index) => [product.id, index]),
)

function getProductPriceNumber(product: Product) {
  return Number(product.price.replace(/[^\d]/g, ''))
}

function compareOriginalOrder(a: Product, b: Product) {
  return (
    (productOrderIndexes.get(a.id) ?? 0) - (productOrderIndexes.get(b.id) ?? 0)
  )
}

function compareProducts(a: Product, b: Product, sortValue: SortValue) {
  const aSoldOut = isSoldOut(a)
  const bSoldOut = isSoldOut(b)

  if (aSoldOut !== bSoldOut) {
    return aSoldOut ? 1 : -1
  }

  if (sortValue === 'price-asc') {
    return (
      getProductPriceNumber(a) - getProductPriceNumber(b) ||
      compareOriginalOrder(a, b)
    )
  }

  if (sortValue === 'price-desc') {
    return (
      getProductPriceNumber(b) - getProductPriceNumber(a) ||
      compareOriginalOrder(a, b)
    )
  }

  return compareOriginalOrder(a, b)
}

type ShopProductFilterState = {
  brandFilter: BrandFilterValue
  categoryFilter: CategoryFilterValue
  statusFilterValue: StatusFilterValue
}

function matchesShopProductFilters(
  product: Product,
  filters: ShopProductFilterState,
) {
  if (
    filters.categoryFilter !== allFilterLabel &&
    product.category !== filters.categoryFilter
  ) {
    return false
  }

  if (
    filters.brandFilter !== allFilterLabel &&
    product.brand !== filters.brandFilter
  ) {
    return false
  }

  if (filters.statusFilterValue === 'sale' && !isOnSale(product)) {
    return false
  }

  return true
}

function getFilteredProducts(filters: ShopProductFilterState) {
  return products.filter((product) =>
    matchesShopProductFilters(product, filters),
  )
}

function getVisibleProducts(
  filters: ShopProductFilterState,
  sortValue: SortValue,
) {
  const filteredProducts = getFilteredProducts(filters)
  return [...filteredProducts].sort((a, b) => compareProducts(a, b, sortValue))
}

export function ProductListPage() {
  const [brandFilter, setBrandFilter] =
    useState<BrandFilterValue>(allFilterLabel)
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilterValue>(allFilterLabel)
  const [sortValue, setSortValue] = useState<SortValue>('new')
  const [statusFilterValue, setStatusFilterValue] =
    useState<StatusFilterValue>('all')
  const currentFilters = {
    brandFilter,
    categoryFilter,
    statusFilterValue,
  } satisfies ShopProductFilterState
  const getFilterCount = (filters: Partial<ShopProductFilterState> = {}) =>
    getFilteredProducts({ ...currentFilters, ...filters }).length
  const statusFilterOptions = [
    {
      label: allFilterLabel,
      value: 'all',
      count: getFilterCount({ statusFilterValue: 'all' }),
    },
    {
      label: 'セール中',
      value: 'sale',
      count: getFilterCount({ statusFilterValue: 'sale' }),
    },
  ] as const satisfies ReadonlyArray<{
    label: string
    value: StatusFilterValue
    count: number
  }>
  const categoryFilterItems = productCategories.map((category) => ({
    label: category,
    value: category,
    count: getFilterCount({ categoryFilter: category }),
  })) satisfies ReadonlyArray<{
    label: string
    value: CategoryFilterValue
    count: number
  }>
  const brandFilterItems = [
    {
      label: allFilterLabel,
      value: allFilterLabel,
      count: getFilterCount({ brandFilter: allFilterLabel }),
    },
    ...productBrands.map((brand) => ({
      label: brand,
      value: brand,
      count: getFilterCount({ brandFilter: brand }),
    })),
  ] satisfies ReadonlyArray<{
    label: string
    value: BrandFilterValue
    count: number
  }>
  const visibleProducts = getVisibleProducts(currentFilters, sortValue)
  const purchasableProductCount = visibleProducts.filter(
    (product) => !isSoldOut(product),
  ).length
  const soldOutProductCount = visibleProducts.filter((product) =>
    isSoldOut(product),
  ).length
  const handleResetFilters = () => {
    setBrandFilter(allFilterLabel)
    setCategoryFilter(allFilterLabel)
    setSortValue('new')
    setStatusFilterValue('all')
  }

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
              表示価格には消費税が含まれています。別途送料がかかります。
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
                placeholder="商品名・ブランドで検索"
                type="search"
              />
            </label>

            <SortSelect onChange={setSortValue} value={sortValue} />
          </div>

          <div className="grid gap-3">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-end">
              <div className="min-w-0">
                <ProductStatusFilter
                  options={statusFilterOptions}
                  onChange={setStatusFilterValue}
                  value={statusFilterValue}
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <FilterSelect
                  items={categoryFilterItems}
                  label="カテゴリー"
                  onChange={setCategoryFilter}
                  value={categoryFilter}
                />
                <FilterSelect
                  items={brandFilterItems}
                  label="ブランド"
                  onChange={setBrandFilter}
                  value={brandFilter}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleResetFilters}
                size="sm"
                type="button"
                variant="outline"
              >
                <RotateCcwIcon data-icon="inline-start" />
                リセット
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="items">
        <div className="mx-auto grid max-w-7xl gap-6 px-gutter py-8 lg:py-10">
          <div className="grid content-start gap-5">
            <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">全ての商品</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  購入可能な商品 {purchasableProductCount}件 / SOLD OUT{' '}
                  {soldOutProductCount}件
                </p>
              </div>
            </div>

            {visibleProducts.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-6">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border bg-card px-4 py-10 text-center">
                <p className="text-sm font-medium">
                  条件に一致する商品がありません。
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  絞り込み条件を変更してください。
                </p>
              </div>
            )}

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

function ProductStatusFilter({
  onChange,
  options,
  value,
}: {
  onChange: (value: StatusFilterValue) => void
  options: ReadonlyArray<{
    label: string
    value: StatusFilterValue
    count: number
  }>
  value: StatusFilterValue
}) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <SlidersHorizontalIcon aria-hidden="true" className="size-4" />
        絞り込み
      </div>
      <div
        aria-label="絞り込み"
        className="flex w-fit max-w-full rounded-lg border bg-card p-1"
        role="group"
      >
        {options.map((option) => {
          const active = option.value === value

          return (
            <button
              aria-pressed={active ? 'true' : 'false'}
              className={cn(
                'inline-flex h-7 min-w-16 items-center justify-center gap-1 rounded-md px-2 text-xs font-medium whitespace-nowrap',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent/55 hover:text-foreground',
              )}
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
            >
              <span className="truncate">{option.label}</span>
              <span
                className={cn(
                  'inline-block w-[3ch] shrink-0 text-right text-[0.68rem] tabular-nums',
                  active
                    ? 'text-primary-foreground/75'
                    : 'text-muted-foreground',
                )}
              >
                {option.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function FilterSelect<TValue extends string>({
  items,
  label,
  onChange,
  value,
}: {
  items: ReadonlyArray<{ label: string; value: TValue; count: number }>
  label: string
  onChange: (value: TValue) => void
  value: TValue
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="relative">
        <select
          aria-label={label}
          className="h-10 w-full cursor-pointer appearance-none rounded-lg border bg-card px-3 pr-9 text-sm font-medium outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onChange={(event) => onChange(event.target.value as TValue)}
          value={value}
        >
          {items.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}（{item.count}）
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </span>
    </label>
  )
}

function SortSelect({
  onChange,
  value,
}: {
  onChange: (value: SortValue) => void
  value: SortValue
}) {
  return (
    <label className="relative block min-w-0 lg:w-44">
      <span className="sr-only">並び替え</span>
      <ArrowUpDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <select
        aria-label="並び替え"
        className="h-11 w-full cursor-pointer appearance-none rounded-lg border bg-card pr-9 pl-10 text-sm font-medium outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onChange={(event) => onChange(event.target.value as SortValue)}
        value={value}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </label>
  )
}
