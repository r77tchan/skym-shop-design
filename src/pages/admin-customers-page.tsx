import { RotateCcwIcon, SearchIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  getAdminCustomerRows,
  type AdminCustomerRow,
} from '@/lib/admin-customers'

type AdminCustomerFilterState = {
  searchValue: string
}

const adminCustomerRows = getAdminCustomerRows()

function matchesAdminCustomerFilters(
  row: AdminCustomerRow,
  filters: AdminCustomerFilterState,
) {
  const searchValue = filters.searchValue.trim().toLocaleLowerCase()

  if (
    searchValue &&
    !String(row.customer.id).includes(searchValue) &&
    !row.customer.name.toLocaleLowerCase().includes(searchValue)
  ) {
    return false
  }

  return true
}

function getFilteredAdminCustomerRows(filters: AdminCustomerFilterState) {
  return adminCustomerRows.filter((row) =>
    matchesAdminCustomerFilters(row, filters),
  )
}

export function AdminCustomersPage() {
  const [searchValue, setSearchValue] = useState('')
  const currentFilters = {
    searchValue,
  } satisfies AdminCustomerFilterState
  const filteredCustomerRows = getFilteredAdminCustomerRows(currentFilters).map(
    (row, index) => ({
      ...row,
      displayNo: index + 1,
    }),
  )
  const handleResetFilters = () => {
    setSearchValue('')
  }

  return (
    <>
      <CustomersPageHeader />

      <section className="grid max-w-full min-w-0 grid-cols-[minmax(0,1fr)] overflow-hidden rounded-lg border bg-card">
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
                  aria-label="顧客検索"
                  className="bg-background pr-3 pl-10"
                  onChange={(event) =>
                    setSearchValue(event.currentTarget.value)
                  }
                  placeholder="ID・名前で検索"
                  type="search"
                  value={searchValue}
                />
              </span>
            </label>

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
        </div>
      </section>

      <CustomersTable rows={filteredCustomerRows} />
    </>
  )
}

function CustomersPageHeader() {
  return (
    <section className="border-b pb-5">
      <div className="flex h-10 items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
            顧客
          </h1>
        </div>
      </div>
    </section>
  )
}

function CustomersTable({ rows }: { rows: ReadonlyArray<AdminCustomerRow> }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-card [contain:paint]">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">顧客一覧</h2>
        </div>
      </div>

      <div className="hidden min-w-0 overflow-x-auto lg:block admin-top-nav:block">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[48px_64px_minmax(320px,1fr)_160px] items-center gap-3 border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>No</span>
            <span>ID</span>
            <span>名前</span>
            <span>最終注文日時</span>
          </div>

          {rows.length > 0 ? (
            <div className="divide-y">
              {rows.map((row) => (
                <CustomerTableRow key={row.customer.id} row={row} />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="grid divide-y lg:hidden admin-top-nav:hidden">
          {rows.map((row) => (
            <CustomerMobileCard key={row.customer.id} row={row} />
          ))}
        </div>
      ) : (
        <div className="border-t p-6 text-center text-sm text-muted-foreground">
          条件に一致する顧客はありません
        </div>
      )}
    </section>
  )
}

function CustomerTableRow({ row }: { row: AdminCustomerRow }) {
  const { customer, displayNo } = row

  return (
    <Link
      aria-label={`顧客ID ${customer.id} の詳細を開く`}
      className="grid grid-cols-[48px_64px_minmax(320px,1fr)_160px] items-center gap-3 px-4 py-3.5 outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      to={`/admin/customers/${customer.id}`}
    >
      <span className="text-sm font-medium tabular-nums">{displayNo}</span>
      <span className="text-sm font-medium text-muted-foreground tabular-nums">
        {customer.id}
      </span>
      <span className="block min-w-0 truncate text-sm font-semibold">
        {customer.name}
      </span>
      <span className="truncate text-sm font-medium">
        {customer.lastOrderedAt}
      </span>
    </Link>
  )
}

function CustomerMobileCard({ row }: { row: AdminCustomerRow }) {
  const { customer, displayNo } = row

  return (
    <Link
      aria-label={`顧客ID ${customer.id} の詳細を開く`}
      className="grid min-w-0 gap-3 p-4 outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      to={`/admin/customers/${customer.id}`}
    >
      <div className="grid min-w-0 gap-1">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="tabular-nums">No {displayNo}</span>
          <span aria-hidden="true">/</span>
          <span className="tabular-nums">ID {customer.id}</span>
        </div>
        <p className="block truncate text-base font-semibold">
          {customer.name}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm">
        <span className="min-w-0">
          <span className="block text-xs font-medium text-muted-foreground">
            最終注文日時
          </span>
          <span className="mt-1 block truncate font-medium">
            {customer.lastOrderedAt}
          </span>
        </span>
      </div>
    </Link>
  )
}
