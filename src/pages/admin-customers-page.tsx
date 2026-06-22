import {
  CheckIcon,
  PencilIcon,
  RotateCcwIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type PurchaseCountFilterValue = 'all' | 'first' | 'repeat'

type AdminCustomer = {
  email: string
  name: string
  orderCount: number
  totalSpent: string
  lastOrderId: number
  lastOrderedAt: string
}

const adminCustomers: AdminCustomer[] = [
  {
    email: 'mizuki.tanaka@gmail.com',
    name: '田中 瑞希',
    orderCount: 4,
    totalSpent: '¥18,640',
    lastOrderId: 1028,
    lastOrderedAt: '2026/06/20 10:42',
  },
  {
    email: 'haruto.sato@gmail.com',
    name: '佐藤 陽翔',
    orderCount: 1,
    totalSpent: '¥1,280',
    lastOrderId: 1027,
    lastOrderedAt: '2026/06/20 09:18',
  },
  {
    email: 'yui.kobayashi@gmail.com',
    name: '小林 結衣',
    orderCount: 3,
    totalSpent: '¥8,420',
    lastOrderId: 1026,
    lastOrderedAt: '2026/06/19 18:04',
  },
  {
    email: 'ren.suzuki@gmail.com',
    name: '鈴木 蓮',
    orderCount: 1,
    totalSpent: '¥980',
    lastOrderId: 1025,
    lastOrderedAt: '2026/06/19 16:27',
  },
  {
    email: 'aoi.nakamura@gmail.com',
    name: '中村 葵',
    orderCount: 6,
    totalSpent: '¥32,700',
    lastOrderId: 1024,
    lastOrderedAt: '2026/06/18 14:11',
  },
  {
    email: 'sora.ito@gmail.com',
    name: '伊藤 空',
    orderCount: 2,
    totalSpent: '¥6,940',
    lastOrderId: 1023,
    lastOrderedAt: '2026/06/18 11:35',
  },
]

const adminCustomerRows = adminCustomers.map((customer, index) => ({
  displayNo: index + 1,
  customer,
}))

type AdminCustomerRow = (typeof adminCustomerRows)[number]

function matchesPurchaseCountFilter(
  row: AdminCustomerRow,
  filterValue: PurchaseCountFilterValue,
) {
  if (filterValue === 'first') {
    return row.customer.orderCount === 1
  }

  if (filterValue === 'repeat') {
    return row.customer.orderCount >= 2
  }

  return true
}

function getFilteredCustomerRows(filterValue: PurchaseCountFilterValue) {
  return adminCustomerRows.filter((row) =>
    matchesPurchaseCountFilter(row, filterValue),
  )
}

export function AdminCustomersPage() {
  const [purchaseCountFilterValue, setPurchaseCountFilterValue] =
    useState<PurchaseCountFilterValue>('all')
  const purchaseCountFilterOptions = [
    {
      label: '全て',
      value: 'all',
      count: getFilteredCustomerRows('all').length,
    },
    {
      label: '初回',
      value: 'first',
      count: getFilteredCustomerRows('first').length,
    },
    {
      label: 'リピーター',
      value: 'repeat',
      count: getFilteredCustomerRows('repeat').length,
    },
  ] as const satisfies ReadonlyArray<{
    label: string
    value: PurchaseCountFilterValue
    count: number
  }>
  const filteredCustomerRows = getFilteredCustomerRows(
    purchaseCountFilterValue,
  ).map((row, index) => ({
    ...row,
    displayNo: index + 1,
  }))
  const handleResetFilters = () => {
    setPurchaseCountFilterValue('all')
  }

  return (
    <>
      <CustomersPageHeader />

      <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block min-w-0">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="顧客検索"
              className="bg-background pr-3 pl-10"
              placeholder="メール・名前で検索"
              type="search"
            />
          </label>

          <div className="flex items-center gap-2">
            <Button className="h-11 px-3 lg:hidden" variant="outline">
              <SlidersHorizontalIcon data-icon="inline-start" />
              絞り込み
            </Button>
          </div>
        </div>

        <CustomerSegmentedFilter
          label="購入回数"
          onChange={setPurchaseCountFilterValue}
          options={purchaseCountFilterOptions}
          value={purchaseCountFilterValue}
        />

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

function CustomerSegmentedFilter<TValue extends string>({
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
        className="flex w-fit max-w-full rounded-lg border bg-background p-0.5"
        role="group"
      >
        {options.map((option) => {
          const active = option.value === value

          return (
            <button
              aria-pressed={active ? 'true' : 'false'}
              className={cn(
                'inline-flex h-7 min-w-18 items-center justify-center gap-1 rounded-md px-2 text-xs font-medium whitespace-nowrap',
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

function CustomersTable({ rows }: { rows: ReadonlyArray<AdminCustomerRow> }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-card [contain:paint]">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">顧客一覧</h2>
        </div>
        <Button className="w-fit" size="sm" variant="outline">
          <PencilIcon data-icon="inline-start" />
          一括編集
        </Button>
      </div>

      <div className="hidden min-w-0 overflow-x-auto lg:block">
        <div className="min-w-[1040px]">
          <div className="grid grid-cols-[48px_minmax(260px,1.25fr)_132px_72px_112px_132px_96px_36px] items-center gap-3 border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>No</span>
            <span>メール</span>
            <span>名前</span>
            <span>注文数</span>
            <span>累計購入</span>
            <span>最終注文</span>
            <span>最終注文ID</span>
            <span aria-hidden="true" />
          </div>

          {rows.length > 0 ? (
            <div className="divide-y">
              {rows.map((row) => (
                <CustomerTableRow key={row.customer.email} row={row} />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="grid divide-y lg:hidden">
          {rows.map((row) => (
            <CustomerMobileCard key={row.customer.email} row={row} />
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
    <article className="grid grid-cols-[48px_minmax(260px,1.25fr)_132px_72px_112px_132px_96px_36px] items-stretch gap-3 px-4">
      <button
        aria-label={`${customer.email} の詳細を開く`}
        className="col-span-7 -mx-1 grid min-w-0 cursor-pointer grid-cols-[48px_minmax(260px,1.25fr)_132px_72px_112px_132px_96px] items-center gap-3 rounded-lg px-1 py-3.5 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        type="button"
      >
        <span className="text-sm font-medium tabular-nums">{displayNo}</span>
        <span className="truncate text-sm font-medium text-muted-foreground">
          {customer.email}
        </span>
        <span className="block min-w-0 truncate text-sm font-semibold">
          {customer.name}
        </span>
        <span className="text-sm tabular-nums">{customer.orderCount}件</span>
        <span className="text-sm font-semibold">{customer.totalSpent}</span>
        <span className="truncate text-sm font-medium">
          {customer.lastOrderedAt}
        </span>
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {customer.lastOrderId}
        </span>
      </button>
      <span className="flex items-center justify-center">
        <SelectionCheckbox ariaLabel={`${customer.email}を選択`} />
      </span>
    </article>
  )
}

function CustomerMobileCard({ row }: { row: AdminCustomerRow }) {
  const { customer, displayNo } = row

  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-stretch gap-3 p-4">
      <button
        aria-label={`${customer.email} の詳細を開く`}
        className="-m-1 grid min-w-0 cursor-pointer gap-3 rounded-lg p-1 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        type="button"
      >
        <span className="grid min-w-0 gap-1">
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            No {displayNo}
          </span>
          <span className="block truncate text-base font-semibold">
            {customer.name}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {customer.email}
          </span>
        </span>

        <span className="grid grid-cols-2 gap-3 text-sm">
          <span className="min-w-0">
            <span className="block text-xs font-medium text-muted-foreground">
              注文数
            </span>
            <span className="mt-1 block font-medium tabular-nums">
              {customer.orderCount}件
            </span>
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-medium text-muted-foreground">
              累計購入
            </span>
            <span className="mt-1 block font-semibold">
              {customer.totalSpent}
            </span>
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-medium text-muted-foreground">
              最終注文
            </span>
            <span className="mt-1 block truncate font-medium">
              {customer.lastOrderedAt}
            </span>
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-medium text-muted-foreground">
              最終注文ID
            </span>
            <span className="mt-1 block font-medium tabular-nums">
              {customer.lastOrderId}
            </span>
          </span>
        </span>
      </button>

      <span className="flex items-start justify-center pt-1">
        <SelectionCheckbox ariaLabel={`${customer.email}を選択`} />
      </span>
    </article>
  )
}

function SelectionCheckbox({ ariaLabel }: { ariaLabel: string }) {
  return (
    <label className="grid size-8 cursor-pointer place-items-center rounded-md hover:bg-accent/55">
      <input aria-label={ariaLabel} className="peer sr-only" type="checkbox" />
      <span className="grid size-5 place-items-center rounded border border-input bg-background text-transparent peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
        <CheckIcon aria-hidden="true" className="size-3.5" />
      </span>
    </label>
  )
}
