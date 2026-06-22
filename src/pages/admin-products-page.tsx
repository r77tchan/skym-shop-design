import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  PencilIcon,
  PlusIcon,
  RotateCcwIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import { useState } from 'react'

import { ProductPrice } from '@/components/product-price'
import { ProductStatusBadge } from '@/components/product-status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { assetUrl } from '@/lib/asset-url'
import {
  getPrimaryProductStatus,
  isOnSale,
  isSoldOut,
} from '@/lib/product-status'
import {
  productBrands,
  productCategories,
  products,
  type Product,
} from '@/lib/shop-content'
import { cn } from '@/lib/utils'

const stockLevels = [18, 9, 0, 7, 0, 14, 4, 6, 21, 11, 3, 5] as const
const allFilterLabel = '全て'

type CategoryFilterValue = (typeof productCategories)[number]
type BrandFilterValue = typeof allFilterLabel | (typeof productBrands)[number]
type InventoryFilterValue = 'all' | 'in-stock' | 'out-of-stock'
type SaleFilterValue = 'all' | 'on-sale' | 'not-sale'
type SortValue = 'new' | 'price-asc' | 'price-desc'
type VisibilityFilterValue = 'all' | 'published' | 'unpublished'

const adminProductRows = products.map((product, index) => {
  const soldOut = isSoldOut(product)
  const stock = soldOut ? 0 : stockLevels[index % stockLevels.length]

  return {
    displayNo: index + 1,
    product,
    stock,
  }
})

type AdminProductRow = (typeof adminProductRows)[number]

const productOrderIndexes = new Map(
  adminProductRows.map((row, index) => [row.product.id, index]),
)

const adminCategoryFilterItems = productCategories.map((category) => ({
  label: category,
  value: category,
  count:
    category === allFilterLabel
      ? products.length
      : products.filter((product) => product.category === category).length,
})) satisfies ReadonlyArray<{
  label: string
  value: CategoryFilterValue
  count: number
}>

const adminBrandFilterItems = [
  { label: allFilterLabel, value: allFilterLabel, count: products.length },
  ...productBrands.map((brand) => ({
    label: brand,
    value: brand,
    count: products.filter((product) => product.brand === brand).length,
  })),
] satisfies ReadonlyArray<{
  label: string
  value: BrandFilterValue
  count: number
}>

const sortOptions: Array<{ label: string; value: SortValue }> = [
  { label: '新着順', value: 'new' },
  { label: '価格の安い順', value: 'price-asc' },
  { label: '価格の高い順', value: 'price-desc' },
]

function getProductPriceNumber(product: Product) {
  return Number(product.price.replace(/[^\d]/g, ''))
}

function compareOriginalRowOrder(a: AdminProductRow, b: AdminProductRow) {
  return (
    (productOrderIndexes.get(a.product.id) ?? 0) -
    (productOrderIndexes.get(b.product.id) ?? 0)
  )
}

function compareAdminProductRows(
  a: AdminProductRow,
  b: AdminProductRow,
  sortValue: SortValue,
) {
  if (sortValue === 'price-asc') {
    return (
      getProductPriceNumber(a.product) - getProductPriceNumber(b.product) ||
      compareOriginalRowOrder(a, b)
    )
  }

  if (sortValue === 'price-desc') {
    return (
      getProductPriceNumber(b.product) - getProductPriceNumber(a.product) ||
      compareOriginalRowOrder(a, b)
    )
  }

  return compareOriginalRowOrder(a, b)
}

const inventoryFilterOptions = [
  { label: '全て', value: 'all', count: adminProductRows.length },
  {
    label: '在庫あり',
    value: 'in-stock',
    count: adminProductRows.filter((row) => row.stock > 0).length,
  },
  {
    label: '在庫なし',
    value: 'out-of-stock',
    count: adminProductRows.filter((row) => row.stock === 0).length,
  },
] as const satisfies ReadonlyArray<{
  label: string
  value: InventoryFilterValue
  count: number
}>

