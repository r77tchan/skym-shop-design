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

type AdminInquiryStatus = '未対応' | '対応中' | '対応済み'

type AdminInquiry = {
  id: number
  status: AdminInquiryStatus
  name: string
  email: string
  category: string
  subject: string
  summary: string
  receivedAt: string
}

type InquiryStatusFilterValue = 'all' | AdminInquiryStatus

const adminInquiries: AdminInquiry[] = [
  {
    id: 3088,
    status: '未対応',
    name: '田中 瑞希',
    email: 'mizuki.tanaka@gmail.com',
    category: '注文・配送',
    subject: '発送予定日の確認',
    summary:
      '本日注文したフォルテ 2.1g ほか2点の発送予定と追跡番号の反映タイミングを確認したい。',
    receivedAt: '2026/06/20 11:24',
  },
  {
    id: 3087,
    status: '対応中',
    name: '佐藤 陽翔',
    email: 'haruto.sato@gmail.com',
    category: '商品',
    subject: '限定カラーの再入荷予定',
    summary:
      'ドリフトスピン限定カラーの別カラー再入荷があるか、入荷通知を受け取れるか確認したい。',
    receivedAt: '2026/06/20 10:08',
  },
  {
    id: 3086,
    status: '未対応',
    name: '中村 葵',
    email: 'aoi.nakamura@gmail.com',
    category: '返品・交換',
    subject: '返金処理の進行状況',
    summary:
      '返金処理中の注文について、返金反映予定日と担当者確認の状況を知りたい。',
    receivedAt: '2026/06/19 18:52',
  },
  {
    id: 3085,
    status: '対応済み',
    name: '小林 結衣',
    email: 'yui.kobayashi@gmail.com',
    category: '注文・配送',
    subject: 'ネコポス追跡番号について',
    summary:
      '発送済みメールに記載された追跡番号が配送会社側でまだ反映されていない。',
    receivedAt: '2026/06/19 15:31',
  },
  {
    id: 3084,
    status: '対応中',
    name: '鈴木 蓮',
    email: 'ren.suzuki@gmail.com',
    category: '決済',
    subject: '決済完了メールが届かない',
    summary:
      'フック トライアルパックの注文後、決済完了メールが届いていないため状況を確認したい。',
    receivedAt: '2026/06/18 12:10',
  },
  {
    id: 3083,
    status: '対応済み',
    name: '伊藤 空',
    email: 'sora.ito@gmail.com',
    category: 'イベント',
    subject: 'イベント販売商品の取り置き',
    summary:
      'SKYM トラウトカップで販売予定の商品について、オンラインでの事前取り置きが可能か知りたい。',
    receivedAt: '2026/06/17 09:42',
  },
]

const adminInquiryRows = adminInquiries.map((inquiry, index) => ({
  displayNo: index + 1,
  inquiry,
}))

type AdminInquiryRow = (typeof adminInquiryRows)[number]

const statusFilterOptions = [
  {
    label: '全て',
    value: 'all' as const,
    count: adminInquiries.length,
  },
  {
    label: '未対応',
    value: '未対応' as const,
    count: adminInquiries.filter((inquiry) => inquiry.status === '未対応')
      .length,
  },
  {
    label: '対応中',
    value: '対応中' as const,
    count: adminInquiries.filter((inquiry) => inquiry.status === '対応中')
      .length,
  },
  {
    label: '対応済み',
    value: '対応済み' as const,
    count: adminInquiries.filter((inquiry) => inquiry.status === '対応済み')
      .length,
  },
] as const

function getInquiryStatusClassName(status: AdminInquiryStatus) {
  if (status === '未対応') {
    return 'bg-chart-4/14 text-chart-4'
  }

  if (status === '対応中') {
    return 'bg-primary/10 text-primary'
  }

  return 'bg-muted text-muted-foreground'
}

export function AdminInquiriesPage() {
  const [statusFilterValue, setStatusFilterValue] =
    useState<InquiryStatusFilterValue>('all')
  const filteredInquiryRows =
    statusFilterValue === 'all'
      ? adminInquiryRows
      : adminInquiryRows.filter(
          (row) => row.inquiry.status === statusFilterValue,
        )
  const handleResetFilters = () => {
    setStatusFilterValue('all')
  }

  return (
    <>
      <InquiriesPageHeader />

      <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block min-w-0">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="お問い合わせ検索"
              className="bg-background pr-3 pl-10"
              placeholder="名前・メール・件名で検索"
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

        <InquirySegmentedFilter
          label="ステータス"
          onChange={setStatusFilterValue}
          options={statusFilterOptions}
          value={statusFilterValue}
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

      <InquiriesTable rows={filteredInquiryRows} />
    </>
  )
}

function InquiriesPageHeader() {
  return (
    <section className="border-b pb-5">
      <div className="flex h-10 items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
            お問い合わせ
          </h1>
        </div>
      </div>
    </section>
  )
}

