import {
  ArrowUpDownIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ClockIcon,
  MailCheckIcon,
  MailIcon,
  MessageSquareTextIcon,
  MoreHorizontalIcon,
  ReplyIcon,
  SearchIcon,
  SendIcon,
  SlidersHorizontalIcon,
  UserRoundCheckIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type AdminInquiryStatus = '未対応' | '対応中' | '返信済み' | '完了'
type AdminInquiryPriority = '通常' | '高' | '要確認'

type AdminInquiry = {
  id: string
  receivedAt: string
  name: string
  email: string
  topic: string
  subject: string
  summary: string
  orderId: string
  status: AdminInquiryStatus
  priority: AdminInquiryPriority
  assignee: string
  lastUpdatedAt: string
}

const adminInquiries: AdminInquiry[] = [
  {
    id: 'INQ-3088',
    receivedAt: '2026.06.20 11:24',
    name: 'Mizuki Tanaka',
    email: 'mizuki.tanaka@gmail.com',
    topic: '注文・配送について',
    subject: '発送予定日の確認',
    summary:
      '本日注文したフォルテ 2.1g ほか2点の発送予定と追跡番号の反映タイミングを確認したい。',
    orderId: '#SKYM-1028',
    status: '未対応',
    priority: '高',
    assignee: '未設定',
    lastUpdatedAt: '2026.06.20',
  },
  {
    id: 'INQ-3087',
    receivedAt: '2026.06.20 10:08',
    name: 'Haruto Sato',
    email: 'haruto.sato@gmail.com',
    topic: '商品について',
    subject: '限定カラーの再入荷予定',
    summary:
      'ドリフトスピン限定カラーの別カラー再入荷があるか、入荷通知を受け取れるか確認したい。',
    orderId: '-',
    status: '対応中',
    priority: '通常',
    assignee: 'Store Manager',
    lastUpdatedAt: '2026.06.20',
  },
  {
    id: 'INQ-3086',
    receivedAt: '2026.06.19 18:52',
    name: 'Aoi Nakamura',
    email: 'aoi.nakamura@gmail.com',
    topic: '返品・交換について',
    subject: '返金処理の進行状況',
    summary:
      '返金処理中の注文について、Stripe側の返金反映予定日と担当者確認の状況を知りたい。',
    orderId: '#SKYM-1024',
    status: '未対応',
    priority: '要確認',
    assignee: 'Owner',
    lastUpdatedAt: '2026.06.19',
  },
  {
    id: 'INQ-3085',
    receivedAt: '2026.06.19 15:31',
    name: 'Yui Kobayashi',
    email: 'yui.kobayashi@gmail.com',
    topic: '注文・配送について',
    subject: 'ネコポス追跡番号について',
    summary:
      '発送済みメールに記載された追跡番号が配送会社側でまだ反映されていない。',
    orderId: '#SKYM-1026',
    status: '返信済み',
    priority: '通常',
    assignee: 'Store Manager',
    lastUpdatedAt: '2026.06.19',
  },
  {
    id: 'INQ-3084',
    receivedAt: '2026.06.18 12:10',
    name: 'Ren Suzuki',
    email: 'ren.suzuki@gmail.com',
    topic: '注文・配送について',
    subject: '決済完了メールが届かない',
    summary:
      'フック トライアルパックの注文後、決済完了メールが届いていないため状況を確認したい。',
    orderId: '#SKYM-1025',
    status: '対応中',
    priority: '高',
    assignee: 'Owner',
    lastUpdatedAt: '2026.06.19',
  },
  {
    id: 'INQ-3083',
    receivedAt: '2026.06.17 09:42',
    name: 'Sora Ito',
    email: 'sora.ito@gmail.com',
    topic: 'イベント・その他',
    subject: 'イベント販売商品の取り置き',
    summary:
      'SKYM トラウトカップで販売予定の商品について、オンラインでの事前取り置きが可能か知りたい。',
    orderId: '-',
    status: '完了',
    priority: '通常',
    assignee: 'Store Manager',
    lastUpdatedAt: '2026.06.18',
  },
]

const inquiryStats = [
  {
    label: '未対応',
    value: `${adminInquiries.filter((inquiry) => inquiry.status === '未対応').length}件`,
    detail: '返信が必要な問い合わせ',
    icon: MailIcon,
    colorClassName: 'bg-chart-5/12 text-chart-5',
  },
  {
    label: '対応中',
    value: `${adminInquiries.filter((inquiry) => inquiry.status === '対応中').length}件`,
    detail: '担当者が確認中',
    icon: ClockIcon,
    colorClassName: 'bg-chart-4/14 text-chart-4',
  },
  {
    label: '返信済み',
    value: `${adminInquiries.filter((inquiry) => inquiry.status === '返信済み').length}件`,
    detail: '顧客へ一次返信済み',
    icon: MailCheckIcon,
    colorClassName: 'bg-primary/10 text-primary',
  },
  {
    label: '完了',
    value: `${adminInquiries.filter((inquiry) => inquiry.status === '完了').length}件`,
    detail: '対応をクローズ',
    icon: CheckCircle2Icon,
    colorClassName: 'bg-chart-3/12 text-chart-3',
  },
]

const quickFilters = [
  {
    label: '全て',
    count: adminInquiries.length,
    active: true,
  },
  {
    label: '未対応',
    count: adminInquiries.filter((inquiry) => inquiry.status === '未対応')
      .length,
  },
  {
    label: '対応中',
    count: adminInquiries.filter((inquiry) => inquiry.status === '対応中')
      .length,
  },
  {
    label: '高優先',
    count: adminInquiries.filter((inquiry) => inquiry.priority !== '通常')
      .length,
  },
  {
    label: '注文あり',
    count: adminInquiries.filter((inquiry) => inquiry.orderId !== '-').length,
  },
]

function getInquiryStatusClassName(status: AdminInquiryStatus) {
  if (status === '未対応') {
    return 'bg-chart-5/12 text-chart-5'
  }

  if (status === '対応中') {
    return 'bg-chart-4/14 text-chart-4'
  }

  if (status === '返信済み') {
    return 'bg-primary/10 text-primary'
  }

  return 'bg-chart-3/12 text-chart-3'
}

function getInquiryPriorityClassName(priority: AdminInquiryPriority) {
  if (priority === '高') {
    return 'bg-chart-5/12 text-chart-5'
  }

  if (priority === '要確認') {
    return 'bg-chart-4/14 text-chart-4'
  }

  return 'bg-muted text-muted-foreground'
}

export function AdminInquiriesPage() {
  return (
    <>
      <InquiriesPageHeader />

      <section
        aria-label="お問い合わせの主要指標"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {inquiryStats.map((stat) => {
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
              aria-label="問い合わせ検索"
              className="bg-background pr-3 pl-10"
              placeholder="名前・メール・件名・注文番号で検索"
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
              受付日時順
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

      <InquiriesTable />
    </>
  )
}

function InquiriesPageHeader() {
  return (
    <section className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
          お問い合わせ
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button className="h-10 px-3" variant="outline">
          <UserRoundCheckIcon data-icon="inline-start" />
          担当割り当て
        </Button>
        <Button className="h-10 px-3">
          <ReplyIcon data-icon="inline-start" />
          返信作成
        </Button>
      </div>
    </section>
  )
}

function InquiriesTable() {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">
            問い合わせ一覧
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {adminInquiries.length}件中 {adminInquiries.length}件を表示
          </p>
        </div>
        <Button className="w-fit" size="sm" variant="outline">
          <SendIcon data-icon="inline-start" />
          通知メール設定
        </Button>
      </div>

      <div className="hidden border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground xl:grid xl:grid-cols-[minmax(132px,0.8fr)_minmax(176px,1fr)_minmax(260px,1.35fr)_112px_100px_108px_36px] xl:items-center xl:gap-3">
        <span>受付</span>
        <span>顧客</span>
        <span>内容</span>
        <span>注文</span>
        <span>状態</span>
        <span>担当</span>
        <span aria-hidden="true" />
      </div>

      <div className="hidden divide-y xl:block">
        {adminInquiries.map((inquiry) => (
          <InquiryTableRow inquiry={inquiry} key={inquiry.id} />
        ))}
      </div>

      <div className="grid divide-y xl:hidden">
        {adminInquiries.map((inquiry) => (
          <InquiryMobileCard inquiry={inquiry} key={inquiry.id} />
        ))}
      </div>
    </section>
  )
}

function InquiryTableRow({ inquiry }: { inquiry: AdminInquiry }) {
  return (
    <article className="grid px-4 py-3 xl:grid-cols-[minmax(132px,0.8fr)_minmax(176px,1fr)_minmax(260px,1.35fr)_112px_100px_108px_36px] xl:items-center xl:gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{inquiry.id}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {inquiry.receivedAt}
        </p>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{inquiry.name}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {inquiry.email}
        </p>
      </div>

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-semibold">{inquiry.subject}</p>
          <Badge
            className={cn(
              'shrink-0',
              getInquiryPriorityClassName(inquiry.priority),
            )}
          >
            {inquiry.priority}
          </Badge>
        </div>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
          {inquiry.topic} / {inquiry.summary}
        </p>
      </div>

      <Badge className="w-fit" variant="outline">
        {inquiry.orderId}
      </Badge>
      <Badge className={cn('w-fit', getInquiryStatusClassName(inquiry.status))}>
        {inquiry.status}
      </Badge>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{inquiry.assignee}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {inquiry.lastUpdatedAt}
        </p>
      </div>
      <Button aria-label={`${inquiry.id}の操作`} size="icon-sm" variant="ghost">
        <MoreHorizontalIcon aria-hidden="true" />
      </Button>
    </article>
  )
}

function InquiryMobileCard({ inquiry }: { inquiry: AdminInquiry }) {
  return (
    <article className="grid gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn(getInquiryStatusClassName(inquiry.status))}>
              {inquiry.status}
            </Badge>
            <Badge
              className={cn(getInquiryPriorityClassName(inquiry.priority))}
            >
              {inquiry.priority}
            </Badge>
          </div>
          <h2 className="mt-2 line-clamp-2 text-base leading-6 font-semibold">
            {inquiry.subject}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{inquiry.id}</p>
        </div>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{inquiry.name}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {inquiry.email}
        </p>
      </div>

      <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
        {inquiry.summary}
      </p>

      <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/35 p-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">受付日時</p>
          <p className="mt-1 font-medium">{inquiry.receivedAt}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">種別</p>
          <p className="mt-1 truncate font-medium">{inquiry.topic}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">注文番号</p>
          <p className="mt-1 font-medium">{inquiry.orderId}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">担当</p>
          <p className="mt-1 truncate font-medium">{inquiry.assignee}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button className="h-9 px-3" variant="outline">
          <MessageSquareTextIcon data-icon="inline-start" />
          詳細
        </Button>
        <Button className="h-9 px-3" variant="outline">
          <ReplyIcon data-icon="inline-start" />
          返信
        </Button>
      </div>
    </article>
  )
}
