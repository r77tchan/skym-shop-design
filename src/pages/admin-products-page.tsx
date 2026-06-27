import {
  ArrowUpDownIcon,
  ChevronDownIcon,
  PencilIcon,
  PlusIcon,
  RotateCcwIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useState } from 'react'
import { Link } from 'react-router'

import { AdminPageHeader } from '@/components/admin/admin-page-header'
import {
  BulkEditField,
  BulkEditSegmentedControl,
} from '@/components/admin/bulk-edit-field'
import { PublishStateBadge } from '@/components/admin/publish-state-badge'
import { SegmentedFilter } from '@/components/admin/segmented-filter'
import { SelectionCheckbox } from '@/components/admin/selection-checkbox'
import { ProductPrice } from '@/components/product-price'
import { ProductStatusBadge } from '@/components/product-status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { assetUrl } from '@/lib/asset-url'
import {
  getPrimaryProductStatus,
  getProductNewBadgeMode,
  isOnSale,
} from '@/lib/product-status'
import { getProductStock } from '@/lib/product-stock'
import {
  getProductBrand,
  getProductCategory,
  getProductPriceNumber,
  isProductPublished,
  productBrands,
  productCategories,
  products,
  type Product,
  type ProductBrand,
  type ProductCategory,
  type ProductNewBadgeMode,
} from '@/lib/shop-content'
import { cn } from '@/lib/utils'

const allFilterLabel = '全て'

type CategoryFilterValue = (typeof productCategories)[number]
type BrandFilterValue = typeof allFilterLabel | (typeof productBrands)[number]
type InventoryFilterValue = 'all' | 'in-stock' | 'out-of-stock'
type NewBadgeFilterValue = 'all' | ProductNewBadgeMode
type SaleFilterValue = 'all' | 'on-sale' | 'not-sale'
type SortValue = 'new' | 'price-asc' | 'price-desc'
type VisibilityFilterValue = 'all' | 'published' | 'unpublished'

const adminProductRows = products.map((product, index) => {
  return {
    displayNo: index + 1,
    isPublished: isProductPublished(product),
    product,
    stock: getProductStock(product),
  }
})

type AdminProductRow = (typeof adminProductRows)[number]

const productOrderIndexes = new Map(
  adminProductRows.map((row, index) => [row.product.id, index]),
)

const sortOptions: Array<{ label: string; value: SortValue }> = [
  { label: '新着順', value: 'new' },
  { label: '価格の安い順', value: 'price-asc' },
  { label: '価格の高い順', value: 'price-desc' },
]

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

type AdminProductFilterState = {
  brandFilter: BrandFilterValue
  categoryFilter: CategoryFilterValue
  inventoryFilter: InventoryFilterValue
  newBadgeFilter: NewBadgeFilterValue
  saleFilter: SaleFilterValue
  searchValue: string
  visibilityFilter: VisibilityFilterValue
}

function matchesAdminProductFilters(
  row: AdminProductRow,
  filters: AdminProductFilterState,
) {
  const category = getProductCategory(row.product)
  const brand = getProductBrand(row.product)

  if (
    filters.categoryFilter !== allFilterLabel &&
    category !== filters.categoryFilter
  ) {
    return false
  }

  if (filters.brandFilter !== allFilterLabel && brand !== filters.brandFilter) {
    return false
  }

  const searchValue = filters.searchValue.trim().toLocaleLowerCase()

  if (
    searchValue &&
    !row.product.name.toLocaleLowerCase().includes(searchValue)
  ) {
    return false
  }

  if (filters.inventoryFilter === 'in-stock' && row.stock === 0) {
    return false
  }

  if (filters.inventoryFilter === 'out-of-stock' && row.stock > 0) {
    return false
  }

  if (filters.saleFilter === 'on-sale' && !isOnSale(row.product)) {
    return false
  }

  if (filters.saleFilter === 'not-sale' && isOnSale(row.product)) {
    return false
  }

  if (
    filters.newBadgeFilter !== 'all' &&
    getProductNewBadgeMode(row.product) !== filters.newBadgeFilter
  ) {
    return false
  }

  if (filters.visibilityFilter === 'published' && !row.isPublished) {
    return false
  }

  if (filters.visibilityFilter === 'unpublished' && row.isPublished) {
    return false
  }

  return true
}