function InquirySegmentedFilter<TValue extends string>({
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

function InquiriesTable({ rows }: { rows: ReadonlyArray<AdminInquiryRow> }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-card [contain:paint]">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">
            お問い合わせ一覧
          </h2>
        </div>
        <Button className="w-fit" size="sm" variant="outline">
          <PencilIcon data-icon="inline-start" />
          一括編集
        </Button>
      </div>

      <div className="hidden min-w-0 overflow-x-auto lg:block">
        <div className="min-w-[1240px]">
          <div className="grid grid-cols-[48px_64px_96px_112px_minmax(220px,1fr)_132px_minmax(260px,1.15fr)_132px_36px] items-center gap-3 border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>No</span>
            <span>ID</span>
            <span>ステータス</span>
            <span>名前</span>
            <span>メール</span>
            <span>種別</span>
            <span>件名</span>
            <span>受付日時</span>
            <span aria-hidden="true" />
          </div>

          {rows.length > 0 ? (
            <div className="divide-y">
              {rows.map((row) => (
                <InquiryTableRow key={row.inquiry.id} row={row} />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="grid divide-y lg:hidden">
          {rows.map((row) => (
            <InquiryMobileCard key={row.inquiry.id} row={row} />
          ))}
        </div>
      ) : (
        <div className="border-t p-6 text-center text-sm text-muted-foreground">
          条件に一致するお問い合わせはありません
        </div>
      )}
    </section>
  )
}

function InquiryTableRow({ row }: { row: AdminInquiryRow }) {
  const { displayNo, inquiry } = row

  return (
    <article className="grid grid-cols-[48px_64px_96px_112px_minmax(220px,1fr)_132px_minmax(260px,1.15fr)_132px_36px] items-stretch gap-3 px-4">
      <button
        aria-label={`お問い合わせID ${inquiry.id} の詳細を開く`}
        className="col-span-8 -mx-1 grid min-w-0 cursor-pointer grid-cols-[48px_64px_96px_112px_minmax(220px,1fr)_132px_minmax(260px,1.15fr)_132px] items-center gap-3 rounded-lg px-1 py-3.5 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        type="button"
      >
        <span className="text-sm font-medium tabular-nums">{displayNo}</span>
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {inquiry.id}
        </span>
        <Badge
          className={cn('w-fit', getInquiryStatusClassName(inquiry.status))}
        >
          {inquiry.status}
        </Badge>
        <span className="block min-w-0 truncate text-sm font-medium">
          {inquiry.name}
        </span>
        <span className="truncate text-sm text-muted-foreground">
          {inquiry.email}
        </span>
        <span className="truncate text-sm font-medium">{inquiry.category}</span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">
            {inquiry.subject}
          </span>
          <span className="mt-1 block truncate text-xs text-muted-foreground">
            {inquiry.summary}
          </span>
        </span>
        <span className="truncate text-sm font-medium">
          {inquiry.receivedAt}
        </span>
      </button>
      <span className="flex items-center justify-center">
        <SelectionCheckbox ariaLabel={`${inquiry.id}を選択`} />
      </span>
    </article>
  )
}

function InquiryMobileCard({ row }: { row: AdminInquiryRow }) {
  const { displayNo, inquiry } = row

  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-stretch gap-3 p-4">
      <button
        aria-label={`お問い合わせID ${inquiry.id} の詳細を開く`}
        className="-m-1 grid min-w-0 cursor-pointer gap-3 rounded-lg p-1 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        type="button"
      >
        <span className="flex min-w-0 items-start justify-between gap-3">
          <span className="grid min-w-0 gap-1">
            <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="tabular-nums">No {displayNo}</span>
              <span aria-hidden="true">/</span>
              <span className="tabular-nums">ID {inquiry.id}</span>
            </span>
            <span className="block truncate text-base font-semibold">
              {inquiry.name}
            </span>
          </span>
          <Badge
            className={cn(
              'shrink-0',
              getInquiryStatusClassName(inquiry.status),
            )}
          >
            {inquiry.status}
          </Badge>
        </span>

        <span className="grid min-w-0 gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            メール
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {inquiry.email}
          </span>
        </span>

        <span className="grid min-w-0 gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            件名
          </span>
          <span className="truncate text-sm font-semibold">
            {inquiry.subject}
          </span>
          <span className="line-clamp-2 text-xs leading-5 text-muted-foreground">
            {inquiry.summary}
          </span>
        </span>

        <span className="grid grid-cols-2 gap-3 text-sm">
          <span className="min-w-0">
            <span className="block text-xs font-medium text-muted-foreground">
              種別
            </span>
            <span className="mt-1 block truncate font-medium">
              {inquiry.category}
            </span>
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-medium text-muted-foreground">
              受付日時
            </span>
            <span className="mt-1 block truncate font-medium">
              {inquiry.receivedAt}
            </span>
          </span>
        </span>
      </button>

      <span className="flex items-start justify-center pt-1">
        <SelectionCheckbox ariaLabel={`${inquiry.id}を選択`} />
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
