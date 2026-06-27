import {
  CheckIcon,
  CircleCheckIcon,
  EyeOffIcon,
  ImageOffIcon,
  PencilIcon,
  PlusIcon,
  RotateCcwIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'

import { NewsLabelBadge } from '@/components/news-label-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  adminNewsItems,
  getAdminNewsRows,
  type AdminNewsItem,
  type AdminNewsRow,
} from '@/lib/admin-news'
import { assetUrl } from '@/lib/asset-url'
import { cn } from '@/lib/utils'

type VisibilityFilterValue = 'all' | 'published' | 'unpublished'

const adminNewsRows = getAdminNewsRows()

type AdminNewsFilterState = {
  publishedNewsIds: ReadonlySet<number>
  searchValue: string
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

  const searchValue = filters.searchValue.trim().toLocaleLowerCase()

  if (
    searchValue &&
    !String(row.item.id).includes(searchValue) &&
    !row.item.title.toLocaleLowerCase().includes(searchValue) &&
    !(row.item.tag ?? '').toLocaleLowerCase().includes(searchValue) &&
    !row.summary.toLocaleLowerCase().includes(searchValue)
  ) {
    return false
  }

  return true
}

function NewsTagBadge({ tag }: { tag: string | null }) {
  if (!tag) {
    return (
      <span className="text-xs font-medium text-muted-foreground">なし</span>
    )
  }

  return <NewsLabelBadge label={tag} />
}

function NewsThumbnail({
  className,
  item,
}: {
  className?: string
  item: AdminNewsItem
}) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center overflow-hidden rounded-md border bg-muted',
        className,
      )}
    >
      {item.mainImageUrl ? (
        <img
          alt=""
          className="size-full object-cover"
          src={assetUrl(item.mainImageUrl)}
        />
      ) : (
        <ImageOffIcon
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
      )}
    </span>
  )
}

function getFilteredAdminNewsRows(filters: AdminNewsFilterState) {
  return adminNewsRows.filter((row) => matchesAdminNewsFilters(row, filters))
}

