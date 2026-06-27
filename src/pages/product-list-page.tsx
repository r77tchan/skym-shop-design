import {
  ArrowRightIcon,
  ChevronDownIcon,
  CheckIcon,
  RotateCcwIcon,
  SearchIcon,
} from 'lucide-react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router'

import { ProductCard } from '@/components/product-card'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isOnSale, isSoldOut } from '@/lib/product-status'
import {
  getProductBrand,
  getProductCategoryBrands,
  getProductCategoryItemBySlug,
  getProductCategoryPath,
  getProductCategorySpecDefinitions,
  getProductCategory,
  getProductSpecDefinitionValue,
  productBrandItems,
  productBrands,
  productCategoryItems,
  storefrontProducts,
  type Product,
  type ProductBrand,
  type ProductCategory,
  type ProductCategorySpecDefinition,
} from '@/lib/shop-content'
import { cn } from '@/lib/utils'

const allFilterLabel = '全て'
const productPageSize = 12

type StatusFilterValue = 'all' | 'sale'
type CategoryFilterValue = typeof allFilterLabel | ProductCategory
type BrandFilterValue = typeof allFilterLabel | (typeof productBrands)[number]
type SpecFilterState = Record<string, string>
type FilterItem<TValue extends string> = {
  label: string
  value: TValue
  count: number
}

const saleSearchParamValue = 'true'
const filterSearchParamNavigateOptions = {
  preventScrollReset: true,
  replace: true,
  state: { preserveScroll: true },
} as const

const productOrderIndexes = new Map(
  storefrontProducts.map((product, index) => [product.id, index]),
)

function compareOriginalOrder(a: Product, b: Product) {
  return (
    (productOrderIndexes.get(a.id) ?? 0) - (productOrderIndexes.get(b.id) ?? 0)
  )
}

function compareProducts(a: Product, b: Product) {
  const aSoldOut = isSoldOut(a)
  const bSoldOut = isSoldOut(b)

  if (aSoldOut !== bSoldOut) {
    return aSoldOut ? 1 : -1
  }

  return compareOriginalOrder(a, b)
}

type ShopProductFilterState = {
  brandFilter: BrandFilterValue
  categoryFilter: CategoryFilterValue
  searchValue: string
  specFilters: SpecFilterState
  statusFilterValue: StatusFilterValue
}

function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase('ja-JP')
}

function omitSpecFilter(specFilters: SpecFilterState, specKey: string) {
  const nextFilters = { ...specFilters }
  delete nextFilters[specKey]

  return nextFilters
}

function getProductSpecOptionFilterValue(
  specDefinition: ProductCategorySpecDefinition,
  optionValue: string,
) {
  return (
    specDefinition.options?.find(
      (option) => (option.slug ?? option.label) === optionValue,
    )?.label ?? optionValue
  )
}

function getProductBrandBySlug(brandSlug: string | null) {
  return productBrandItems.find((brand) => brand.slug === brandSlug)?.label
}

function getProductBrandSlug(brand: ProductBrand) {
  return productBrandItems.find((item) => item.label === brand)?.slug
}

function getBrandFilterFromSearchParams(
  searchParams: URLSearchParams,
  brandCandidates: readonly ProductBrand[],
): BrandFilterValue {
  const requestedBrand = getProductBrandBySlug(searchParams.get('brand'))

  return requestedBrand && brandCandidates.includes(requestedBrand)
    ? requestedBrand
    : allFilterLabel
}

function getSpecFiltersFromSearchParams(
  searchParams: URLSearchParams,
  specDefinitions: readonly ProductCategorySpecDefinition[],
) {
  const specFilters: SpecFilterState = {}

  for (const specDefinition of specDefinitions) {
    const requestedValue = searchParams.get(specDefinition.slug)

    if (
      requestedValue &&
      specDefinition.options?.some(
        (option) => (option.slug ?? option.label) === requestedValue,
      )
    ) {
      specFilters[specDefinition.slug] = requestedValue
    }
  }

  return specFilters
}

