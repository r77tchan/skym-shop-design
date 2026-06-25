import {
  CheckIcon,
  PencilIcon,
  RotateCcwIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  getAdminOrderRows,
  getAdminOrderStatusClassName,
  type AdminOrder,
  type AdminOrderRow,
} from '@/lib/admin-orders'
import { cn } from '@/lib/utils'

type OrderStatusFilterValue = 'all' | AdminOrder['responseStatus']

const adminOrderRows = getAdminOrderRows()

const orderStatusFilterOptions = [
  {
    label: '全て',
    value: 'all' as const,
  },
  {
    label: '未対応',
    value: '未対応' as const,
  },
  {
    label: '対応済み',
    value: '対応済み' as const,
  },
  {
    label: 'キャンセル',
    value: 'キャンセル' as const,
  },
] as const

type AdminOrderFilterState = {
  searchValue: string
  statusFilterValue: OrderStatusFilterValue
}

function matchesAdminOrderFilters(
  row: AdminOrderRow,
  filters: AdminOrderFilterState,
) {
  if (
    filters.statusFilterValue !== 'all' &&
    row.order.responseStatus !== filters.statusFilterValue
  ) {
    return false
  }

  const searchValue = filters.searchValue.trim().toLocaleLowerCase()

  if (
    searchValue &&
    !String(row.order.id).includes(searchValue) &&
    !row.order.orderNumber.toLocaleLowerCase().includes(searchValue) &&
    !row.order.customer.toLocaleLowerCase().includes(searchValue)
  ) {
    return false
  }

  return true
}

function getFilteredAdminOrderRows(filters: AdminOrderFilterState) {
  return adminOrderRows.filter((row) => matchesAdminOrderFilters(row, filters))
}

export function AdminOrdersPage() {
  const [selectedOrderIds, setSelectedOrderIds] = useState(
    () => new Set<number>(),
  )
  const [searchValue, setSearchValue] = useState('')
  const [statusFilterValue, setStatusFilterValue] =
    useState<OrderStatusFilterValue>('all')
  const currentFilters = {
    searchValue,
    statusFilterValue,
  } satisfies AdminOrderFilterState
  const getFilterCount = (filters: Partial<AdminOrderFilterState> = {}) =>
    getFilteredAdminOrderRows({ ...currentFilters, ...filters }).length
  const statusFilterOptions = orderStatusFilterOptions.map((option) => ({
    ...option,
    count: getFilterCount({ statusFilterValue: option.value }),
  }))
  const filteredOrderRows = getFilteredAdminOrderRows(currentFilters).map(
    (row, index) => ({
      ...row,
      displayNo: index + 1,
    }),
  )
  const visibleSelectedOrderCount = filteredOrderRows.filter((row) =>
    selectedOrderIds.has(row.order.id),
  ).length
  const handleResetFilters = () => {
    setSearchValue('')
    setStatusFilterValue('all')
  }
  const handleOrderSelectionChange = (orderId: number, isSelected: boolean) => {
    setSelectedOrderIds((current) => {
      const next = new Set(current)

      if (isSelected) {
        next.add(orderId)
      } else {
        next.delete(orderId)
      }

      return next
    })
  }

  return (
    <>
      <OrdersPageHeader />

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
                  aria-label="注文検索"
                  className="bg-background pr-3 pl-10"
                  onChange={(event) =>
                    setSearchValue(event.currentTarget.value)
                  }
                  placeholder="ID・注文番号・注文者名で検索"
                  type="search"
                  value={searchValue}
                />
              </span>
            </label>

            <OrderSegmentedFilter
              label="ステータス"
              onChange={setStatusFilterValue}
              options={statusFilterOptions}
              value={statusFilterValue}
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
        </div>
      </section>

      <OrdersTable
        onOrderSelectionChange={handleOrderSelectionChange}
        rows={filteredOrderRows}
        selectedOrderIds={selectedOrderIds}
        visibleSelectedOrderCount={visibleSelectedOrderCount}
      />
    </>
  )
}

