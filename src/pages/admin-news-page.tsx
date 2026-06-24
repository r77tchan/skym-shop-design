import {
  CheckIcon,
  PencilIcon,
  PlusIcon,
  RotateCcwIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from 'lucide-react'
import { useState } from 'react'

import { NewsLabelBadge } from '@/components/news-label-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { newsItems, type NewsItem } from '@/lib/shop-content'
import { cn } from '@/lib/utils'

type VisibilityFilterValue = 'all' | 'published' | 'unpublished'

type AdminNewsRow = {
  displayNo: number
  item: NewsItem
  publishedAt: string
  summary: string
}

const unpublishedAdminNewsItem: NewsItem = {
  id: 7,
  date: '2026.06.22',
  label: 'お知らせ',
  title: '週末発送スケジュール 下書き',
  content: [
    '週末の発送スケジュールを調整中です。公開前の確認用として非公開にしています。',
  ],
}

const adminNewsItems = [unpublishedAdminNewsItem, ...newsItems]

const adminNewsRows: AdminNewsRow[] = adminNewsItems.map((item, index) => ({
  displayNo: index + 1,
  item,
  publishedAt: item.date.replace(/\./g, '/'),
  summary: item.content[0],
}))

type AdminNewsFilterState = {
  publishedNewsIds: ReadonlySet<number>
  visibilityFilter: VisibilityFilterValue
}

function matchesAdminNewsFilters(
  row: AdminNewsRow,
  filters: AdminNewsFilterState,
) {
  const published = filters.publishedNewsIds.has(row.item.id)

  if (filters.visibilityFilter === 'published' && !published) {
    return false
  }

  if (filters.visibilityFilter === 'unpublished' && published) {
    return false
  }

  return true
}

function getFilteredAdminNewsRows(filters: AdminNewsFilterState) {
  return adminNewsRows.filter((row) => matchesAdminNewsFilters(row, filters))
}

export function AdminNewsPage() {
  const [publishedNewsIds, setPublishedNewsIds] = useState<ReadonlySet<number>>(
    () => new Set(newsItems.map((item) => item.id)),
  )
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilterValue>('all')
  const currentFilters = {
    publishedNewsIds,
    visibilityFilter,
  } satisfies AdminNewsFilterState
  const getFilterCount = (nextVisibilityFilter: VisibilityFilterValue) =>
    getFilteredAdminNewsRows({
      ...currentFilters,
      visibilityFilter: nextVisibilityFilter,
    }).length
  const visibilityFilterOptions = [
    {
      label: '全て',
      value: 'all',
      count: getFilterCount('all'),
    },
    {
      label: '公開',
      value: 'published',
      count: getFilterCount('published'),
    },
    {
      label: '非公開',
      value: 'unpublished',
      count: getFilterCount('unpublished'),
    },
  ] as const satisfies ReadonlyArray<{
    label: string
    value: VisibilityFilterValue
    count: number
  }>
  const filteredNewsRows = getFilteredAdminNewsRows(currentFilters).map(
    (row, index) => ({
      ...row,
      displayNo: index + 1,
    }),
  )
  const handleResetFilters = () => {
    setVisibilityFilter('all')
  }
  const handleTogglePublished = (newsId: number) => {
    setPublishedNewsIds((current) => {
      const next = new Set(current)

      if (next.has(newsId)) {
        next.delete(newsId)
      } else {
        next.add(newsId)
      }

      return next
    })
  }

  return (
    <>
      <NewsPageHeader />

      <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] admin-top-nav:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block min-w-0">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="お知らせ検索"
              className="bg-background pr-3 pl-10"
              placeholder="タイトル・ラベルで検索"
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

        <NewsSegmentedFilter
          label="公開状態"
          onChange={setVisibilityFilter}
          options={visibilityFilterOptions}
          value={visibilityFilter}
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

      <NewsTable
        onTogglePublished={handleTogglePublished}
        publishedNewsIds={publishedNewsIds}
        rows={filteredNewsRows}
      />
    </>
  )
}

