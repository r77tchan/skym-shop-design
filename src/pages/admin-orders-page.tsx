import {
  CheckIcon,
  PencilIcon,
  RotateCcwIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type AdminOrder = {
  id: number
  customer: string
  email: string
  itemCount: number
  amount: string
  orderedAt: string
  responseStatus: '未対応' | '対応済み' | 'キャンセル'
}

type OrderStatusFilterValue = 'all' | AdminOrder['responseStatus']

const adminOrders: AdminOrder[] = [
  {
    id: 1028,
    customer: '田中 瑞希',
    email: 'mizuki.tanaka@gmail.com',
    itemCount: 3,
    amount: '¥4,480',
    orderedAt: '2026/06/20 10:42',
    responseStatus: '対応済み',
  },
  {
    id: 1027,
    customer: '佐藤 陽翔',
    email: 'haruto.sato@gmail.com',
    itemCount: 1,
    amount: '¥1,280',
    orderedAt: '2026/06/20 09:18',
    responseStatus: '未対応',
  },
  {
    id: 1026,
    customer: '小林 結衣',
    email: 'yui.kobayashi@gmail.com',
    itemCount: 1,
    amount: '¥2,640',
    orderedAt: '2026/06/19 18:04',
    responseStatus: '対応済み',
  },
  {
    id: 1025,
    customer: '鈴木 蓮',
    email: 'ren.suzuki@gmail.com',
    itemCount: 1,
    amount: '¥980',
    orderedAt: '2026/06/19 16:27',
    responseStatus: '未対応',
  },
  {
    id: 1024,
    customer: '中村 葵',
    email: 'aoi.nakamura@gmail.com',
    itemCount: 5,
    amount: '¥6,200',
    orderedAt: '2026/06/18 14:11',
    responseStatus: 'キャンセル',
  },
  {
    id: 1023,
    customer: '伊藤 空',
    email: 'sora.ito@gmail.com',
    itemCount: 2,
    amount: '¥3,760',
    orderedAt: '2026/06/18 11:35',
    responseStatus: '対応済み',
  },
]

const adminOrderRows = adminOrders.map((order, index) => ({
  displayNo: index + 1,
  order,
}))

type AdminOrderRow = (typeof adminOrderRows)[number]

const quickFilters = [
  {
    label: '全て',
    value: 'all' as const,
    count: adminOrders.length,
  },
  {
    label: '未対応',
    value: '未対応' as const,
    count: adminOrders.filter((order) => order.responseStatus === '未対応')
      .length,
  },
  {
    label: '対応済み',
    value: '対応済み' as const,
    count: adminOrders.filter((order) => order.responseStatus === '対応済み')
      .length,
  },
  {
    label: 'キャンセル',
    value: 'キャンセル' as const,
    count: adminOrders.filter((order) => order.responseStatus === 'キャンセル')
      .length,
  },
] as const

function getResponseStatusClassName(status: AdminOrder['responseStatus']) {
  if (status === '対応済み') {
    return 'bg-muted text-muted-foreground'
  }

  if (status === 'キャンセル') {
    return 'bg-muted text-muted-foreground'
  }

  return 'bg-chart-4/14 text-chart-4'
}

export function AdminOrdersPage() {
  const [statusFilterValue, setStatusFilterValue] =
    useState<OrderStatusFilterValue>('all')
  const handleResetFilters = () => {
    setStatusFilterValue('all')
  }
  const filteredOrderRows =
    statusFilterValue === 'all'
      ? adminOrderRows
      : adminOrderRows.filter(
          (row) => row.order.responseStatus === statusFilterValue,
        )

  return (
    <>
      <OrdersPageHeader />

      <section className="grid gap-4 rounded-lg border bg-card p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] admin-top-nav:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block min-w-0">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="注文検索"
              className="bg-background pr-3 pl-10"
              placeholder="ID・顧客名・メールアドレスで検索"
              type="search"
            />
          </label>

          <div className="flex items-center gap-2">
            <Button
              className="h-11 px-3 lg:hidden admin-top-nav:hidden"
              variant="outline"
            >
              <SlidersHorizontalIcon data-icon="inline-start" />
              絞り込み
            </Button>
          </div>
        </div>

        <div className="grid min-w-0 gap-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            ステータス
          </p>
          <div
            aria-label="ステータス"
            className="flex w-fit max-w-full rounded-lg border bg-background p-0.5"
            role="group"
          >
            {quickFilters.map((filter) => (
              <button
                aria-pressed={
                  filter.value === statusFilterValue ? 'true' : 'false'
                }
                className={cn(
                  'inline-flex h-7 min-w-18 items-center justify-center gap-1 rounded-md px-2 text-xs font-medium whitespace-nowrap',
                  filter.value === statusFilterValue
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent/55 hover:text-foreground',
                )}
                key={filter.value}
                onClick={() => setStatusFilterValue(filter.value)}
                type="button"
              >
                <span className="truncate">{filter.label}</span>
                <span
                  className={cn(
                    'inline-block w-[3ch] shrink-0 text-right text-[0.68rem] tabular-nums',
                    filter.value === statusFilterValue
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

      <OrdersTable rows={filteredOrderRows} />
    </>
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

function OrdersTable({ rows }: { rows: ReadonlyArray<AdminOrderRow> }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-card [contain:paint]">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">注文一覧</h2>
        </div>
        <Button className="w-fit" size="sm" variant="outline">
          <PencilIcon data-icon="inline-start" />
          一括編集
        </Button>
      </div>

      <div className="hidden min-w-0 overflow-x-auto lg:block admin-top-nav:block">
        <div className="min-w-[1080px]">
          <div className="grid grid-cols-[48px_64px_112px_112px_minmax(220px,1fr)_64px_96px_132px_36px] items-center gap-3 border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>No</span>
            <span>ID</span>
            <span>ステータス</span>
            <span>注文者</span>
            <span>メール</span>
            <span>点数</span>
            <span>金額</span>
            <span>注文日時</span>
            <span aria-hidden="true" />
          </div>

          <div className="divide-y">
            {rows.map((row) => (
              <OrderTableRow key={row.order.id} row={row} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid divide-y lg:hidden admin-top-nav:hidden">
        {rows.map((row) => (
          <OrderMobileCard key={row.order.id} row={row} />
        ))}
      </div>
    </section>
  )
}

function OrderTableRow({ row }: { row: AdminOrderRow }) {
  const { displayNo, order } = row

  return (
    <article className="grid grid-cols-[48px_64px_112px_112px_minmax(220px,1fr)_64px_96px_132px_36px] items-stretch gap-3 px-4">
      <button
        aria-label={`注文ID ${order.id} の詳細を開く`}
        className="col-span-8 -mx-1 grid min-w-0 cursor-pointer grid-cols-[48px_64px_112px_112px_minmax(220px,1fr)_64px_96px_132px] items-center gap-3 rounded-lg px-1 py-3.5 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        type="button"
      >
        <span className="text-sm font-medium tabular-nums">{displayNo}</span>
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {order.id}
        </span>
        <Badge
          className={cn(
            'w-fit',
            getResponseStatusClassName(order.responseStatus),
          )}
        >
          {order.responseStatus}
        </Badge>
        <span className="block min-w-0 truncate text-sm font-medium">
          {order.customer}
        </span>
        <span className="truncate text-sm text-muted-foreground">
          {order.email}
        </span>
        <span className="text-sm tabular-nums">{order.itemCount}点</span>
        <span className="text-sm font-semibold">{order.amount}</span>
        <span className="truncate text-sm font-medium">{order.orderedAt}</span>
      </button>
      <span className="flex items-center justify-center">
        <SelectionCheckbox ariaLabel={`${order.id}を選択`} />
      </span>
    </article>
  )
}

function OrderMobileCard({ row }: { row: AdminOrderRow }) {
  const { displayNo, order } = row

  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-stretch gap-3 p-4">
      <button
        aria-label={`注文ID ${order.id} の詳細を開く`}
        className="-m-1 grid min-w-0 cursor-pointer gap-3 rounded-lg p-1 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        type="button"
      >
        <span className="flex min-w-0 items-start justify-between gap-3">
          <span className="grid min-w-0 gap-1">
            <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="tabular-nums">No {displayNo}</span>
              <span aria-hidden="true">/</span>
              <span className="tabular-nums">ID {order.id}</span>
            </span>
            <span className="block truncate text-base font-semibold">
              {order.customer}
            </span>
          </span>
          <Badge
            className={cn(
              'shrink-0',
              getResponseStatusClassName(order.responseStatus),
            )}
          >
            {order.responseStatus}
          </Badge>
        </span>

        <span className="grid min-w-0 gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            メール
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {order.email}
          </span>
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
      </button>

      <span className="flex items-start justify-center pt-1">
        <SelectionCheckbox ariaLabel={`${order.id}を選択`} />
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
