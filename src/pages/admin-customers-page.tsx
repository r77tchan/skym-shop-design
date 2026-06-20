import {
  ArrowUpDownIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  CreditCardIcon,
  DownloadIcon,
  MailIcon,
  MoreHorizontalIcon,
  ReceiptTextIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  UserPlusIcon,
  UsersIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type AdminCustomerSegment = 'VIP' | 'リピーター' | '新規' | '休眠'
type AdminCustomerStatus = '有効' | '要対応' | '配信停止' | '確認中'

type AdminCustomer = {
  id: string
  name: string
  email: string
  prefecture: string
  segment: AdminCustomerSegment
  status: AdminCustomerStatus
  orderCount: number
  totalSpent: string
  lastOrderId: string
  lastOrderedAt: string
  contact: 'メール許可' | '配信停止'
  memo: string
}

const adminCustomers: AdminCustomer[] = [
  {
    id: 'CUST-2048',
    name: 'Mizuki Tanaka',
    email: 'mizuki.tanaka@gmail.com',
    prefecture: '東京都',
    segment: 'VIP',
    status: '有効',
    orderCount: 18,
    totalSpent: '¥86,420',
    lastOrderId: '#SKYM-1028',
    lastOrderedAt: '2026.06.20',
    contact: 'メール許可',
    memo: '限定カラーの購入頻度が高い顧客',
  },
  {
    id: 'CUST-2047',
    name: 'Haruto Sato',
    email: 'haruto.sato@gmail.com',
    prefecture: '神奈川県',
    segment: 'リピーター',
    status: '有効',
    orderCount: 9,
    totalSpent: '¥42,180',
    lastOrderId: '#SKYM-1027',
    lastOrderedAt: '2026.06.20',
    contact: 'メール許可',
    memo: 'プラグ系の再入荷通知を希望',
  },
  {
    id: 'CUST-2046',
    name: 'Yui Kobayashi',
    email: 'yui.kobayashi@gmail.com',
    prefecture: '埼玉県',
    segment: 'リピーター',
    status: '有効',
    orderCount: 6,
    totalSpent: '¥24,640',
    lastOrderId: '#SKYM-1026',
    lastOrderedAt: '2026.06.19',
    contact: 'メール許可',
    memo: 'ネコポス利用が中心',
  },
  {
    id: 'CUST-2045',
    name: 'Ren Suzuki',
    email: 'ren.suzuki@gmail.com',
    prefecture: '千葉県',
    segment: '新規',
    status: '確認中',
    orderCount: 1,
    totalSpent: '¥980',
    lastOrderId: '#SKYM-1025',
    lastOrderedAt: '2026.06.19',
    contact: 'メール許可',
    memo: '決済待ち注文あり',
  },
  {
    id: 'CUST-2044',
    name: 'Aoi Nakamura',
    email: 'aoi.nakamura@gmail.com',
    prefecture: '静岡県',
    segment: 'VIP',
    status: '要対応',
    orderCount: 15,
    totalSpent: '¥71,300',
    lastOrderId: '#SKYM-1024',
    lastOrderedAt: '2026.06.18',
    contact: 'メール許可',
    memo: '返金処理中の注文あり',
  },
  {
    id: 'CUST-2043',
    name: 'Sora Ito',
    email: 'sora.ito@gmail.com',
    prefecture: '愛知県',
    segment: 'リピーター',
    status: '有効',
    orderCount: 7,
    totalSpent: '¥31,760',
    lastOrderId: '#SKYM-1023',
    lastOrderedAt: '2026.06.18',
    contact: 'メール許可',
    memo: '発送済み注文の追跡反映済み',
  },
  {
    id: 'CUST-2042',
    name: 'Kaito Mori',
    email: 'kaito.mori@gmail.com',
    prefecture: '大阪府',
    segment: '休眠',
    status: '配信停止',
    orderCount: 3,
    totalSpent: '¥12,440',
    lastOrderId: '#SKYM-0991',
    lastOrderedAt: '2026.04.12',
    contact: '配信停止',
    memo: '60日以上購入なし',
  },
]

const customerStats = [
  {
    label: '登録顧客',
    value: '186件',
    detail: '購入履歴あり 124件',
    icon: UsersIcon,
    colorClassName: 'bg-primary/10 text-primary',
  },
  {
    label: 'リピーター',
    value: '42件',
    detail: '2回以上購入',
    icon: CheckCircle2Icon,
    colorClassName: 'bg-chart-3/12 text-chart-3',
  },
  {
    label: '今月新規',
    value: '18件',
    detail: '初回購入または会員登録',
    icon: UserPlusIcon,
    colorClassName: 'bg-chart-1/12 text-chart-1',
  },
  {
    label: '要対応',
    value: `${adminCustomers.filter((customer) => customer.status === '要対応' || customer.status === '確認中').length}件`,
    detail: '決済・返金・連絡確認',
    icon: CalendarClockIcon,
    colorClassName: 'bg-chart-5/12 text-chart-5',
  },
]

const quickFilters = [
  {
    label: '全て',
    count: adminCustomers.length,
    active: true,
  },
  {
    label: 'VIP',
    count: adminCustomers.filter((customer) => customer.segment === 'VIP')
      .length,
  },
  {
    label: 'リピーター',
    count: adminCustomers.filter(
      (customer) => customer.segment === 'リピーター',
    ).length,
  },
  {
    label: '新規',
    count: adminCustomers.filter((customer) => customer.segment === '新規')
      .length,
  },
  {
    label: '要対応',
    count: adminCustomers.filter(
      (customer) =>
        customer.status === '要対応' || customer.status === '確認中',
    ).length,
  },
]

function getCustomerSegmentClassName(segment: AdminCustomerSegment) {
  if (segment === 'VIP') {
    return 'bg-chart-4/14 text-chart-4'
  }

  if (segment === 'リピーター') {
    return 'bg-chart-3/12 text-chart-3'
  }

  if (segment === '新規') {
    return 'bg-primary/10 text-primary'
  }

  return 'bg-muted text-muted-foreground'
}

function getCustomerStatusClassName(status: AdminCustomerStatus) {
  if (status === '有効') {
    return 'bg-chart-3/12 text-chart-3'
  }

  if (status === '要対応') {
    return 'bg-chart-5/12 text-chart-5'
  }

  if (status === '確認中') {
    return 'bg-chart-4/14 text-chart-4'
  }

  return 'bg-muted text-muted-foreground'
}

export function AdminCustomersPage() {
  return (
    <>
      <CustomersPageHeader />

      <section
        aria-label="顧客管理の主要指標"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {customerStats.map((stat) => {
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
              aria-label="顧客検索"
              className="bg-background pr-3 pl-10"
              placeholder="顧客名・メールアドレス・注文番号で検索"
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
              最終注文順
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

      <CustomersTable />
    </>
  )
}

function CustomersPageHeader() {
  return (
    <section className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
          顧客管理
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button className="h-10 px-3" variant="outline">
          <DownloadIcon data-icon="inline-start" />
          CSV
        </Button>
        <Button className="h-10 px-3">
          <UserPlusIcon data-icon="inline-start" />
          顧客追加
        </Button>
      </div>
    </section>
  )
}

function CustomersTable() {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">顧客一覧</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {adminCustomers.length}件中 {adminCustomers.length}件を表示
          </p>
        </div>
        <Button className="w-fit" size="sm" variant="outline">
          <MailIcon data-icon="inline-start" />
          連絡対象を確認
        </Button>
      </div>

      <div className="hidden border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground xl:grid xl:grid-cols-[minmax(220px,1.25fr)_96px_108px_112px_120px_112px_36px] xl:items-center xl:gap-3">
        <span>顧客</span>
        <span>セグメント</span>
        <span>注文数</span>
        <span>累計購入</span>
        <span>最終注文</span>
        <span>状態</span>
        <span aria-hidden="true" />
      </div>

      <div className="hidden divide-y xl:block">
        {adminCustomers.map((customer) => (
          <CustomerTableRow customer={customer} key={customer.id} />
        ))}
      </div>

      <div className="grid divide-y xl:hidden">
        {adminCustomers.map((customer) => (
          <CustomerMobileCard customer={customer} key={customer.id} />
        ))}
      </div>
    </section>
  )
}

function CustomerTableRow({ customer }: { customer: AdminCustomer }) {
  return (
    <article className="grid px-4 py-3 xl:grid-cols-[minmax(220px,1.25fr)_96px_108px_112px_120px_112px_36px] xl:items-center xl:gap-3">
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-semibold">{customer.name}</p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {customer.id}
          </span>
        </div>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {customer.email} / {customer.prefecture}
        </p>
      </div>

      <Badge
        className={cn('w-fit', getCustomerSegmentClassName(customer.segment))}
      >
        {customer.segment}
      </Badge>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{customer.orderCount}件</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {customer.lastOrderId}
        </p>
      </div>
      <p className="text-sm font-semibold">{customer.totalSpent}</p>
      <div className="min-w-0">
        <p className="text-sm font-medium">{customer.lastOrderedAt}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {customer.contact}
        </p>
      </div>
      <Badge
        className={cn('w-fit', getCustomerStatusClassName(customer.status))}
      >
        {customer.status}
      </Badge>
      <Button
        aria-label={`${customer.name}の操作`}
        size="icon-sm"
        variant="ghost"
      >
        <MoreHorizontalIcon aria-hidden="true" />
      </Button>
    </article>
  )
}

function CustomerMobileCard({ customer }: { customer: AdminCustomer }) {
  return (
    <article className="grid gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={cn(getCustomerSegmentClassName(customer.segment))}
            >
              {customer.segment}
            </Badge>
            <Badge className={cn(getCustomerStatusClassName(customer.status))}>
              {customer.status}
            </Badge>
          </div>
          <h2 className="mt-2 truncate text-base font-semibold">
            {customer.name}
          </h2>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {customer.email}
          </p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {customer.id}
        </span>
      </div>

      <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
        {customer.memo}
      </p>

      <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/35 p-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">注文数</p>
          <p className="mt-1 font-semibold">{customer.orderCount}件</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">累計購入</p>
          <p className="mt-1 font-semibold">{customer.totalSpent}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">最終注文</p>
          <p className="mt-1 font-medium">{customer.lastOrderedAt}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">地域</p>
          <p className="mt-1 truncate font-medium">{customer.prefecture}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button className="h-9 px-3" variant="outline">
          <ReceiptTextIcon data-icon="inline-start" />
          注文
        </Button>
        <Button className="h-9 px-3" variant="outline">
          <CreditCardIcon data-icon="inline-start" />
          Stripe
        </Button>
      </div>
    </article>
  )
}