function NewsSegmentedFilter<TValue extends string>({
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

function NewsPageHeader() {
  return (
    <section className="border-b pb-5">
      <div className="flex h-10 items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
            お知らせ
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button className="h-10 px-3">
            <PlusIcon data-icon="inline-start" />
            新規作成
          </Button>
        </div>
      </div>
    </section>
  )
}

function NewsTable({
  onTogglePublished,
  publishedNewsIds,
  rows,
}: {
  onTogglePublished: (newsId: number) => void
  publishedNewsIds: ReadonlySet<number>
  rows: ReadonlyArray<AdminNewsRow>
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-card [contain:paint]">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">お知らせ一覧</h2>
        </div>
        <Button className="w-fit" size="sm" variant="outline">
          <PencilIcon data-icon="inline-start" />
          一括編集
        </Button>
      </div>

      <div className="hidden min-w-0 overflow-x-auto lg:block admin-top-nav:block">
        <div className="min-w-[1040px]">
          <div className="grid grid-cols-[48px_64px_minmax(340px,1.45fr)_96px_112px_112px_36px] items-center gap-3 border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>No</span>
            <span>ID</span>
            <span>お知らせ</span>
            <span>ラベル</span>
            <span>公開日</span>
            <span>公開状態</span>
            <span aria-hidden="true" />
          </div>

          {rows.length > 0 ? (
            <div className="divide-y">
              {rows.map((row) => (
                <NewsTableRow
                  isPublished={publishedNewsIds.has(row.item.id)}
                  key={row.item.id}
                  onTogglePublished={onTogglePublished}
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
            <NewsMobileCard
              isPublished={publishedNewsIds.has(row.item.id)}
              key={row.item.id}
              onTogglePublished={onTogglePublished}
              row={row}
            />
          ))}
        </div>
      ) : (
        <div className="border-t p-6 text-center text-sm text-muted-foreground">
          条件に一致するお知らせはありません
        </div>
      )}
    </section>
  )
}

function NewsTableRow({
  isPublished,
  onTogglePublished,
  row,
}: {
  isPublished: boolean
  onTogglePublished: (newsId: number) => void
  row: AdminNewsRow
}) {
  const { displayNo, item, publishedAt, summary } = row

  return (
    <article className="grid grid-cols-[48px_64px_minmax(340px,1.45fr)_96px_112px_112px_36px] items-stretch gap-3 px-4">
      <button
        aria-label={`${item.title}の詳細を開く`}
        className="col-span-5 -mx-1 grid min-w-0 cursor-pointer grid-cols-[48px_64px_minmax(340px,1.45fr)_96px_112px] items-center gap-3 rounded-lg px-1 py-3.5 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        type="button"
      >
        <span className="text-sm font-medium tabular-nums">{displayNo}</span>
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {item.id}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">
            {item.title}
          </span>
          <span className="mt-1 block truncate text-xs text-muted-foreground">
            {summary}
          </span>
        </span>
        <span className="flex min-w-0 items-center">
          <NewsLabelBadge label={item.label} />
        </span>
        <span className="truncate text-sm font-medium">{publishedAt}</span>
      </button>

      <div className="flex items-center">
        <PublishStateToggle
          isPublished={isPublished}
          itemTitle={item.title}
          onToggle={() => onTogglePublished(item.id)}
        />
      </div>
      <span className="flex items-center justify-center">
        <SelectionCheckbox ariaLabel={`${item.title}を選択`} />
      </span>
    </article>
  )
}

function NewsMobileCard({
  isPublished,
  onTogglePublished,
  row,
}: {
  isPublished: boolean
  onTogglePublished: (newsId: number) => void
  row: AdminNewsRow
}) {
  const { displayNo, item, publishedAt, summary } = row

  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 p-4">
      <button
        aria-label={`${item.title}の詳細を開く`}
        className="-m-1 grid min-w-0 cursor-pointer gap-3 rounded-lg p-1 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        type="button"
      >
        <span className="flex min-w-0 items-start justify-between gap-3">
          <span className="grid min-w-0 gap-1">
            <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="tabular-nums">No {displayNo}</span>
              <span aria-hidden="true">/</span>
              <span className="tabular-nums">ID {item.id}</span>
            </span>
            <span className="block truncate text-base font-semibold">
              {item.title}
            </span>
          </span>
          <span className="shrink-0">
            <NewsLabelBadge label={item.label} />
          </span>
        </span>

        <span className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {summary}
        </span>

        <span className="grid min-w-0 gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            公開日
          </span>
          <span className="text-sm font-medium">{publishedAt}</span>
        </span>
      </button>

      <span className="flex items-start justify-center pt-1">
        <SelectionCheckbox ariaLabel={`${item.title}を選択`} />
      </span>

      <div className="col-span-2 flex items-center justify-between gap-3 rounded-lg border bg-muted/35 p-3">
        <p className="text-xs font-medium text-muted-foreground">公開状態</p>
        <PublishStateToggle
          isPublished={isPublished}
          itemTitle={item.title}
          onToggle={() => onTogglePublished(item.id)}
        />
      </div>
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

function PublishStateToggle({
  isPublished,
  itemTitle,
  onToggle,
}: {
  isPublished: boolean
  itemTitle: string
  onToggle: () => void
}) {
  return (
    <button
      aria-checked={isPublished}
      aria-label={`${itemTitle}を${isPublished ? '非公開' : '公開'}にする`}
      className={cn(
        'inline-flex h-7 w-[4.5rem] items-center justify-between rounded-full px-1 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
        isPublished
          ? 'bg-primary text-primary-foreground hover:bg-primary/80'
          : 'bg-muted-foreground/55 text-background hover:bg-muted-foreground/65',
      )}
      onClick={onToggle}
      role="switch"
      type="button"
    >
      {isPublished ? (
        <>
          <span className="pl-1.5">公開</span>
          <span
            aria-hidden="true"
            className="size-5 rounded-full bg-background"
          />
        </>
      ) : (
        <>
          <span
            aria-hidden="true"
            className="size-5 rounded-full bg-background"
          />
          <span className="pr-1.5">非公開</span>
        </>
      )}
    </button>
  )
}