function getFilteredAdminProductRows(filters: AdminProductFilterState) {
  return adminProductRows.filter((row) =>
    matchesAdminProductFilters(row, filters),
  )
}

export function AdminProductsPage() {
  const [selectedProductIds, setSelectedProductIds] = useState(
    () => new Set<number>(),
  )
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilterValue>(allFilterLabel)
  const [brandFilter, setBrandFilter] =
    useState<BrandFilterValue>(allFilterLabel)
  const [inventoryFilter, setInventoryFilter] =
    useState<InventoryFilterValue>('all')
  const [newBadgeFilter, setNewBadgeFilter] =
    useState<NewBadgeFilterValue>('all')
  const [saleFilter, setSaleFilter] = useState<SaleFilterValue>('all')
  const [searchValue, setSearchValue] = useState('')
  const [sortValue, setSortValue] = useState<SortValue>('new')
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilterValue>('all')
  const currentFilters = {
    brandFilter,
    categoryFilter,
    inventoryFilter,
    newBadgeFilter,
    saleFilter,
    searchValue,
    visibilityFilter,
  } satisfies AdminProductFilterState
  const getFilterCount = (filters: Partial<AdminProductFilterState> = {}) =>
    getFilteredAdminProductRows({ ...currentFilters, ...filters }).length
  const adminCategoryFilterItems = productCategories.map((category) => ({
    label: category,
    value: category,
  })) satisfies ReadonlyArray<{
    label: string
    value: CategoryFilterValue
  }>
  const hasBrandInCurrentCategory = (brand: BrandFilterValue) =>
    getFilteredAdminProductRows({
      brandFilter: brand,
      categoryFilter,
      inventoryFilter: 'all',
      newBadgeFilter: 'all',
      saleFilter: 'all',
      searchValue: '',
      visibilityFilter: 'all',
    }).length > 0
  const adminBrandFilterItems = [
    {
      label: allFilterLabel,
      value: allFilterLabel,
      count: getFilterCount({ brandFilter: allFilterLabel }),
    },
    ...productBrands.flatMap((brand) =>
      brandFilter === brand || hasBrandInCurrentCategory(brand)
        ? [
            {
              label: brand,
              value: brand,
              count: getFilterCount({ brandFilter: brand }),
            },
          ]
        : [],
    ),
  ] satisfies ReadonlyArray<{
    label: string
    value: BrandFilterValue
    count: number
  }>
  const inventoryFilterOptions = [
    {
      label: '全て',
      value: 'all',
      count: getFilterCount({ inventoryFilter: 'all' }),
    },
    {
      label: '在庫あり',
      value: 'in-stock',
      count: getFilterCount({ inventoryFilter: 'in-stock' }),
    },
    {
      label: '在庫なし',
      value: 'out-of-stock',
      count: getFilterCount({ inventoryFilter: 'out-of-stock' }),
    },
  ] as const satisfies ReadonlyArray<{
    label: string
    value: InventoryFilterValue
    count: number
  }>
  const saleFilterOptions = [
    {
      label: '全て',
      value: 'all',
      count: getFilterCount({ saleFilter: 'all' }),
    },
    {
      label: 'セール中',
      value: 'on-sale',
      count: getFilterCount({ saleFilter: 'on-sale' }),
    },
    {
      label: '通常',
      value: 'not-sale',
      count: getFilterCount({ saleFilter: 'not-sale' }),
    },
  ] as const satisfies ReadonlyArray<{
    label: string
    value: SaleFilterValue
    count: number
  }>
  const newBadgeFilterOptions = [
    {
      label: '全て',
      value: 'all',
      count: getFilterCount({ newBadgeFilter: 'all' }),
    },
    {
      label: '自動',
      value: 'auto',
      count: getFilterCount({ newBadgeFilter: 'auto' }),
    },
    {
      label: '表示',
      value: 'show',
      count: getFilterCount({ newBadgeFilter: 'show' }),
    },
    {
      label: '非表示',
      value: 'hide',
      count: getFilterCount({ newBadgeFilter: 'hide' }),
    },
  ] as const satisfies ReadonlyArray<{
    label: string
    value: NewBadgeFilterValue
    count: number
  }>
  const visibilityFilterOptions = [
    {
      label: '全て',
      value: 'all',
      count: getFilterCount({ visibilityFilter: 'all' }),
    },
    {
      label: '公開',
      value: 'published',
      count: getFilterCount({ visibilityFilter: 'published' }),
    },
    {
      label: '非公開',
      value: 'unpublished',
      count: getFilterCount({ visibilityFilter: 'unpublished' }),
    },
  ] as const satisfies ReadonlyArray<{
    label: string
    value: VisibilityFilterValue
    count: number
  }>
  const filteredProductRows = getFilteredAdminProductRows(currentFilters)
    .sort((a, b) => compareAdminProductRows(a, b, sortValue))
    .map((row, index) => ({
      ...row,
      displayNo: index + 1,
    }))
  const visibleSelectedProductCount = filteredProductRows.filter((row) =>
    selectedProductIds.has(row.product.id),
  ).length
  const handleResetFilters = () => {
    setCategoryFilter(allFilterLabel)
    setBrandFilter(allFilterLabel)
    setInventoryFilter('all')
    setNewBadgeFilter('all')
    setSaleFilter('all')
    setSearchValue('')
    setSortValue('new')
    setVisibilityFilter('all')
  }
  const handleProductSelectionChange = (
    productId: number,
    isSelected: boolean,
  ) => {
    setSelectedProductIds((current) => {
      const next = new Set(current)

      if (isSelected) {
        next.add(productId)
      } else {
        next.delete(productId)
      }

      return next
    })
  }

  return (
    <>
      <AdminPageHeader
        action={
          <Button asChild className="h-10 px-3">
            <Link to="/admin/products/new">
              <PlusIcon data-icon="inline-start" />
              商品登録
            </Link>
          </Button>
        }
        title="商品"
      />

      <section className="grid max-w-full min-w-0 grid-cols-[minmax(0,1fr)] overflow-hidden rounded-lg border bg-card">
        <AdminCategoryFilterNav
          activeValue={categoryFilter}
          items={adminCategoryFilterItems}
          onChange={setCategoryFilter}
        />

        <div className="grid w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-4 overflow-hidden p-4">
          <div className="flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end admin-top-nav:flex-row admin-top-nav:flex-wrap admin-top-nav:items-end">
            <label className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-1.5 lg:w-[min(32rem,40vw)] admin-top-nav:w-[min(32rem,40vw)]">
              <span className="text-xs font-medium text-muted-foreground">
                キーワード
              </span>
              <span className="relative block min-w-0">
                <SearchIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  aria-label="商品検索"
                  className="bg-background pr-3 pl-10"
                  onChange={(event) =>
                    setSearchValue(event.currentTarget.value)
                  }
                  placeholder="商品名で検索"
                  type="search"
                  value={searchValue}
                />
              </span>
            </label>

            <AdminFilterSelect
              className="w-full lg:w-52 admin-top-nav:w-52"
              items={adminBrandFilterItems}
              label="ブランド"
              onChange={setBrandFilter}
              value={brandFilter}
            />

            <SegmentedFilter
              variant="wrap"
              label="セール"
              onChange={setSaleFilter}
              options={saleFilterOptions}
              value={saleFilter}
            />

            <AdminSortSelect
              className="w-full lg:w-48 admin-top-nav:w-48"
              onChange={setSortValue}
              value={sortValue}
            />

            <div className="flex justify-end lg:justify-start lg:self-end admin-top-nav:justify-start admin-top-nav:self-end">
              <Button
                className="h-11 px-4 text-sm"
                onClick={handleResetFilters}
                type="button"
                variant="outline"
              >
                <RotateCcwIcon data-icon="inline-start" />
                リセット
              </Button>
            </div>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-3 border-t pt-4 sm:flex-row sm:flex-wrap sm:items-end">
            <SegmentedFilter
              variant="wrap"
              label="公開状態"
              onChange={setVisibilityFilter}
              options={visibilityFilterOptions}
              value={visibilityFilter}
            />
            <SegmentedFilter
              variant="wrap"
              label="NEWタグ"
              onChange={setNewBadgeFilter}
              options={newBadgeFilterOptions}
              value={newBadgeFilter}
            />
            <SegmentedFilter
              variant="wrap"
              label="在庫"
              onChange={setInventoryFilter}
              options={inventoryFilterOptions}
              value={inventoryFilter}
            />
          </div>
        </div>
      </section>

      <ProductsTable
        onProductSelectionChange={handleProductSelectionChange}
        rows={filteredProductRows}
        selectedProductIds={selectedProductIds}
        visibleSelectedProductCount={visibleSelectedProductCount}
      />
    </>
  )
}