function matchesShopProductFilters(
  product: Product,
  filters: ShopProductFilterState,
) {
  const category = getProductCategory(product)
  const brand = getProductBrand(product)

  if (
    filters.categoryFilter !== allFilterLabel &&
    category !== filters.categoryFilter
  ) {
    return false
  }

  if (filters.brandFilter !== allFilterLabel && brand !== filters.brandFilter) {
    return false
  }

  if (filters.statusFilterValue === 'sale' && !isOnSale(product)) {
    return false
  }

  for (const [specKey, filterValue] of Object.entries(filters.specFilters)) {
    if (!filterValue || filterValue === allFilterLabel) {
      continue
    }

    const specDefinition = getProductCategorySpecDefinitions(category).find(
      (spec) => spec.slug === specKey,
    )
    const specValue = specDefinition
      ? getProductSpecOptionFilterValue(specDefinition, filterValue)
      : filterValue

    if (
      !specDefinition ||
      getProductSpecDefinitionValue(product, specDefinition) !== specValue
    ) {
      return false
    }
  }

  const searchText = normalizeSearchText(filters.searchValue)

  if (searchText) {
    const searchableText = normalizeSearchText(
      [product.name, brand, category, product.catchPhrase].join(' '),
    )

    if (!searchableText.includes(searchText)) {
      return false
    }
  }

  return true
}

function getFilteredProducts(filters: ShopProductFilterState) {
  return storefrontProducts.filter((product) =>
    matchesShopProductFilters(product, filters),
  )
}

function getVisibleProducts(filters: ShopProductFilterState) {
  const filteredProducts = getFilteredProducts(filters)
  return [...filteredProducts].sort(compareProducts)
}

function getPageNumber(pageValue: string | null) {
  const pageNumber = Number(pageValue)

  return Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1
}

function getPagePath(
  basePath: string,
  pageNumber: number,
  searchParams: URLSearchParams,
) {
  const nextSearchParams = new URLSearchParams(searchParams)

  if (pageNumber <= 1) {
    nextSearchParams.delete('page')
  } else {
    nextSearchParams.set('page', String(pageNumber))
  }

  const query = nextSearchParams.toString()

  return query ? `${basePath}?${query}` : basePath
}

function shouldShowFilterItem<TValue extends string>(
  item: Pick<FilterItem<TValue>, 'count' | 'label' | 'value'>,
  activeValue: TValue,
) {
  return (
    item.label === allFilterLabel ||
    item.value === activeValue ||
    item.count > 0
  )
}

export function ProductListPage() {
  const { categorySlug } = useParams()
  const [searchParams] = useSearchParams()

  return (
    <ProductListContent
      categorySlug={categorySlug}
      key={categorySlug ?? 'all'}
      searchParams={searchParams}
    />
  )
}

