import { PencilIcon, RotateCcwIcon, SearchIcon, XIcon } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useState } from 'react'
import { Link } from 'react-router'

import { AdminPageHeader } from '@/components/admin/admin-page-header'
import {
  BulkEditField,
  BulkEditSegmentedControl,
} from '@/components/admin/bulk-edit-field'
import { SegmentedFilter } from '@/components/admin/segmented-filter'
import { SelectionCheckbox } from '@/components/admin/selection-checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  getAdminInquiryRows,
  getAdminInquiryStatusClassName,
  type AdminInquiryRow,
  type AdminInquiryStatus,
} from '@/lib/admin-inquiries'
import { cn } from '@/lib/utils'

type InquiryStatusFilterValue = 'all' | AdminInquiryStatus

const adminInquiryRows = getAdminInquiryRows()

const inquiryStatusFilterOptions = [
  {
    label: '全て',
    value: 'all' as const,
  },
  {
    label: '未対応',
    value: '未対応' as const,
  },
  {
    label: '対応中',
    value: '対応中' as const,
  },
  {
    label: '対応済み',
    value: '対応済み' as const,
  },
] as const

type AdminInquiryFilterState = {
  searchValue: string
  statusFilterValue: InquiryStatusFilterValue
}

function matchesAdminInquiryFilters(
  row: AdminInquiryRow,
  filters: AdminInquiryFilterState,
) {
  if (
    filters.statusFilterValue !== 'all' &&
    row.inquiry.status !== filters.statusFilterValue
  ) {
    return false
  }

  const searchValue = filters.searchValue.trim().toLocaleLowerCase()

  if (
    searchValue &&
    !String(row.inquiry.id).includes(searchValue) &&
    !row.inquiry.name.toLocaleLowerCase().includes(searchValue) &&
    !row.inquiry.category.toLocaleLowerCase().includes(searchValue) &&
    !row.inquiry.subject.toLocaleLowerCase().includes(searchValue)
  ) {
    return false
  }

  return true
}

function getFilteredAdminInquiryRows(filters: AdminInquiryFilterState) {
  return adminInquiryRows.filter((row) =>
    matchesAdminInquiryFilters(row, filters),
  )
}

export function AdminInquiriesPage() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedInquiryIds, setSelectedInquiryIds] = useState(
    () => new Set<number>(),
  )
  const [statusFilterValue, setStatusFilterValue] =
    useState<InquiryStatusFilterValue>('all')
  const currentFilters = {
    searchValue,
    statusFilterValue,
  } satisfies AdminInquiryFilterState
  const getFilterCount = (filters: Partial<AdminInquiryFilterState> = {}) =>
    getFilteredAdminInquiryRows({ ...currentFilters, ...filters }).length
  const statusFilterOptions = inquiryStatusFilterOptions.map((option) => ({
    ...option,
    count: getFilterCount({ statusFilterValue: option.value }),
  }))
  const filteredInquiryRows = getFilteredAdminInquiryRows(currentFilters).map(
    (row, index) => ({
      ...row,
      displayNo: index + 1,
    }),
  )
  const visibleSelectedInquiryCount = filteredInquiryRows.filter((row) =>
    selectedInquiryIds.has(row.inquiry.id),
  ).length
  const handleResetFilters = () => {
    setSearchValue('')
    setStatusFilterValue('all')
  }
  const handleInquirySelectionChange = (
    inquiryId: number,
    isSelected: boolean,
  ) => {
    setSelectedInquiryIds((current) => {
      const next = new Set(current)

      if (isSelected) {
        next.add(inquiryId)
      } else {
        next.delete(inquiryId)
      }

      return next
    })
  }

  return (
    <>
      <AdminPageHeader title="お問い合わせ" />

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
                  aria-label="お問い合わせ検索"
                  className="bg-background pr-3 pl-10"
                  onChange={(event) =>
                    setSearchValue(event.currentTarget.value)
                  }
                  placeholder="ID・名前・種別・件名で検索"
                  type="search"
                  value={searchValue}
                />
              </span>
            </label>

            <SegmentedFilter
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

      <InquiriesTable
        onInquirySelectionChange={handleInquirySelectionChange}
        rows={filteredInquiryRows}
        selectedInquiryIds={selectedInquiryIds}
        visibleSelectedInquiryCount={visibleSelectedInquiryCount}
      />
    </>
  )
}