const saleFilterOptions = [
  { label: '全て', value: 'all', count: adminProductRows.length },
  {
    label: 'セール中',
    value: 'on-sale',
    count: adminProductRows.filter((row) => isOnSale(row.product)).length,
  },
  {
    label: 'セールなし',
    value: 'not-sale',
    count: adminProductRows.filter((row) => !isOnSale(row.product)).length,
  },
] as const satisfies ReadonlyArray<{
  label: string
  value: SaleFilterValue
  count: number
}>

export function AdminProductsPage() {
  const [publishedProductIds, setPublishedProductIds] = useState<
    ReadonlySet<number>
  >(() => new Set(products.map((product) => product.id)))
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilterValue>(allFilterLabel)
  const [brandFilter, setBrandFilter] =
    useState<BrandFilterValue>(allFilterLabel)
  const [inventoryFilter, setInventoryFilter] =
    useState<InventoryFilterValue>('all')
  const [saleFilter, setSaleFilter] = useState<SaleFilterValue>('all')
  const [sortValue, setSortValue] = useState<SortValue>('new')
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilterValue>('all')
  const visibilityFilterOptions = [
    { label: '全て', value: 'all', count: adminProductRows.length },
    {
      label: '公開',
      value: 'published',
      count: adminProductRows.filter((row) =>
        publishedProductIds.has(row.product.id),
      ).length,
    },
    {
      label: '非公開',
      value: 'unpublished',
      count: adminProductRows.filter(
        (row) => !publishedProductIds.has(row.product.id),
      ).length,
    },
  ] as const satisfies ReadonlyArray<{
    label: string
    value: VisibilityFilterValue
    count: number
  }>
  const filteredProductRows = adminProductRows
    .filter((row) => {
      if (
        categoryFilter !== allFilterLabel &&
        row.product.category !== categoryFilter
      ) {
        return false
      }

      if (brandFilter !== allFilterLabel && row.product.brand !== brandFilter) {
        return false
      }

      if (inventoryFilter === 'in-stock' && row.stock === 0) {
        return false
      }

      if (inventoryFilter === 'out-of-stock' && row.stock > 0) {
        return false
      }

      if (saleFilter === 'on-sale' && !isOnSale(row.product)) {
        return false
      }

      if (saleFilter === 'not-sale' && isOnSale(row.product)) {
        return false
      }

      if (
        visibilityFilter === 'published' &&
        !publishedProductIds.has(row.product.id)
      ) {
        return false
      }

      if (
        visibilityFilter === 'unpublished' &&
        publishedProductIds.has(row.product.id)
      ) {
        return false
      }

      return true
    })
    .sort((a, b) => compareAdminProductRows(a, b, sortValue))
    .map((row, index) => ({
      ...row,
      displayNo: index + 1,
    }))
  const handleResetFilters = () => {
    setCategoryFilter(allFilterLabel)
    setBrandFilter(allFilterLabel)
    setInventoryFilter('all')
    setSaleFilter('all')
    setSortValue('new')
    setVisibilityFilter('all')
  }
  const handleTogglePublished = (productId: number) => {
    setPublishedProductIds((current) => {
      const next = new Set(current)

      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }

      return next
    })
  }

  return (
    <>
      <ProductsPageHeader />

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
              placeholder="商品名・ブランドで検索"
              type="search"
            />
          </label>

          <div className="flex items-center gap-2">
            <Button className="h-11 px-3 lg:hidden" variant="outline">
              <SlidersHorizontalIcon data-icon="inline-start" />
              絞り込み
            </Button>
            <AdminSortSelect onChange={setSortValue} value={sortValue} />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:max-w-xl">
          <AdminFilterSelect
            onChange={setCategoryFilter}
            items={adminCategoryFilterItems}
            label="カテゴリー"
            value={categoryFilter}
          />
          <AdminFilterSelect
            items={adminBrandFilterItems}
            label="ブランド"
            onChange={setBrandFilter}
            value={brandFilter}
          />
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <AdminSegmentedFilter
            label="在庫状態"
            onChange={setInventoryFilter}
            options={inventoryFilterOptions}
            value={inventoryFilter}
          />
          <AdminSegmentedFilter
            label="セール"
            onChange={setSaleFilter}
            options={saleFilterOptions}
            value={saleFilter}
          />
          <AdminSegmentedFilter
            label="公開状態"
            onChange={setVisibilityFilter}
            options={visibilityFilterOptions}
            value={visibilityFilter}
          />
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
      </section>

      <ProductsTable
        onTogglePublished={handleTogglePublished}
        publishedProductIds={publishedProductIds}
        rows={filteredProductRows}
      />
    </>
  )
}