function OrderSegmentedFilter<TValue extends string>({
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
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div
        aria-label={label}
        className="grid h-11 w-full max-w-full grid-cols-4 rounded-lg border bg-background p-1 sm:w-fit"
        role="group"
      >
        {options.map((option) => {
          const active = option.value === value

          return (
            <button
              aria-pressed={active ? 'true' : 'false'}
              className={cn(
                'inline-flex h-full min-w-0 items-center justify-center gap-1 rounded-md px-1.5 text-xs font-medium whitespace-nowrap sm:min-w-20 sm:gap-1.5 sm:px-3 sm:text-sm',
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
                  'inline-block w-[2ch] shrink-0 text-right text-[0.68rem] tabular-nums sm:w-[3ch]',
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

function OrdersPageHeader() {
  return (
    <section className="border-b pb-5">
      <div className="flex h-10 items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
            注文
          </h1>
        </div>
      </div>
    </section>
  )
}

function OrdersTable({
  onOrderSelectionChange,
  rows,
  selectedOrderIds,
  visibleSelectedOrderCount,
}: {
  onOrderSelectionChange: (orderId: number, isSelected: boolean) => void
  rows: ReadonlyArray<AdminOrderRow>
  selectedOrderIds: ReadonlySet<number>
  visibleSelectedOrderCount: number
}) {
  const [bulkEditOpen, setBulkEditOpen] = useState(false)
  const selectedRows = rows.filter((row) => selectedOrderIds.has(row.order.id))

  return (
    <Dialog.Root onOpenChange={setBulkEditOpen} open={bulkEditOpen}>
      <section className="min-w-0 overflow-hidden rounded-lg border bg-card [contain:paint]">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-heading text-base font-semibold">注文一覧</h2>
          </div>
          <span
            className={cn(
              'inline-flex w-fit',
              visibleSelectedOrderCount === 0 && 'cursor-not-allowed',
            )}
          >
            <Button
              className="w-fit"
              disabled={visibleSelectedOrderCount === 0}
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
            <div className="grid grid-cols-[48px_64px_112px_144px_72px_104px_132px_minmax(168px,1fr)_36px] items-center gap-3 border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
              <span>No</span>
              <span>ID</span>
              <span>ステータス</span>
              <span>注文者</span>
              <span>点数</span>
              <span>金額</span>
              <span>注文日時</span>
              <span>注文番号</span>
              <span aria-hidden="true" />
            </div>

            {rows.length > 0 ? (
              <div className="divide-y">
                {rows.map((row) => (
                  <OrderTableRow
                    isSelected={selectedOrderIds.has(row.order.id)}
                    key={row.order.id}
                    onSelectionChange={(isSelected) =>
                      onOrderSelectionChange(row.order.id, isSelected)
                    }
                    row={row}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {rows.length > 0 ? (
          <div className="grid divide-y lg:hidden admin-top-nav:hidden">
            {rows.map((row) => (
              <OrderMobileCard
                isSelected={selectedOrderIds.has(row.order.id)}
                key={row.order.id}
                onSelectionChange={(isSelected) =>
                  onOrderSelectionChange(row.order.id, isSelected)
                }
                row={row}
              />
            ))}
          </div>
        ) : (
          <div className="border-t p-6 text-center text-sm text-muted-foreground">
            条件に一致する注文はありません
          </div>
        )}
      </section>

      {bulkEditOpen ? (
        <BulkEditDialogContent selectedRows={selectedRows} />
      ) : null}
    </Dialog.Root>
  )
}

type BulkOrderStatusValue = 'unchanged' | AdminOrder['responseStatus']

const bulkOrderStatusOptions: ReadonlyArray<{
  label: string
  value: BulkOrderStatusValue
}> = [
  { label: '変更しない', value: 'unchanged' },
  { label: '未対応', value: '未対応' },
  { label: '対応済み', value: '対応済み' },
  { label: 'キャンセル', value: 'キャンセル' },
]

function BulkEditDialogContent({
  selectedRows,
}: {
  selectedRows: ReadonlyArray<AdminOrderRow>
}) {
  const [statusValue, setStatusValue] =
    useState<BulkOrderStatusValue>('unchanged')
  const selectedCount = selectedRows.length
  const canApply = statusValue !== 'unchanged'

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/45" />
      <Dialog.Content className="fixed top-1/2 left-1/2 z-[80] grid max-h-[calc(100svh-2rem)] w-[min(calc(100vw-2rem),40rem)] -translate-x-1/2 -translate-y-1/2 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-lg border bg-background shadow-2xl outline-none">
        <div className="flex min-w-0 items-start justify-between gap-4 border-b p-5">
          <div className="min-w-0">
            <Dialog.Title className="font-heading text-xl font-semibold">
              一括編集
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
              選択した注文にまとめて反映する項目を選択します。
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
              <h3 className="text-sm font-semibold">対象注文</h3>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {selectedCount}件選択中
              </span>
            </div>

            <div className="grid max-h-72 min-w-0 gap-2 overflow-y-auto pr-1">
              {selectedRows.map((row) => (
                <div
                  className="grid min-w-0 gap-2 rounded-lg bg-background p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  key={row.order.id}
                >
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-muted-foreground">
                      <span className="tabular-nums">No {row.displayNo}</span>
                      <span aria-hidden="true">/</span>
                      <span className="tabular-nums">ID {row.order.id}</span>
                      <span aria-hidden="true">/</span>
                      <span className="tabular-nums">
                        {row.order.orderNumber}
                      </span>
                      <span aria-hidden="true">/</span>
                      <span className="tabular-nums">
                        {row.order.orderedAt}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm font-semibold">
                      {row.order.customer}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    <Badge
                      className={cn(
                        'w-fit',
                        getAdminOrderStatusClassName(row.order.responseStatus),
                      )}
                    >
                      {row.order.responseStatus}
                    </Badge>
                    <span className="text-sm font-semibold">
                      {row.order.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid min-w-0 gap-4 rounded-lg border p-4">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold">変更内容</h3>
            </div>

            <BulkEditField label="ステータス">
              <BulkEditSegmentedControl
                onChange={setStatusValue}
                options={bulkOrderStatusOptions}
                value={statusValue}
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

function BulkEditField({
  children,
  label,
}: {
  children: ReactNode
  label: string
}) {
  return (
    <div className="grid min-w-0 gap-2 lg:grid-cols-[112px_minmax(0,1fr)] lg:items-start">
      <p className="pt-2 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

function BulkEditSegmentedControl<TValue extends string>({
  onChange,
  options,
  value,
}: {
  onChange: (value: TValue) => void
  options: ReadonlyArray<{ label: string; value: TValue }>
  value: TValue
}) {
  return (
    <div className="grid w-full max-w-full grid-cols-2 gap-1 rounded-lg border bg-background p-1 sm:flex sm:w-fit">
      {options.map((option) => {
        const active = option.value === value

        return (
          <button
            aria-pressed={active ? 'true' : 'false'}
            className={cn(
              'inline-flex h-8 min-w-0 items-center justify-center rounded-md px-2 text-xs font-medium whitespace-nowrap sm:min-w-20',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function OrderTableRow({
  isSelected,
  onSelectionChange,
  row,
}: {
  isSelected: boolean
  onSelectionChange: (isSelected: boolean) => void
  row: AdminOrderRow
}) {
  const { displayNo, order } = row

  return (
    <article className="grid grid-cols-[48px_64px_112px_144px_72px_104px_132px_minmax(168px,1fr)_36px] items-stretch gap-3 px-4">
      <Link
        aria-label={`ID ${order.id}、注文番号 ${order.orderNumber} の詳細を開く`}
        className="col-span-8 -mx-1 grid min-w-0 cursor-pointer grid-cols-[48px_64px_112px_144px_72px_104px_132px_minmax(168px,1fr)] items-center gap-3 rounded-lg px-1 py-3.5 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        to={`/admin/orders/${order.id}`}
      >
        <span className="text-sm font-medium tabular-nums">{displayNo}</span>
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {order.id}
        </span>
        <Badge
          className={cn(
            'w-fit',
            getAdminOrderStatusClassName(order.responseStatus),
          )}
        >
          {order.responseStatus}
        </Badge>
        <span className="block min-w-0 truncate text-sm font-medium">
          {order.customer}
        </span>
        <span className="text-sm tabular-nums">{order.itemCount}点</span>
        <span className="text-sm font-semibold">{order.amount}</span>
        <span className="truncate text-sm font-medium">{order.orderedAt}</span>
        <span className="truncate text-sm font-medium text-muted-foreground tabular-nums">
          {order.orderNumber}
        </span>
      </Link>
      <span className="flex items-center justify-center">
        <SelectionCheckbox
          ariaLabel={`ID ${order.id}、注文番号 ${order.orderNumber}を選択`}
          checked={isSelected}
          onCheckedChange={onSelectionChange}
        />
      </span>
    </article>
  )
}

function OrderMobileCard({
  isSelected,
  onSelectionChange,
  row,
}: {
  isSelected: boolean
  onSelectionChange: (isSelected: boolean) => void
  row: AdminOrderRow
}) {
  const { displayNo, order } = row

  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-stretch gap-3 p-4">
      <Link
        aria-label={`ID ${order.id}、注文番号 ${order.orderNumber} の詳細を開く`}
        className="-m-1 grid min-w-0 cursor-pointer gap-3 rounded-lg p-1 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        to={`/admin/orders/${order.id}`}
      >
        <span className="flex min-w-0 items-start justify-between gap-3">
          <span className="grid min-w-0 gap-1">
            <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="tabular-nums">No {displayNo}</span>
              <span aria-hidden="true">/</span>
              <span className="tabular-nums">ID {order.id}</span>
            </span>
            <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
              <span>注文番号</span>
              <span className="tabular-nums">{order.orderNumber}</span>
            </span>
            <span className="block truncate text-base font-semibold">
              {order.customer}
            </span>
          </span>
          <Badge
            className={cn(
              'shrink-0',
              getAdminOrderStatusClassName(order.responseStatus),
            )}
          >
            {order.responseStatus}
          </Badge>
        </span>

        <span className="grid grid-cols-3 gap-3 text-sm">
          <span className="min-w-0">
            <span className="block text-xs font-medium text-muted-foreground">
              点数
            </span>
            <span className="mt-1 block font-medium tabular-nums">
              {order.itemCount}点
            </span>
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-medium text-muted-foreground">
              金額
            </span>
            <span className="mt-1 block font-semibold">{order.amount}</span>
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-medium text-muted-foreground">
              注文日時
            </span>
            <span className="mt-1 block truncate font-medium">
              {order.orderedAt}
            </span>
          </span>
        </span>
      </Link>

      <span className="flex items-start justify-center pt-1">
        <SelectionCheckbox
          ariaLabel={`ID ${order.id}、注文番号 ${order.orderNumber}を選択`}
          checked={isSelected}
          onCheckedChange={onSelectionChange}
        />
      </span>
    </article>
  )
}

function SelectionCheckbox({
  ariaLabel,
  checked,
  onCheckedChange,
}: {
  ariaLabel: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label className="grid size-8 cursor-pointer place-items-center rounded-md hover:bg-accent/55">
      <input
        aria-label={ariaLabel}
        checked={checked}
        className="peer sr-only"
        onChange={(event) => onCheckedChange(event.currentTarget.checked)}
        type="checkbox"
      />
      <span className="grid size-5 place-items-center rounded border border-input bg-background text-transparent peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
        <CheckIcon aria-hidden="true" className="size-3.5" />
      </span>
    </label>
  )
}