function InquiriesTable({
  onInquirySelectionChange,
  rows,
  selectedInquiryIds,
  visibleSelectedInquiryCount,
}: {
  onInquirySelectionChange: (inquiryId: number, isSelected: boolean) => void
  rows: ReadonlyArray<AdminInquiryRow>
  selectedInquiryIds: ReadonlySet<number>
  visibleSelectedInquiryCount: number
}) {
  const [bulkEditOpen, setBulkEditOpen] = useState(false)
  const selectedRows = rows.filter((row) =>
    selectedInquiryIds.has(row.inquiry.id),
  )

  return (
    <Dialog.Root onOpenChange={setBulkEditOpen} open={bulkEditOpen}>
      <section className="min-w-0 overflow-hidden rounded-lg border bg-card [contain:paint]">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-heading text-base font-semibold">
              お問い合わせ一覧
            </h2>
          </div>
          <span
            className={cn(
              'inline-flex w-fit',
              visibleSelectedInquiryCount === 0 && 'cursor-not-allowed',
            )}
          >
            <Button
              className="w-fit"
              disabled={visibleSelectedInquiryCount === 0}
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
            <div className="grid grid-cols-[48px_64px_112px_132px_132px_minmax(320px,1.35fr)_132px_36px] items-center gap-3 border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
              <span>No</span>
              <span>ID</span>
              <span>ステータス</span>
              <span>種別</span>
              <span>名前</span>
              <span>件名</span>
              <span>受付日時</span>
              <span aria-hidden="true" />
            </div>

            {rows.length > 0 ? (
              <div className="divide-y">
                {rows.map((row) => (
                  <InquiryTableRow
                    isSelected={selectedInquiryIds.has(row.inquiry.id)}
                    key={row.inquiry.id}
                    onSelectionChange={(isSelected) =>
                      onInquirySelectionChange(row.inquiry.id, isSelected)
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
              <InquiryMobileCard
                isSelected={selectedInquiryIds.has(row.inquiry.id)}
                key={row.inquiry.id}
                onSelectionChange={(isSelected) =>
                  onInquirySelectionChange(row.inquiry.id, isSelected)
                }
                row={row}
              />
            ))}
          </div>
        ) : (
          <div className="border-t p-6 text-center text-sm text-muted-foreground">
            条件に一致するお問い合わせはありません
          </div>
        )}
      </section>

      {bulkEditOpen ? (
        <BulkEditDialogContent selectedRows={selectedRows} />
      ) : null}
    </Dialog.Root>
  )
}

type BulkInquiryStatusValue = 'unchanged' | AdminInquiryStatus

const bulkInquiryStatusOptions: ReadonlyArray<{
  label: string
  value: BulkInquiryStatusValue
}> = [
  { label: '変更しない', value: 'unchanged' },
  { label: '未対応', value: '未対応' },
  { label: '対応中', value: '対応中' },
  { label: '対応済み', value: '対応済み' },
]

function BulkEditDialogContent({
  selectedRows,
}: {
  selectedRows: ReadonlyArray<AdminInquiryRow>
}) {
  const [statusValue, setStatusValue] =
    useState<BulkInquiryStatusValue>('unchanged')
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
              選択したお問い合わせにまとめて反映する項目を選択します。
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
              <h3 className="text-sm font-semibold">対象お問い合わせ</h3>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {selectedCount}件選択中
              </span>
            </div>

            <div className="grid max-h-72 min-w-0 gap-2 overflow-y-auto pr-1">
              {selectedRows.map((row) => (
                <div
                  className="grid min-w-0 gap-2 rounded-lg bg-background p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                  key={row.inquiry.id}
                >
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-muted-foreground">
                      <span className="tabular-nums">No {row.displayNo}</span>
                      <span aria-hidden="true">/</span>
                      <span className="tabular-nums">ID {row.inquiry.id}</span>
                      <span aria-hidden="true">/</span>
                      <span className="tabular-nums">
                        {row.inquiry.receivedAt}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm font-semibold">
                      {row.inquiry.subject}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    <Badge
                      className={cn(
                        'w-fit',
                        getAdminInquiryStatusClassName(row.inquiry.status),
                      )}
                    >
                      {row.inquiry.status}
                    </Badge>
                    <span className="text-sm font-semibold">
                      {row.inquiry.category}
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
                options={bulkInquiryStatusOptions}
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

function InquiryTableRow({
  isSelected,
  onSelectionChange,
  row,
}: {
  isSelected: boolean
  onSelectionChange: (isSelected: boolean) => void
  row: AdminInquiryRow
}) {
  const { displayNo, inquiry } = row

  return (
    <article className="grid grid-cols-[48px_64px_112px_132px_132px_minmax(320px,1.35fr)_132px_36px] items-stretch gap-3 px-4">
      <Link
        aria-label={`お問い合わせID ${inquiry.id} の詳細を開く`}
        className="col-span-7 -mx-1 grid min-w-0 cursor-pointer grid-cols-[48px_64px_112px_132px_132px_minmax(320px,1.35fr)_132px] items-center gap-3 rounded-lg px-1 py-3.5 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        to={`/admin/inquiries/${inquiry.id}`}
      >
        <span className="text-sm font-medium tabular-nums">{displayNo}</span>
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {inquiry.id}
        </span>
        <Badge
          className={cn(
            'w-fit',
            getAdminInquiryStatusClassName(inquiry.status),
          )}
        >
          {inquiry.status}
        </Badge>
        <span className="truncate text-sm font-medium">{inquiry.category}</span>
        <span className="block min-w-0 truncate text-sm font-medium">
          {inquiry.name}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">
            {inquiry.subject}
          </span>
        </span>
        <span className="truncate text-sm font-medium">
          {inquiry.receivedAt}
        </span>
      </Link>
      <span className="flex items-center justify-center">
        <SelectionCheckbox
          ariaLabel={`${inquiry.id}を選択`}
          checked={isSelected}
          onCheckedChange={onSelectionChange}
        />
      </span>
    </article>
  )
}

function InquiryMobileCard({
  isSelected,
  onSelectionChange,
  row,
}: {
  isSelected: boolean
  onSelectionChange: (isSelected: boolean) => void
  row: AdminInquiryRow
}) {
  const { displayNo, inquiry } = row

  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 p-4">
      <Link
        aria-label={`お問い合わせID ${inquiry.id} の詳細を開く`}
        className="-m-1 grid min-w-0 cursor-pointer gap-3 rounded-lg p-1 text-left outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        to={`/admin/inquiries/${inquiry.id}`}
      >
        <span className="flex min-w-0 items-start justify-between gap-3">
          <span className="grid min-w-0 gap-1">
            <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="tabular-nums">No {displayNo}</span>
              <span aria-hidden="true">/</span>
              <span className="tabular-nums">ID {inquiry.id}</span>
            </span>
            <span className="block truncate text-base font-semibold">
              {inquiry.subject}
            </span>
          </span>
          <Badge
            className={cn(
              'shrink-0',
              getAdminInquiryStatusClassName(inquiry.status),
            )}
          >
            {inquiry.status}
          </Badge>
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
              名前
            </span>
            <span className="mt-1 block truncate font-medium">
              {inquiry.name}
            </span>
          </span>
          <span className="col-span-2 min-w-0">
            <span className="block text-xs font-medium text-muted-foreground">
              受付日時
            </span>
            <span className="mt-1 block truncate font-medium">
              {inquiry.receivedAt}
            </span>
          </span>
        </span>
      </Link>

      <span className="flex items-start justify-center pt-1">
        <SelectionCheckbox
          ariaLabel={`${inquiry.id}を選択`}
          checked={isSelected}
          onCheckedChange={onSelectionChange}
        />
      </span>
    </article>
  )
}