function AdminFilterSelect<TValue extends string>({
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
          className="h-10 w-full cursor-pointer appearance-none rounded-lg border bg-background px-3 pr-9 text-base font-medium outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
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

function AdminSortSelect({
  onChange,
  value,
}: {
  onChange: (value: SortValue) => void
  value: SortValue
}) {
  return (
    <label className="relative block w-44 min-w-0">
      <span className="sr-only">並び替え</span>
      <ArrowUpDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <select
        aria-label="並び替え"
        className="h-11 w-full cursor-pointer appearance-none rounded-lg border bg-background pr-9 pl-10 text-base font-medium outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
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

function AdminSegmentedFilter<TValue extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string
  onChange: (value: TValue) => void
  options: ReadonlyArray<{ label: string; value: TValue; count: number }>
  value: TValue
}) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div
        aria-label={label}
        className="flex min-w-0 rounded-lg border bg-background p-1"
        role="group"
      >
        {options.map((option) => {
          const active = option.value === value

          return (
            <button
              aria-pressed={active ? 'true' : 'false'}
              className={cn(
                'inline-flex h-8 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-medium whitespace-nowrap',
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
                  'text-xs tabular-nums',
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

function ProductsPageHeader() {
  return (
    <section className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
          商品
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button className="h-10 px-3">
          <PlusIcon data-icon="inline-start" />
          商品登録
        </Button>
      </div>
    </section>
  )
}

function ProductsTable({
  onTogglePublished,
  publishedProductIds,
  rows,
}: {
  onTogglePublished: (productId: number) => void
  publishedProductIds: ReadonlySet<number>
  rows: ReadonlyArray<AdminProductRow>
}) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">商品一覧</h2>
        </div>
        <Button className="w-fit" size="sm" variant="outline">
          <PencilIcon data-icon="inline-start" />
          一括編集
        </Button>
      </div>

      <div className="hidden border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground lg:grid lg:grid-cols-[48px_64px_minmax(240px,1.35fr)_104px_112px_72px_112px_88px_36px] lg:items-center lg:gap-3">
        <span>No</span>
        <span>ID</span>
        <span>商品</span>
        <span>カテゴリ</span>
        <span>価格</span>
        <span>在庫</span>
        <span>公開状態</span>
        <span>タグ</span>
        <span aria-hidden="true" />
      </div>

      {rows.length > 0 ? (
        <>
          <div className="hidden divide-y lg:block">
            {rows.map((row) => (
              <ProductTableRow
                key={row.product.id}
                displayNo={row.displayNo}
                isPublished={publishedProductIds.has(row.product.id)}
                onTogglePublished={onTogglePublished}
                product={row.product}
                stock={row.stock}
              />
            ))}
          </div>

          <div className="grid divide-y lg:hidden">
            {rows.map((row) => (
              <ProductMobileCard
                key={row.product.id}
                displayNo={row.displayNo}
                isPublished={publishedProductIds.has(row.product.id)}
                onTogglePublished={onTogglePublished}
                product={row.product}
                stock={row.stock}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="border-t p-6 text-center text-sm text-muted-foreground">
          条件に一致する商品はありません
        </div>
      )}
    </section>
  )
}

function ProductTableRow({
  displayNo,
  isPublished,
  onTogglePublished,
  product,
  stock,
}: {
  displayNo: number
  isPublished: boolean
  onTogglePublished: (productId: number) => void
  product: Product
  stock: number
}) {
  const primaryStatus = getPrimaryProductStatus(product)

  return (
    <article className="grid px-4 py-3 lg:grid-cols-[48px_64px_minmax(240px,1.35fr)_104px_112px_72px_112px_88px_36px] lg:items-center lg:gap-3">
      <p className="text-sm font-medium tabular-nums">{displayNo}</p>
      <p className="text-sm font-medium text-muted-foreground tabular-nums">
        {product.id}
      </p>
      <button
        aria-label={`${product.name}の詳細を開く`}
        className="-m-1 grid min-w-0 cursor-pointer grid-cols-[56px_minmax(0,1fr)] items-center gap-3 rounded-lg p-1 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        type="button"
      >
        <img
          alt=""
          className="aspect-square w-14 rounded-lg bg-muted object-cover"
          src={assetUrl(product.image)}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{product.name}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {product.brand}
          </p>
        </div>
      </button>

      <p className="truncate text-sm">{product.category}</p>
      <ProductPrice product={product} variant="rail" />
      <p className="text-sm tabular-nums">{stock}</p>
      <PublishStateToggle
        isPublished={isPublished}
        onToggle={() => onTogglePublished(product.id)}
        productName={product.name}
      />
      <div className="flex min-w-0">
        <ProductStatusBadge status={primaryStatus} />
      </div>
      <span className="flex justify-center">
        <SelectionCheckbox ariaLabel={`${product.name}を選択`} />
      </span>
    </article>
  )
}

function ProductMobileCard({
  displayNo,
  isPublished,
  onTogglePublished,
  product,
  stock,
}: {
  displayNo: number
  isPublished: boolean
  onTogglePublished: (productId: number) => void
  product: Product
  stock: number
}) {
  const primaryStatus = getPrimaryProductStatus(product)

  return (
    <article className="grid gap-4 p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
        <button
          aria-label={`${product.name}の詳細を開く`}
          className="-m-1 grid min-w-0 cursor-pointer grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-lg p-1 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          type="button"
        >
          <img
            alt=""
            className="aspect-square w-[72px] rounded-lg bg-muted object-cover"
            src={assetUrl(product.image)}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <ProductStatusBadge status={primaryStatus} />
            </div>
            <h2 className="mt-2 line-clamp-2 text-sm leading-5 font-semibold">
              {product.name}
            </h2>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {product.brand} / {product.category}
            </p>
          </div>
        </button>
        <SelectionCheckbox ariaLabel={`${product.name}を選択`} />
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/35 p-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">No</p>
          <p className="mt-1 font-medium tabular-nums">{displayNo}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">ID</p>
          <p className="mt-1 font-medium tabular-nums">{product.id}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">価格</p>
          <ProductPrice className="mt-1" product={product} variant="rail" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">在庫</p>
          <p className="mt-1 font-medium tabular-nums">{stock}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">公開状態</p>
          <div className="mt-1">
            <PublishStateToggle
              isPublished={isPublished}
              onToggle={() => onTogglePublished(product.id)}
              productName={product.name}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

function SelectionCheckbox({ ariaLabel }: { ariaLabel: string }) {
  return (
    <label className="grid size-8 cursor-pointer place-items-center rounded-md hover:bg-accent/55">
      <input
        aria-label={ariaLabel}
        className="size-5 cursor-pointer rounded border-input accent-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        type="checkbox"
      />
    </label>
  )
}

function PublishStateToggle({
  isPublished,
  onToggle,
  productName,
}: {
  isPublished: boolean
  onToggle: () => void
  productName: string
}) {
  return (
    <button
      aria-checked={isPublished}
      aria-label={`${productName}を${isPublished ? '非公開' : '公開'}にする`}
      className={cn(
        'inline-flex h-7 w-[4.5rem] items-center justify-between rounded-full px-1 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
        isPublished
          ? 'bg-primary text-primary-foreground hover:bg-primary/80'
          : 'bg-muted-foreground/55 text-background hover:bg-muted-foreground/65',
      )}
      onClick={onToggle}
      role="switch"
      type="button"
    >
      {isPublished ? (
        <>
          <span className="pl-1.5">公開</span>
          <span
            aria-hidden="true"
            className="size-5 rounded-full bg-background"
          />
        </>
      ) : (
        <>
          <span
            aria-hidden="true"
            className="size-5 rounded-full bg-background"
          />
          <span className="pr-1.5">非公開</span>
        </>
      )}
    </button>
  )
}