function ProductListContent({
  categorySlug,
  searchParams,
}: {
  categorySlug?: string
  searchParams: URLSearchParams
}) {
  const [, setSearchParams] = useSearchParams()
  const searchParamKeyword = searchParams.get('keyword') ?? ''
  const [searchValue, setSearchValue] = useState(searchParamKeyword)
  const [loadMoreState, setLoadMoreState] = useState({ count: 1, key: '' })
  const searchCompositionRef = useRef(false)
  const activeCategoryItem = categorySlug
    ? getProductCategoryItemBySlug(categorySlug)
    : undefined
  const hasUnknownCategory = Boolean(categorySlug && !activeCategoryItem)
  const categoryFilter = activeCategoryItem?.label ?? allFilterLabel
  const categoryPath = getProductCategoryPath(activeCategoryItem?.label)
  const activeCategorySpecs = activeCategoryItem
    ? getProductCategorySpecDefinitions(activeCategoryItem.label).filter(
        (spec) =>
          spec.isFilterable &&
          spec.valueType === 'option' &&
          (spec.options?.length ?? 0) > 0,
      )
    : []
  const brandFilterCandidates = activeCategoryItem
    ? getProductCategoryBrands(activeCategoryItem.label)
    : productBrands
  const brandFilter = getBrandFilterFromSearchParams(
    searchParams,
    brandFilterCandidates,
  )
  const specFilters = getSpecFiltersFromSearchParams(
    searchParams,
    activeCategorySpecs,
  )
  const statusFilterValue: StatusFilterValue =
    searchParams.get('sale') === saleSearchParamValue ? 'sale' : 'all'
  const requestedPageNumber = getPageNumber(searchParams.get('page'))

  useEffect(() => {
    if (!searchCompositionRef.current) {
      setSearchValue(searchParamKeyword)
    }
  }, [searchParamKeyword])

  const currentFilters = {
    brandFilter,
    categoryFilter,
    searchValue,
    specFilters,
    statusFilterValue,
  } satisfies ShopProductFilterState
  const loadMoreKey = [
    brandFilter,
    categoryFilter,
    requestedPageNumber,
    searchValue,
    Object.entries(specFilters)
      .map(([key, value]) => `${key}:${value}`)
      .join(','),
    statusFilterValue,
  ].join('|')
  const loadedPageCount =
    loadMoreState.key === loadMoreKey ? loadMoreState.count : 1
  const getFilterCount = (filters: Partial<ShopProductFilterState> = {}) =>
    getFilteredProducts({ ...currentFilters, ...filters }).length
  const statusFilterOptions = (
    [
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
    ] satisfies FilterItem<StatusFilterValue>[]
  ).filter((item) => shouldShowFilterItem(item, statusFilterValue))
  const categoryItemsWithProducts = productCategoryItems.filter(
    (category) =>
      category.label === categoryFilter ||
      getFilteredProducts({
        ...currentFilters,
        brandFilter: allFilterLabel,
        categoryFilter: category.label,
        searchValue: '',
        specFilters: {},
        statusFilterValue: 'all',
      }).length > 0,
  )
  const categoryNavItems = [
    {
      label: allFilterLabel,
      path: '/items',
      value: allFilterLabel,
    },
    ...categoryItemsWithProducts.map((category) => ({
      label: category.label,
      path: getProductCategoryPath(category.label),
      value: category.label,
    })),
  ] satisfies ReadonlyArray<{
    label: string
    path: string
    value: CategoryFilterValue
  }>
  const brandFilterItems = (
    [
      {
        label: allFilterLabel,
        value: allFilterLabel,
        count: getFilteredProducts({
          brandFilter: allFilterLabel,
          categoryFilter,
          searchValue,
          specFilters,
          statusFilterValue,
        }).length,
      },
      ...brandFilterCandidates.map((brand) => {
        const count = getFilteredProducts({
          brandFilter: brand,
          categoryFilter,
          searchValue,
          specFilters,
          statusFilterValue,
        }).length

        return {
          label: brand,
          value: brand,
          count,
        }
      }),
    ] satisfies FilterItem<BrandFilterValue>[]
  ).filter((item) => shouldShowFilterItem(item, brandFilter))
  const visibleProducts = getVisibleProducts(currentFilters)
  const pageCount = Math.max(
    Math.ceil(visibleProducts.length / productPageSize),
    1,
  )
  const currentPageNumber = Math.min(requestedPageNumber, pageCount)
  const firstProductIndex = (currentPageNumber - 1) * productPageSize
  const displayedProductCount = Math.min(
    firstProductIndex + loadedPageCount * productPageSize,
    visibleProducts.length,
  )
  const displayedProducts = visibleProducts.slice(
    firstProductIndex,
    displayedProductCount,
  )
  const hasNextPage = displayedProductCount < visibleProducts.length
  const nextPagePath = getPagePath(
    categoryPath,
    currentPageNumber + loadedPageCount,
    searchParams,
  )
  const purchasableProductCount = visibleProducts.filter(
    (product) => !isSoldOut(product),
  ).length
  const soldOutProductCount = visibleProducts.filter((product) =>
    isSoldOut(product),
  ).length
  const createCanonicalSearchParams = () => {
    const nextSearchParams = new URLSearchParams(searchParams)

    if (brandFilter === allFilterLabel) {
      nextSearchParams.delete('brand')
    } else {
      const brandSlug = getProductBrandSlug(brandFilter)

      if (brandSlug) {
        nextSearchParams.set('brand', brandSlug)
      }
    }

    if (statusFilterValue === 'sale') {
      nextSearchParams.set('sale', saleSearchParamValue)
    } else {
      nextSearchParams.delete('sale')
    }

    for (const spec of activeCategorySpecs) {
      const specValue = specFilters[spec.slug]

      if (specValue) {
        nextSearchParams.set(spec.slug, specValue)
      } else {
        nextSearchParams.delete(spec.slug)
      }
    }

    return nextSearchParams
  }
  const updateFilterSearchParams = (
    updateSearchParams: (nextSearchParams: URLSearchParams) => void,
  ) => {
    const nextSearchParams = createCanonicalSearchParams()

    nextSearchParams.delete('page')
    updateSearchParams(nextSearchParams)

    setSearchParams(nextSearchParams, filterSearchParamNavigateOptions)
  }
  const handleResetFilters = () => {
    setSearchValue('')

    const nextSearchParams = new URLSearchParams(searchParams)

    for (const spec of activeCategorySpecs) {
      nextSearchParams.delete(spec.slug)
    }

    nextSearchParams.delete('brand')
    nextSearchParams.delete('keyword')
    nextSearchParams.delete('page')
    nextSearchParams.delete('sale')

    setSearchParams(nextSearchParams, filterSearchParamNavigateOptions)
  }
  const syncKeywordSearchParam = (value: string) => {
    const nextSearchParams = createCanonicalSearchParams()

    nextSearchParams.delete('page')

    if (value.trim()) {
      nextSearchParams.set('keyword', value)
    } else {
      nextSearchParams.delete('keyword')
    }

    setSearchParams(nextSearchParams, filterSearchParamNavigateOptions)
  }
  const replaceKeywordUrl = (value: string) => {
    const nextUrl = new URL(window.location.href)

    nextUrl.searchParams.delete('page')

    if (value.trim()) {
      nextUrl.searchParams.set('keyword', value)
    } else {
      nextUrl.searchParams.delete('keyword')
    }

    window.history.replaceState(
      window.history.state,
      '',
      `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`,
    )
  }
  const handleSearchChange = (value: string) => {
    setSearchValue(value)

    if (searchCompositionRef.current) {
      replaceKeywordUrl(value)
      return
    }

    syncKeywordSearchParam(value)
  }
  const handleBrandFilterChange = (value: BrandFilterValue) => {
    updateFilterSearchParams((nextSearchParams) => {
      if (value === allFilterLabel) {
        nextSearchParams.delete('brand')
        return
      }

      const brandSlug = getProductBrandSlug(value)

      if (brandSlug) {
        nextSearchParams.set('brand', brandSlug)
      }
    })
  }
  const handleStatusFilterChange = (value: StatusFilterValue) => {
    updateFilterSearchParams((nextSearchParams) => {
      if (value === 'sale') {
        nextSearchParams.set('sale', saleSearchParamValue)
      } else {
        nextSearchParams.delete('sale')
      }
    })
  }
  const handleSpecFilterChange = (specKey: string, value: string) => {
    updateFilterSearchParams((nextSearchParams) => {
      if (value === allFilterLabel) {
        nextSearchParams.delete(specKey)
        return
      }

      nextSearchParams.set(specKey, value)
    })
  }

  const handleLoadMoreClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setLoadMoreState((current) => {
      const currentCount = current.key === loadMoreKey ? current.count : 1

      return {
        count: Math.min(currentCount + 1, pageCount),
        key: loadMoreKey,
      }
    })
  }

  if (hasUnknownCategory) {
    return <Navigate replace to="/items" />
  }

  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />

      <section className="border-b bg-muted/35 pt-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-gutter py-10 sm:py-12">
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
            {categoryFilter === allFilterLabel ? (
              <span className="text-foreground">商品一覧</span>
            ) : (
              <>
                <Link
                  className="underline decoration-foreground/35 underline-offset-4 hover:text-foreground hover:decoration-foreground"
                  to="/items"
                >
                  商品一覧
                </Link>
                <span aria-hidden="true" className="text-border">
                  /
                </span>
                <span className="text-foreground">{categoryFilter}</span>
              </>
            )}
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

      <ProductCategoryNav
        activeValue={categoryFilter}
        items={categoryNavItems}
      />

      <section className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-gutter py-5 lg:py-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
            <div
              className="grid min-w-0 gap-1.5 lg:w-[min(32rem,40vw)]"
              role="search"
            >
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
                  className="bg-card pr-3 pl-10"
                  name="keyword"
                  onCompositionEnd={(event) => {
                    searchCompositionRef.current = false
                    handleSearchChange(event.currentTarget.value)
                  }}
                  onCompositionStart={() => {
                    searchCompositionRef.current = true
                  }}
                  onChange={(event) =>
                    handleSearchChange(event.currentTarget.value)
                  }
                  placeholder="商品名で検索"
                  type="search"
                  value={searchValue}
                />
              </span>
            </div>

            {brandFilterItems.length > 1 || brandFilter !== allFilterLabel ? (
              <FilterSelect
                className="lg:w-52"
                items={brandFilterItems}
                label="ブランド"
                onChange={handleBrandFilterChange}
                value={brandFilter}
              />
            ) : null}

            {statusFilterOptions.length > 1 || statusFilterValue !== 'all' ? (
              <ProductStatusFilter
                options={statusFilterOptions}
                onChange={handleStatusFilterChange}
                value={statusFilterValue}
              />
            ) : null}

            {activeCategoryItem
              ? activeCategorySpecs.map((spec) => {
                  const currentSpecValue =
                    specFilters[spec.slug] ?? allFilterLabel
                  const visibleSpecOptionItems =
                    spec.options
                      ?.map((option) => {
                        const optionValue = option.slug ?? option.label

                        return {
                          label: option.label,
                          value: optionValue,
                          count: getFilteredProducts({
                            ...currentFilters,
                            specFilters: {
                              ...specFilters,
                              [spec.slug]: optionValue,
                            },
                          }).length,
                        }
                      })
                      .filter((item) =>
                        shouldShowFilterItem(item, currentSpecValue),
                      ) ?? []

                  if (
                    visibleSpecOptionItems.length === 0 &&
                    currentSpecValue === allFilterLabel
                  ) {
                    return null
                  }

                  const specFilterItems = [
                    {
                      label: allFilterLabel,
                      value: allFilterLabel,
                      count: getFilteredProducts({
                        ...currentFilters,
                        specFilters: omitSpecFilter(specFilters, spec.slug),
                      }).length,
                    },
                    ...visibleSpecOptionItems,
                  ] satisfies FilterItem<string>[]

                  return (
                    <FilterSelect
                      className="lg:w-48"
                      items={specFilterItems}
                      key={spec.slug}
                      label={spec.label}
                      onChange={(value) =>
                        handleSpecFilterChange(spec.slug, value)
                      }
                      value={currentSpecValue}
                    />
                  )
                })
              : null}

            <div className="flex justify-end lg:justify-start">
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
        </div>
      </section>

      <section id="items">
        <div className="mx-auto grid max-w-7xl gap-6 px-gutter py-8 lg:py-10">
          <div className="grid content-start gap-5">
            <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">
                  {categoryFilter === allFilterLabel
                    ? '全ての商品'
                    : `${categoryFilter}の商品`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  購入可能 {purchasableProductCount}件 / SOLD OUT{' '}
                  {soldOutProductCount}件
                </p>
              </div>
            </div>

            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-6">
                {displayedProducts.map((product) => (
                  <ProductCard
                    detailState={{ fromProductList: true }}
                    key={product.id}
                    product={product}
                  />
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

            <ProductListLoadMore
              hasNextPage={hasNextPage}
              nextPagePath={nextPagePath}
              onLoadMoreClick={handleLoadMoreClick}
              productCount={visibleProducts.length}
            />

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

function ProductCategoryNav({
  activeValue,
  items,
}: {
  activeValue: CategoryFilterValue
  items: ReadonlyArray<{
    label: string
    path: string
    value: CategoryFilterValue
  }>
}) {
  return (
    <section
      className="relative border-b bg-background"
      aria-label="商品カテゴリ"
    >
      <div className="absolute top-0 right-gutter z-10 inline-flex -translate-y-1/2 items-center gap-1 rounded-sm bg-background px-1.5 text-[0.65rem] font-semibold text-muted-foreground/70 sm:hidden">
        <span>SCROLL</span>
        <ArrowRightIcon aria-hidden="true" className="size-3" />
      </div>
      <div className="mx-auto max-w-7xl px-gutter">
        <nav
          aria-label="商品カテゴリ"
          className="-mb-px flex min-w-0 gap-2 overflow-x-auto"
        >
          {items.map((item) => {
            const active = item.value === activeValue

            return (
              <Link
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-14 shrink-0 items-center border-b-2 px-3 text-sm font-semibold whitespace-nowrap sm:min-h-16 sm:px-4 sm:text-base',
                  active
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground',
                )}
                key={item.value}
                preventScrollReset
                state={{ preserveScroll: true }}
                to={item.path}
              >
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </section>
  )
}

function ProductListLoadMore({
  hasNextPage,
  nextPagePath,
  onLoadMoreClick,
  productCount,
}: {
  hasNextPage: boolean
  nextPagePath: string
  onLoadMoreClick: (event: MouseEvent<HTMLAnchorElement>) => void
  productCount: number
}) {
  if (productCount === 0) {
    return null
  }

  return (
    <nav
      aria-label="商品一覧の追加表示"
      className="flex justify-center border-t pt-6"
    >
      {hasNextPage ? (
        <Button asChild className="h-11 min-w-44 px-5">
          <Link onClick={onLoadMoreClick} to={nextPagePath}>
            さらに表示
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      ) : (
        <div className="inline-flex min-h-11 min-w-44 items-center justify-center gap-2 rounded-lg border bg-muted/40 px-5 text-sm font-semibold text-muted-foreground">
          <CheckIcon aria-hidden="true" className="size-4" />
          すべての商品を表示しました
        </div>
      )}
    </nav>
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
      <div className="text-xs font-medium text-muted-foreground">セール</div>
      <div
        aria-label="セール"
        className="flex h-11 w-fit max-w-full rounded-lg border bg-card p-1"
        role="group"
      >
        {options.map((option) => {
          const active = option.value === value

          return (
            <button
              aria-pressed={active ? 'true' : 'false'}
              className={cn(
                'inline-flex h-full min-w-20 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium whitespace-nowrap',
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
    <label className={cn('grid min-w-0 gap-1.5', className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="relative">
        <select
          aria-label={label}
          className="h-11 w-full cursor-pointer appearance-none rounded-lg border bg-card px-3 pr-9 text-sm font-medium outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