export function AdminNewsPage() {
  const [publishedNewsIds] = useState<ReadonlySet<number>>(
    () =>
      new Set(
        adminNewsItems.filter((item) => item.published).map((item) => item.id),
      ),
  )
  const [searchValue, setSearchValue] = useState('')
  const [selectedNewsIds, setSelectedNewsIds] = useState(
    () => new Set<number>(),
  )
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilterValue>('all')
  const currentFilters = {
    publishedNewsIds,
    searchValue,
    visibilityFilter,
  } satisfies AdminNewsFilterState
  const getFilterCount = (filters: Partial<AdminNewsFilterState> = {}) =>
    getFilteredAdminNewsRows({ ...currentFilters, ...filters }).length
  const visibilityFilterOptions = [
    {
      label: '全て',
      value: 'all',
      count: getFilterCount({ visibilityFilter: 'all' }),
    },
    {
      label: '公開',
      value: 'published',
      count: getFilterCount({ visibilityFilter: 'published' }),
    },
    {
      label: '非公開',
      value: 'unpublished',
      count: getFilterCount({ visibilityFilter: 'unpublished' }),
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
  const visibleSelectedNewsCount = filteredNewsRows.filter((row) =>
    selectedNewsIds.has(row.item.id),
  ).length
  const handleResetFilters = () => {
    setSearchValue('')
    setVisibilityFilter('all')
  }
  const handleNewsSelectionChange = (newsId: number, isSelected: boolean) => {
    setSelectedNewsIds((current) => {
      const next = new Set(current)

      if (isSelected) {
        next.add(newsId)
      } else {
        next.delete(newsId)
      }

      return next
    })
  }

  return (
    <>
      <NewsPageHeader />

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
                  aria-label="お知らせ検索"
                  className="bg-background pr-3 pl-10"
                  onChange={(event) =>
                    setSearchValue(event.currentTarget.value)
                  }
                  placeholder="ID・タイトル・ラベルで検索"
                  type="search"
                  value={searchValue}
                />
              </span>
            </label>

            <NewsSegmentedFilter
              label="公開状態"
              onChange={setVisibilityFilter}
              options={visibilityFilterOptions}
              value={visibilityFilter}
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

      <NewsTable
        onNewsSelectionChange={handleNewsSelectionChange}
        publishedNewsIds={publishedNewsIds}
        rows={filteredNewsRows}
        selectedNewsIds={selectedNewsIds}
        visibleSelectedNewsCount={visibleSelectedNewsCount}
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
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div
        aria-label={label}
        className="grid h-11 w-full max-w-full grid-cols-3 rounded-lg border bg-background p-1 sm:w-fit"
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
          <Button asChild className="h-10 px-3">
            <Link to="/admin/news/new">
              <PlusIcon data-icon="inline-start" />
              新規作成
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function NewsTable({
  onNewsSelectionChange,
  publishedNewsIds,
  rows,
  selectedNewsIds,
  visibleSelectedNewsCount,
}: {
  onNewsSelectionChange: (newsId: number, isSelected: boolean) => void
  publishedNewsIds: ReadonlySet<number>
  rows: ReadonlyArray<AdminNewsRow>
  selectedNewsIds: ReadonlySet<number>
  visibleSelectedNewsCount: number
}) {
  const [bulkEditOpen, setBulkEditOpen] = useState(false)
  const selectedRows = rows.filter((row) => selectedNewsIds.has(row.item.id))

  return (
    <Dialog.Root onOpenChange={setBulkEditOpen} open={bulkEditOpen}>
      <section className="min-w-0 overflow-hidden rounded-lg border bg-card [contain:paint]">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-heading text-base font-semibold">
              お知らせ一覧
            </h2>
          </div>
          <span
            className={cn(
              'inline-flex w-fit',
              visibleSelectedNewsCount === 0 && 'cursor-not-allowed',
            )}
          >
            <Button
              className="w-fit"
              disabled={visibleSelectedNewsCount === 0}
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
            <div className="grid grid-cols-[48px_64px_96px_minmax(320px,1.45fr)_112px_112px_36px] items-center gap-3 border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
              <span>No</span>
              <span>ID</span>
              <span>ラベル</span>
              <span>お知らせ</span>
              <span>公開日</span>
              <span>公開状態</span>
              <span aria-hidden="true" />
            </div>

            {rows.length > 0 ? (
              <div className="divide-y">
                {rows.map((row) => (
                  <NewsTableRow
                    isPublished={publishedNewsIds.has(row.item.id)}
                    isSelected={selectedNewsIds.has(row.item.id)}
                    key={row.item.id}
                    onSelectionChange={(isSelected) =>
                      onNewsSelectionChange(row.item.id, isSelected)
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
              <NewsMobileCard
                isPublished={publishedNewsIds.has(row.item.id)}
                isSelected={selectedNewsIds.has(row.item.id)}
                key={row.item.id}
                onSelectionChange={(isSelected) =>
                  onNewsSelectionChange(row.item.id, isSelected)
                }
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

      {bulkEditOpen ? (
        <BulkEditDialogContent
          publishedNewsIds={publishedNewsIds}
          selectedRows={selectedRows}
        />
      ) : null}
    </Dialog.Root>
  )
}

type BulkNewsVisibilityValue = 'unchanged' | 'published' | 'unpublished'

const bulkNewsVisibilityOptions: ReadonlyArray<{
  label: string
  value: BulkNewsVisibilityValue
}> = [
  { label: '変更しない', value: 'unchanged' },
  { label: '公開にする', value: 'published' },
  { label: '非公開にする', value: 'unpublished' },
]

function BulkEditDialogContent({
  publishedNewsIds,
  selectedRows,
}: {
  publishedNewsIds: ReadonlySet<number>
  selectedRows: ReadonlyArray<AdminNewsRow>
}) {
  const [visibilityValue, setVisibilityValue] =
    useState<BulkNewsVisibilityValue>('unchanged')
  const selectedCount = selectedRows.length
  const canApply = visibilityValue !== 'unchanged'

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
              選択したお知らせにまとめて反映する項目を選択します。
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
              <h3 className="text-sm font-semibold">対象お知らせ</h3>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {selectedCount}件選択中
              </span>
            </div>

            <div className="grid max-h-72 min-w-0 gap-2 overflow-y-auto pr-1">
              {selectedRows.map((row) => (
                <div
                  className="grid min-w-0 gap-2 rounded-lg bg-background p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  key={row.item.id}
                >
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-muted-foreground">
                      <span className="tabular-nums">No {row.displayNo}</span>
                      <span aria-hidden="true">/</span>
                      <span className="tabular-nums">ID {row.item.id}</span>
                      <span aria-hidden="true">/</span>
                      <span className="tabular-nums">{row.publishedAt}</span>
                    </div>
                    <p className="mt-1 truncate text-sm font-semibold">
                      {row.item.title}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    <NewsTagBadge tag={row.item.tag} />
                    <PublishStateBadge
                      isPublished={publishedNewsIds.has(row.item.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid min-w-0 gap-4 rounded-lg border p-4">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold">変更内容</h3>
            </div>

            <BulkEditField label="公開状態">
              <BulkEditSegmentedControl
                onChange={setVisibilityValue}
                options={bulkNewsVisibilityOptions}
                value={visibilityValue}
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

function NewsTableRow({
  isPublished,
  isSelected,
  onSelectionChange,
  row,
}: {
  isPublished: boolean
  isSelected: boolean
  onSelectionChange: (isSelected: boolean) => void
  row: AdminNewsRow
}) {
  const { displayNo, item, publishedAt, summary } = row

  return (
    <article className="grid grid-cols-[48px_64px_96px_minmax(320px,1.45fr)_112px_112px_36px] items-stretch gap-3 px-4">
      <Link
        aria-label={`${item.title}の編集画面を開く`}
        className="col-span-6 -mx-1 grid min-w-0 cursor-pointer grid-cols-[48px_64px_96px_minmax(320px,1.45fr)_112px_112px] items-center gap-3 rounded-lg px-1 py-3.5 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        to={`/admin/news/${item.id}`}
      >
        <span className="text-sm font-medium tabular-nums">{displayNo}</span>
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {item.id}
        </span>
        <span className="flex min-w-0 items-center">
          <NewsTagBadge tag={item.tag} />
        </span>
        <span className="flex min-w-0 items-center gap-3">
          <NewsThumbnail className="size-12" item={item} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              {item.title}
            </span>
            <span className="mt-1 block truncate text-xs text-muted-foreground">
              {summary}
            </span>
          </span>
        </span>
        <span className="truncate text-sm font-medium tabular-nums">
          {publishedAt}
        </span>
        <span className="flex items-center">
          <PublishStateBadge isPublished={isPublished} />
        </span>
      </Link>

      <span className="flex items-center justify-center">
        <SelectionCheckbox
          ariaLabel={`${item.title}を選択`}
          checked={isSelected}
          onCheckedChange={onSelectionChange}
        />
      </span>
    </article>
  )
}

function NewsMobileCard({
  isPublished,
  isSelected,
  onSelectionChange,
  row,
}: {
  isPublished: boolean
  isSelected: boolean
  onSelectionChange: (isSelected: boolean) => void
  row: AdminNewsRow
}) {
  const { displayNo, item, publishedAt, summary } = row

  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 p-4">
      <Link
        aria-label={`${item.title}の編集画面を開く`}
        className="-m-1 grid min-w-0 cursor-pointer gap-3 rounded-lg p-1 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        to={`/admin/news/${item.id}`}
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
            <NewsTagBadge tag={item.tag} />
          </span>
        </span>

        <span className="flex min-w-0 items-start gap-3">
          <NewsThumbnail className="size-16" item={item} />
          <span className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {summary}
          </span>
        </span>

        <span className="grid min-w-0 gap-1 text-sm">
          <span className="min-w-0">
            <span className="block text-xs font-medium text-muted-foreground">
              公開日
            </span>
            <span className="mt-1 block truncate font-medium tabular-nums">
              {publishedAt}
            </span>
          </span>
        </span>
      </Link>

      <span className="flex items-start justify-center pt-1">
        <SelectionCheckbox
          ariaLabel={`${item.title}を選択`}
          checked={isSelected}
          onCheckedChange={onSelectionChange}
        />
      </span>

      <div className="col-span-2 flex items-center justify-between gap-3 rounded-lg border bg-muted/35 p-3">
        <p className="text-xs font-medium text-muted-foreground">公開状態</p>
        <PublishStateBadge isPublished={isPublished} />
      </div>
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

function PublishStateBadge({ isPublished }: { isPublished: boolean }) {
  const Icon = isPublished ? CircleCheckIcon : EyeOffIcon

  return (
    <span
      className={cn(
        'inline-flex h-7 min-w-20 items-center justify-center gap-1.5 rounded-full border px-2 text-xs font-semibold',
        isPublished
          ? 'border-primary/40 bg-primary/15 text-primary'
          : 'border-muted-foreground/35 bg-muted-foreground/15 text-foreground',
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {isPublished ? '公開' : '非公開'}
    </span>
  )
}
