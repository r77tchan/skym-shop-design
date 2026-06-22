import {
  ArrowUpDownIcon,
  CalendarClockIcon,
  ChevronDownIcon,
  CreditCardIcon,
  DownloadIcon,
  MailIcon,
  MoreHorizontalIcon,
  PackageCheckIcon,
  SearchIcon,
  ShoppingCartIcon,
  SlidersHorizontalIcon,
  TruckIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type AdminOrder = {
  id: string
  customer: string
  email: string
  items: string
  itemCount: number
  amount: string
  orderedAt: string
  paymentStatus: '入金確認済' | '決済待ち' | '返金処理中'
  fulfillmentStatus: '発送待ち' | '梱包中' | '発送済み' | '確認待ち'
  paymentMethod: 'Stripe'
  delivery: string
  dueLabel: string
}

const adminOrders: AdminOrder[] = [
  {
    id: '#SKYM-1028',
    customer: 'Mizuki Tanaka',
    email: 'mizuki.tanaka@gmail.com',
    items: 'フォルテ 2.1g ほか2点',
    itemCount: 3,
    amount: '¥4,480',
    orderedAt: '2026.06.20 10:42',
    paymentStatus: '入金確認済',
    fulfillmentStatus: '発送待ち',
    paymentMethod: 'Stripe',
    delivery: '宅急便コンパクト',
    dueLabel: '本日発送',
  },
  {
    id: '#SKYM-1027',
    customer: 'Haruto Sato',
    email: 'haruto.sato@gmail.com',
    items: 'ドリフトスピン 限定カラー',
    itemCount: 1,
    amount: '¥1,280',
    orderedAt: '2026.06.20 09:18',
    paymentStatus: '入金確認済',
    fulfillmentStatus: '梱包中',
    paymentMethod: 'Stripe',
    delivery: 'ネコポス',
    dueLabel: '処理中',
  },
  {
    id: '#SKYM-1026',
    customer: 'Yui Kobayashi',
    email: 'yui.kobayashi@gmail.com',
    items: 'さかさにょろ Slim 35FS',
    itemCount: 1,
    amount: '¥2,640',
    orderedAt: '2026.06.19 18:04',
    paymentStatus: '入金確認済',
    fulfillmentStatus: '発送済み',
    paymentMethod: 'Stripe',
    delivery: 'ネコポス',
    dueLabel: '追跡反映済',
  },
  {
    id: '#SKYM-1025',
    customer: 'Ren Suzuki',
    email: 'ren.suzuki@gmail.com',
    items: 'フック トライアルパック',
    itemCount: 1,
    amount: '¥980',
    orderedAt: '2026.06.19 16:27',
    paymentStatus: '決済待ち',
    fulfillmentStatus: '確認待ち',
    paymentMethod: 'Stripe',
    delivery: '未選択',
    dueLabel: '要確認',
  },
  {
    id: '#SKYM-1024',
    customer: 'Aoi Nakamura',
    email: 'aoi.nakamura@gmail.com',
    items: 'ValkeIN スプーン セット',
    itemCount: 5,
    amount: '¥6,200',
    orderedAt: '2026.06.18 14:11',
    paymentStatus: '返金処理中',
    fulfillmentStatus: '確認待ち',
    paymentMethod: 'Stripe',
    delivery: '宅急便',
    dueLabel: '担当者確認',
  },
  {
    id: '#SKYM-1023',
    customer: 'Sora Ito',
    email: 'sora.ito@gmail.com',
    items: 'JACKALL TapDancer ほか1点',
    itemCount: 2,
    amount: '¥3,760',
    orderedAt: '2026.06.18 11:35',
    paymentStatus: '入金確認済',
    fulfillmentStatus: '発送済み',
    paymentMethod: 'Stripe',
    delivery: '宅急便コンパクト',
    dueLabel: '完了',
  },
]

const orderStats = [
  {
    label: '本日の注文',
    value: '12件',
    detail: 'Stripe決済 12件',
    icon: ShoppingCartIcon,
    colorClassName: 'bg-primary/10 text-primary',
  },
  {
    label: '発送待ち',
    value: `${adminOrders.filter((order) => order.fulfillmentStatus === '発送待ち').length}件`,
    detail: '本日発送対象',
    icon: TruckIcon,
    colorClassName: 'bg-chart-1/12 text-chart-1',
  },
  {
    label: '確認待ち',
    value: `${adminOrders.filter((order) => order.fulfillmentStatus === '確認待ち').length}件`,
    detail: '決済・返金の確認',
    icon: CalendarClockIcon,
    colorClassName: 'bg-chart-5/12 text-chart-5',
  },
  {
    label: '発送済み',
    value: `${adminOrders.filter((order) => order.fulfillmentStatus === '発送済み').length}件`,
    detail: '追跡番号連携済み',
    icon: PackageCheckIcon,
    colorClassName: 'bg-chart-3/12 text-chart-3',
  },
]

const quickFilters = [
  {
    label: '全て',
    count: adminOrders.length,
    active: true,
  },
  {
    label: '発送待ち',
    count: adminOrders.filter((order) => order.fulfillmentStatus === '発送待ち')
      .length,
  },
  {
    label: '確認待ち',
    count: adminOrders.filter((order) => order.fulfillmentStatus === '確認待ち')
      .length,
  },
  {
    label: '発送済み',
    count: adminOrders.filter((order) => order.fulfillmentStatus === '発送済み')
      .length,
  },
  {
    label: '返金',
    count: adminOrders.filter((order) => order.paymentStatus === '返金処理中')
      .length,
  },
]

function getPaymentStatusClassName(status: AdminOrder['paymentStatus']) {
  if (status === '入金確認済') {
    return 'bg-chart-3/12 text-chart-3'
  }

  if (status === '返金処理中') {
    return 'bg-chart-4/14 text-chart-4'
  }

  return 'bg-chart-5/12 text-chart-5'
}

function getFulfillmentStatusClassName(
  status: AdminOrder['fulfillmentStatus'],
) {
  if (status === '発送済み') {
    return 'bg-chart-3/12 text-chart-3'
  }

  if (status === '確認待ち') {
    return 'bg-chart-5/12 text-chart-5'
  }

  if (status === '梱包中') {
    return 'bg-chart-4/14 text-chart-4'
  }

  return 'bg-primary/10 text-primary'
}

export function AdminOrdersPage() {
  return (
    <>
      <OrdersPageHeader />

      <section
        aria-label="注文の主要指標"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {orderStats.map((stat) => {
          const Icon = stat.icon

          return (
            <article
              className="min-w-0 rounded-lg border bg-card p-4"
              key={stat.label}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-heading text-2xl font-semibold">
                    {stat.value}
                  </p>
                </div>
                <span
                  className={cn(
                    'grid size-9 shrink-0 place-items-center rounded-lg',
                    stat.colorClassName,
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </span>
              </div>
              <p className="mt-4 truncate text-xs text-muted-foreground">
                {stat.detail}
              </p>
            </article>
          )
        })}
      </section>

      <section className="grid gap-4 rounded-lg border bg-card p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block min-w-0">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="注文検索"
              className="bg-background pr-3 pl-10"
              placeholder="注文番号・顧客名・メールアドレスで検索"
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
              新しい順
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

      <OrdersTable />
    </>
  )
}

function OrdersPageHeader() {
  return (
    <section className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
          注文
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button className="h-10 px-3" variant="outline">
          <DownloadIcon data-icon="inline-start" />
          CSV
        </Button>
        <Button className="h-10 px-3">
          <TruckIcon data-icon="inline-start" />
          発送処理
        </Button>
      </div>
    </section>
  )
}

function OrdersTable() {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">注文一覧</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {adminOrders.length}件中 {adminOrders.length}件を表示
          </p>
        </div>
        <Button className="w-fit" size="sm" variant="outline">
          <MailIcon data-icon="inline-start" />
          連絡対象を確認
        </Button>
      </div>

      <div className="hidden border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground xl:grid xl:grid-cols-[minmax(132px,0.82fr)_minmax(176px,1.05fr)_minmax(220px,1.25fr)_96px_104px_112px_116px_36px] xl:items-center xl:gap-3">
        <span>注文</span>
        <span>顧客</span>
        <span>内容</span>
        <span>金額</span>
        <span>決済</span>
        <span>発送</span>
        <span>期限</span>
        <span aria-hidden="true" />
      </div>

      <div className="hidden divide-y xl:block">
        {adminOrders.map((order) => (
          <OrderTableRow key={order.id} order={order} />
        ))}
      </div>

      <div className="grid divide-y xl:hidden">
        {adminOrders.map((order) => (
          <OrderMobileCard key={order.id} order={order} />
        ))}
      </div>
    </section>
  )
}

function OrderTableRow({ order }: { order: AdminOrder }) {
  return (
    <article className="grid px-4 py-3 xl:grid-cols-[minmax(132px,0.82fr)_minmax(176px,1.05fr)_minmax(220px,1.25fr)_96px_104px_112px_116px_36px] xl:items-center xl:gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{order.id}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {order.orderedAt}
        </p>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{order.customer}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {order.email}
        </p>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm">{order.items}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {order.itemCount}点 / {order.delivery}
        </p>
      </div>

      <p className="text-sm font-semibold">{order.amount}</p>
      <Badge
        className={cn('w-fit', getPaymentStatusClassName(order.paymentStatus))}
      >
        {order.paymentStatus}
      </Badge>
      <Badge
        className={cn(
          'w-fit',
          getFulfillmentStatusClassName(order.fulfillmentStatus),
        )}
      >
        {order.fulfillmentStatus}
      </Badge>
      <Badge className="w-fit" variant="outline">
        {order.dueLabel}
      </Badge>
      <Button aria-label={`${order.id}の操作`} size="icon-sm" variant="ghost">
        <MoreHorizontalIcon aria-hidden="true" />
      </Button>
    </article>
  )
}

function OrderMobileCard({ order }: { order: AdminOrder }) {
  return (
    <article className="grid gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{order.id}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {order.orderedAt}
          </p>
        </div>
        <Badge className="shrink-0" variant="outline">
          {order.dueLabel}
        </Badge>
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold">{order.customer}</h2>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {order.email}
        </p>
      </div>

      <div className="rounded-lg border bg-muted/35 p-3">
        <p className="line-clamp-2 text-sm font-medium">{order.items}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">金額</p>
            <p className="mt-1 font-semibold">{order.amount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">配送</p>
            <p className="mt-1 truncate font-medium">{order.delivery}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge className={cn(getPaymentStatusClassName(order.paymentStatus))}>
          <CreditCardIcon aria-hidden="true" className="size-3.5" />
          {order.paymentStatus}
        </Badge>
        <Badge
          className={cn(getFulfillmentStatusClassName(order.fulfillmentStatus))}
        >
          <TruckIcon aria-hidden="true" className="size-3.5" />
          {order.fulfillmentStatus}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button className="h-9 px-3" variant="outline">
          <ShoppingCartIcon data-icon="inline-start" />
          詳細
        </Button>
        <Button className="h-9 px-3" variant="outline">
          <TruckIcon data-icon="inline-start" />
          発送
        </Button>
      </div>
    </article>
  )
}