function AdminCategoryFilterNav({
  activeValue,
  items,
  onChange,
}: {
  activeValue: CategoryFilterValue
  items: ReadonlyArray<{
    label: string
    value: CategoryFilterValue
  }>
  onChange: (value: CategoryFilterValue) => void
}) {
  return (
    <div className="border-b" aria-label="商品カテゴリ">
      <nav
        aria-label="商品カテゴリ"
        className="-mb-px flex min-w-0 gap-2 overflow-x-auto px-4"
      >
        {items.map((item) => {
          const active = item.value === activeValue

          return (
            <button
              aria-pressed={active ? 'true' : 'false'}
              className={cn(
                'inline-flex min-h-14 shrink-0 items-center border-b-2 px-3 text-sm font-semibold whitespace-nowrap outline-none sm:min-h-16 sm:px-4 sm:text-base',
                active
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground focus-visible:border-primary focus-visible:text-foreground',
              )}
              key={item.value}
              onClick={() => onChange(item.value)}
              type="button"
            >
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function AdminFilterSelect<TValue extends string>({
  className,
  items,
  label,
  onChange,
  value,
}: {
  className?: string
  items: ReadonlyArray<{ label: string; value: TValue; count: number }>
  label: string
  onChange: (value: TValue) => void
  value: TValue
}) {
  return (
    <label
      className={cn(
        'grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1.5',
        className,
      )}
    >
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="relative">
        <select
          aria-label={label}
          className="h-11 w-full cursor-pointer appearance-none rounded-lg border bg-background px-3 pr-9 text-base font-medium outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
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
  className,
  onChange,
  value,
}: {
  className?: string
  onChange: (value: SortValue) => void
  value: SortValue
}) {
  return (
    <label
      className={cn(
        'grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1.5',
        className,
      )}
    >
      <span className="text-xs font-medium text-muted-foreground">
        並び替え
      </span>
      <span className="relative">
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
      </span>
    </label>
  )
}

function ProductsTable({
  onProductSelectionChange,
  rows,
  selectedProductIds,
  visibleSelectedProductCount,
}: {
  onProductSelectionChange: (productId: number, isSelected: boolean) => void
  rows: ReadonlyArray<AdminProductRow>
  selectedProductIds: ReadonlySet<number>
  visibleSelectedProductCount: number
}) {
  const [bulkEditOpen, setBulkEditOpen] = useState(false)
  const selectedRows = rows.filter((row) =>
    selectedProductIds.has(row.product.id),
  )

  return (
    <Dialog.Root onOpenChange={setBulkEditOpen} open={bulkEditOpen}>
      <section className="min-w-0 overflow-hidden rounded-lg border bg-card [contain:paint]">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-heading text-base font-semibold">商品一覧</h2>
          </div>
          <span
            className={cn(
              'inline-flex w-fit',
              visibleSelectedProductCount === 0 && 'cursor-not-allowed',
            )}
          >
            <Button
              className="w-fit"
              disabled={visibleSelectedProductCount === 0}
              onClick={() => setBulkEditOpen(true)}
              size="sm"
              type="button"
              variant="outline"
            >
              <PencilIcon data-icon="inline-start" />
              一括編集
            </Button>
          </span>
        </div>

        <div className="hidden min-w-0 overflow-x-auto lg:block admin-top-nav:block">
          <div className="min-w-[1040px]">
            <div className="grid grid-cols-[48px_64px_minmax(240px,1.35fr)_104px_112px_72px_112px_88px_36px] items-center gap-3 border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
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
              <div className="divide-y">
                {rows.map((row) => (
                  <ProductTableRow
                    key={row.product.id}
                    displayNo={row.displayNo}
                    isPublished={row.isPublished}
                    isSelected={selectedProductIds.has(row.product.id)}
                    onSelectionChange={(isSelected) =>
                      onProductSelectionChange(row.product.id, isSelected)
                    }
                    product={row.product}
                    stock={row.stock}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {rows.length > 0 ? (
          <div className="grid divide-y lg:hidden admin-top-nav:hidden">
            {rows.map((row) => (
              <ProductMobileCard
                key={row.product.id}
                displayNo={row.displayNo}
                isPublished={row.isPublished}
                isSelected={selectedProductIds.has(row.product.id)}
                onSelectionChange={(isSelected) =>
                  onProductSelectionChange(row.product.id, isSelected)
                }
                product={row.product}
                stock={row.stock}
              />
            ))}
          </div>
        ) : (
          <div className="border-t p-6 text-center text-sm text-muted-foreground">
            条件に一致する商品はありません
          </div>
        )}
      </section>

      {bulkEditOpen ? (
        <BulkEditDialogContent selectedRows={selectedRows} />
      ) : null}
    </Dialog.Root>
  )
}

function ProductTableRow({
  displayNo,
  isPublished,
  isSelected,
  onSelectionChange,
  product,
  stock,
}: {
  displayNo: number
  isPublished: boolean
  isSelected: boolean
  onSelectionChange: (isSelected: boolean) => void
  product: Product
  stock: number
}) {
  const primaryStatus = getPrimaryProductStatus(product)
  const brand = getProductBrand(product)
  const category = getProductCategory(product)

  return (
    <article className="grid grid-cols-[48px_64px_minmax(240px,1.35fr)_104px_112px_72px_112px_88px_36px] items-stretch gap-3 px-4">
      <Link
        aria-label={`${product.name}の詳細を開く`}
        className="col-span-8 -mx-1 grid min-w-0 cursor-pointer grid-cols-[48px_64px_minmax(240px,1.35fr)_104px_112px_72px_112px_88px] items-center gap-3 rounded-lg px-1 py-3.5 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        to={`/admin/products/${product.id}`}
      >
        <span className="text-sm font-medium tabular-nums">{displayNo}</span>
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {product.id}
        </span>
        <span className="grid min-w-0 grid-cols-[56px_minmax(0,1fr)] items-center gap-3">
          <img
            alt=""
            className="aspect-square w-14 rounded-lg bg-muted object-cover"
            src={assetUrl(product.image)}
          />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              {product.name}
            </span>
            <span className="mt-1 block truncate text-xs text-muted-foreground">
              {brand}
            </span>
          </span>
        </span>
        <span className="truncate text-sm">{category}</span>
        <ProductPrice product={product} variant="rail" />
        <span className="text-sm tabular-nums">{stock}</span>
        <span className="flex items-center">
          <PublishStateBadge isPublished={isPublished} />
        </span>
        <span className="flex min-w-0 items-center">
          <ProductStatusBadge status={primaryStatus} />
        </span>
      </Link>

      <span className="flex items-center justify-center">
        <SelectionCheckbox
          ariaLabel={`${product.name}を選択`}
          checked={isSelected}
          onCheckedChange={onSelectionChange}
        />
      </span>
    </article>
  )
}

function ProductMobileCard({
  displayNo,
  isPublished,
  isSelected,
  onSelectionChange,
  product,
  stock,
}: {
  displayNo: number
  isPublished: boolean
  isSelected: boolean
  onSelectionChange: (isSelected: boolean) => void
  product: Product
  stock: number
}) {
  const primaryStatus = getPrimaryProductStatus(product)
  const brand = getProductBrand(product)
  const category = getProductCategory(product)

  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 p-4">
      <Link
        aria-label={`${product.name}の詳細を開く`}
        className="-m-1 grid min-w-0 cursor-pointer gap-3 rounded-lg p-1 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        to={`/admin/products/${product.id}`}
      >
        <span className="flex min-w-0 items-start justify-between gap-3">
          <span className="grid min-w-0 gap-1">
            <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="tabular-nums">No {displayNo}</span>
              <span aria-hidden="true">/</span>
              <span className="tabular-nums">ID {product.id}</span>
            </span>
            <span className="block truncate text-base font-semibold">
              {product.name}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {brand}
            </span>
          </span>
          <span className="shrink-0">
            <ProductStatusBadge status={primaryStatus} />
          </span>
        </span>

        <span className="grid min-w-0 grid-cols-[72px_minmax(0,1fr)] gap-3">
          <img
            alt=""
            className="aspect-square w-[72px] rounded-lg bg-muted object-cover"
            src={assetUrl(product.image)}
          />
          <span className="grid min-w-0 grid-cols-2 gap-3 text-sm">
            <span className="min-w-0">
              <span className="block text-xs font-medium text-muted-foreground">
                カテゴリ
              </span>
              <span className="mt-1 block truncate font-medium">
                {category}
              </span>
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-medium text-muted-foreground">
                価格
              </span>
              <ProductPrice className="mt-1" product={product} variant="rail" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-medium text-muted-foreground">
                在庫
              </span>
              <span className="mt-1 block font-medium tabular-nums">
                {stock}
              </span>
            </span>
          </span>
        </span>
      </Link>

      <span className="flex items-start justify-center pt-1">
        <SelectionCheckbox
          ariaLabel={`${product.name}を選択`}
          checked={isSelected}
          onCheckedChange={onSelectionChange}
        />
      </span>

      <div className="col-span-2 flex items-center justify-between gap-3 rounded-lg border bg-muted/35 p-3">
        <p className="text-xs font-medium text-muted-foreground">公開状態</p>
        <PublishStateBadge isPublished={isPublished} />
      </div>
    </article>
  )
}

type BulkVisibilityValue = 'unchanged' | 'published' | 'unpublished'
type BulkNewBadgeValue = 'unchanged' | ProductNewBadgeMode
type BulkSaleValue = 'unchanged' | 'enable' | 'disable'
type BulkSaleDiscountValue = '10' | '20' | '30' | 'custom'
type BulkBrandValue = 'unchanged' | ProductBrand
type BulkCategoryValue = 'unchanged' | ProductCategory

const bulkVisibilityOptions: ReadonlyArray<{
  label: string
  value: BulkVisibilityValue
}> = [
  { label: '変更しない', value: 'unchanged' },
  { label: '公開にする', value: 'published' },
  { label: '非公開にする', value: 'unpublished' },
]

const bulkNewBadgeOptions: ReadonlyArray<{
  label: string
  value: BulkNewBadgeValue
}> = [
  { label: '変更しない', value: 'unchanged' },
  { label: '自動（非表示）', value: 'auto' },
  { label: '表示する', value: 'show' },
  { label: '表示しない', value: 'hide' },
]

const bulkSaleOptions: ReadonlyArray<{
  label: string
  value: BulkSaleValue
}> = [
  { label: '変更しない', value: 'unchanged' },
  { label: 'セールにする', value: 'enable' },
  { label: 'セール解除', value: 'disable' },
]

const bulkSaleDiscountOptions: ReadonlyArray<{
  label: string
  value: BulkSaleDiscountValue
}> = [
  { label: '10%', value: '10' },
  { label: '20%', value: '20' },
  { label: '30%', value: '30' },
  { label: 'カスタム', value: 'custom' },
]

const bulkBrandOptions = productBrands
const bulkCategoryOptions = productCategories.filter(
  (category): category is ProductCategory => category !== allFilterLabel,
)

function BulkEditDialogContent({
  selectedRows,
}: {
  selectedRows: ReadonlyArray<AdminProductRow>
}) {
  const [visibilityValue, setVisibilityValue] =
    useState<BulkVisibilityValue>('unchanged')
  const [newBadgeValue, setNewBadgeValue] =
    useState<BulkNewBadgeValue>('unchanged')
  const [saleValue, setSaleValue] = useState<BulkSaleValue>('unchanged')
  const [saleDiscountValue, setSaleDiscountValue] =
    useState<BulkSaleDiscountValue>('20')
  const [customSaleDiscount, setCustomSaleDiscount] = useState('')
  const [brandValue, setBrandValue] = useState<BulkBrandValue>('unchanged')
  const [categoryValue, setCategoryValue] =
    useState<BulkCategoryValue>('unchanged')
  const selectedCount = selectedRows.length
  const customSaleDiscountNumber = Number(customSaleDiscount)
  const hasSaleValidationError =
    saleValue === 'enable' &&
    saleDiscountValue === 'custom' &&
    !(customSaleDiscountNumber > 0 && customSaleDiscountNumber < 100)
  const hasValidSaleChange =
    saleValue === 'disable' ||
    (saleValue === 'enable' &&
      (saleDiscountValue !== 'custom' ||
        (customSaleDiscountNumber > 0 && customSaleDiscountNumber < 100)))
  const canApply =
    !hasSaleValidationError &&
    (visibilityValue !== 'unchanged' ||
      newBadgeValue !== 'unchanged' ||
      hasValidSaleChange ||
      brandValue !== 'unchanged' ||
      categoryValue !== 'unchanged')

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/45" />
      <Dialog.Content className="fixed top-1/2 left-1/2 z-[80] grid max-h-[calc(100svh-2rem)] w-[min(calc(100vw-2rem),44rem)] -translate-x-1/2 -translate-y-1/2 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-lg border bg-background shadow-2xl outline-none">
        <div className="flex min-w-0 items-start justify-between gap-4 border-b p-5">
          <div className="min-w-0">
            <Dialog.Title className="font-heading text-xl font-semibold">
              一括編集
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
              選択した商品にまとめて反映する項目を選択します。
            </Dialog.Description>
          </div>

          <Dialog.Close asChild>
            <Button
              aria-label="閉じる"
              size="icon"
              type="button"
              variant="ghost"
            >
              <XIcon aria-hidden="true" />
            </Button>
          </Dialog.Close>
        </div>

        <div className="grid min-h-0 min-w-0 gap-5 overflow-y-auto p-5">
          <section className="grid min-w-0 gap-3 rounded-lg border bg-muted/35 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">対象商品</h3>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {selectedCount}件選択中
              </span>
            </div>

            <div className="grid max-h-72 min-w-0 gap-2 overflow-y-auto pr-1">
              {selectedRows.map((row) => (
                <div
                  className="grid min-w-0 grid-cols-[40px_minmax(0,1fr)] items-center gap-3 rounded-lg bg-background p-2"
                  key={row.product.id}
                >
                  <img
                    alt=""
                    className="aspect-square w-10 rounded-md bg-muted object-cover"
                    src={assetUrl(row.product.image)}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {row.product.name}
                    </p>
                    <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span className="truncate">
                        ID {row.product.id} / {getProductBrand(row.product)}
                      </span>
                      <ProductPrice product={row.product} variant="rail" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid min-w-0 gap-4 rounded-lg border p-4">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold">変更内容</h3>
            </div>

            <BulkEditField label="公開状態">
              <BulkEditSegmentedControl
                variant="wrap"
                onChange={setVisibilityValue}
                options={bulkVisibilityOptions}
                value={visibilityValue}
              />
            </BulkEditField>

            <BulkEditField label="NEWタグ">
              <BulkEditSegmentedControl
                variant="wrap"
                onChange={setNewBadgeValue}
                options={bulkNewBadgeOptions}
                value={newBadgeValue}
              />
            </BulkEditField>

            <BulkEditField label="セール">
              <div className="grid min-w-0 gap-3">
                <BulkEditSegmentedControl
                  variant="wrap"
                  onChange={setSaleValue}
                  options={bulkSaleOptions}
                  value={saleValue}
                />

                {saleValue === 'enable' ? (
                  <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
                    <label className="grid min-w-0 gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">
                        割引率
                      </span>
                      <span className="relative block min-w-0">
                        <select
                          className="h-10 w-full cursor-pointer appearance-none rounded-lg border bg-background px-3 pr-9 text-base font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                          onChange={(event) =>
                            setSaleDiscountValue(
                              event.currentTarget
                                .value as BulkSaleDiscountValue,
                            )
                          }
                          value={saleDiscountValue}
                        >
                          {bulkSaleDiscountOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                      </span>
                    </label>

                    <label
                      aria-hidden={saleDiscountValue !== 'custom'}
                      className={cn(
                        'grid min-w-0 gap-1.5',
                        saleDiscountValue !== 'custom' && 'invisible',
                      )}
                    >
                      <span className="text-xs font-medium text-muted-foreground">
                        カスタム割引率
                      </span>
                      <span className="relative block min-w-0">
                        <Input
                          className="pr-9"
                          disabled={saleDiscountValue !== 'custom'}
                          max={99}
                          min={1}
                          onChange={(event) =>
                            setCustomSaleDiscount(event.currentTarget.value)
                          }
                          step={1}
                          tabIndex={saleDiscountValue === 'custom' ? 0 : -1}
                          type="number"
                          value={customSaleDiscount}
                        />
                        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                          %
                        </span>
                      </span>
                    </label>
                  </div>
                ) : null}
              </div>
            </BulkEditField>

            <BulkEditField label="ブランド">
              <BulkEditSelect
                onChange={setBrandValue}
                options={bulkBrandOptions}
                value={brandValue}
              />
            </BulkEditField>

            <BulkEditField label="カテゴリ">
              <BulkEditSelect
                onChange={setCategoryValue}
                options={bulkCategoryOptions}
                value={categoryValue}
              />
            </BulkEditField>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t p-5 sm:flex-row sm:items-center sm:justify-end">
          <Dialog.Close asChild>
            <Button type="button" variant="outline">
              キャンセル
            </Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button disabled={!canApply} type="button">
              変更を適用
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

function BulkEditSelect<TValue extends string>({
  onChange,
  options,
  value,
}: {
  onChange: (value: 'unchanged' | TValue) => void
  options: readonly TValue[]
  value: 'unchanged' | TValue
}) {
  return (
    <span className="relative block min-w-0">
      <select
        className="h-10 w-full cursor-pointer appearance-none rounded-lg border bg-background px-3 pr-9 text-base font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
        onChange={(event) =>
          onChange(event.currentTarget.value as 'unchanged' | TValue)
        }
        value={value}
      >
        <option value="unchanged">変更しない</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </span>
  )
}
