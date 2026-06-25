import { ArrowLeftIcon, CalendarRangeIcon, RotateCcwIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const defaultFetchDays = 90
const defaultOffsetDays = 0

export function AdminSettingsFetchRangePage() {
  const [fetchDaysInput, setFetchDaysInput] = useState(String(defaultFetchDays))
  const [offsetDaysInput, setOffsetDaysInput] = useState(
    String(defaultOffsetDays),
  )
  const [appliedFetchDays, setAppliedFetchDays] = useState(defaultFetchDays)
  const [appliedOffsetDays, setAppliedOffsetDays] = useState(defaultOffsetDays)

  const fetchDaysValue = parseIntegerInput(fetchDaysInput)
  const offsetDaysValue = parseIntegerInput(offsetDaysInput)
  const validationMessage = getValidationMessage({
    fetchDaysInput,
    fetchDaysValue,
    offsetDaysInput,
    offsetDaysValue,
  })
  const canApply = validationMessage === null
  const targetRange = useMemo(
    () => getFetchRangeDisplay(appliedFetchDays, appliedOffsetDays),
    [appliedFetchDays, appliedOffsetDays],
  )

  const handleApply = () => {
    if (!canApply || fetchDaysValue === null || offsetDaysValue === null) {
      return
    }

    setAppliedFetchDays(fetchDaysValue)
    setAppliedOffsetDays(offsetDaysValue)
  }

  const handleReset = () => {
    setFetchDaysInput(String(defaultFetchDays))
    setOffsetDaysInput(String(defaultOffsetDays))
    setAppliedFetchDays(defaultFetchDays)
    setAppliedOffsetDays(defaultOffsetDays)
  }

  return (
    <>
      <SettingsDetailHeader title="取得範囲" />

      <section className="grid min-w-0 gap-5 rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-heading text-base font-semibold">
              一時取得範囲
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              注文・お問い合わせ・顧客の一覧取得範囲を変更します。
            </p>
          </div>
          <Badge className="w-fit bg-primary/10 text-primary">
            <CalendarRangeIcon data-icon="inline-start" />
            保存されません
          </Badge>
        </div>

        <form
          className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] lg:items-end"
          onSubmit={(event) => {
            event.preventDefault()
            handleApply()
          }}
        >
          <label className="grid min-w-0 gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              取得日数
            </span>
            <Input
              aria-describedby={
                validationMessage ? 'fetch-range-message' : undefined
              }
              aria-invalid={validationMessage ? 'true' : undefined}
              className="bg-background"
              inputMode="numeric"
              min={1}
              onChange={(event) => setFetchDaysInput(event.currentTarget.value)}
              type="number"
              value={fetchDaysInput}
            />
          </label>

          <label className="grid min-w-0 gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              オフセット日数
            </span>
            <Input
              aria-describedby={
                validationMessage ? 'fetch-range-message' : undefined
              }
              aria-invalid={validationMessage ? 'true' : undefined}
              className="bg-background"
              inputMode="numeric"
              min={0}
              onChange={(event) =>
                setOffsetDaysInput(event.currentTarget.value)
              }
              type="number"
              value={offsetDaysInput}
            />
          </label>

          <Button className="h-11 px-3" disabled={!canApply} type="submit">
            適用
          </Button>
          <Button
            className="h-11 px-3"
            onClick={handleReset}
            type="button"
            variant="outline"
          >
            <RotateCcwIcon data-icon="inline-start" />
            初期値
          </Button>
        </form>

        {validationMessage ? (
          <p
            className="text-sm font-medium text-destructive"
            id="fetch-range-message"
          >
            {validationMessage}
          </p>
        ) : null}

        <div className="grid min-w-0 overflow-hidden rounded-lg border">
          <FetchRangeRow
            label="対象データ"
            value="注文 / お問い合わせ / 顧客"
          />
          <FetchRangeRow label="取得日数" value={`${appliedFetchDays}日`} />
          <FetchRangeRow label="オフセット" value={`${appliedOffsetDays}日`} />
          <FetchRangeRow label="対象期間" value={targetRange} />
        </div>
      </section>
    </>
  )
}

function SettingsDetailHeader({ title }: { title: string }) {
  return (
    <section className="border-b pb-5">
      <div className="grid gap-4">
        <div>
          <Button asChild type="button" variant="outline">
            <Link to="/admin/settings">
              <ArrowLeftIcon data-icon="inline-start" />
              Back
            </Link>
          </Button>
        </div>
        <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
          {title}
        </h1>
      </div>
    </section>
  )
}

function FetchRangeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="min-w-0 text-sm font-semibold">{value}</span>
    </div>
  )
}

function getValidationMessage({
  fetchDaysInput,
  fetchDaysValue,
  offsetDaysInput,
  offsetDaysValue,
}: {
  fetchDaysInput: string
  fetchDaysValue: number | null
  offsetDaysInput: string
  offsetDaysValue: number | null
}) {
  if (fetchDaysInput.trim().length === 0) {
    return '取得日数を入力してください'
  }

  if (fetchDaysValue === null || fetchDaysValue < 1) {
    return '取得日数は1日以上の整数で入力してください'
  }

  if (offsetDaysInput.trim().length === 0) {
    return 'オフセット日数を入力してください'
  }

  if (offsetDaysValue === null || offsetDaysValue < 0) {
    return 'オフセット日数は0日以上の整数で入力してください'
  }

  return null
}

function parseIntegerInput(value: string) {
  const trimmedValue = value.trim()

  if (!/^\d+$/.test(trimmedValue)) {
    return null
  }

  return Number(trimmedValue)
}

function getFetchRangeDisplay(fetchDays: number, offsetDays: number) {
  const endDate = getStartOfToday()
  endDate.setDate(endDate.getDate() - offsetDays)

  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - fetchDays + 1)

  return `${formatDate(startDate)} 〜 ${formatDate(endDate)}`
}

function getStartOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}/${month}/${day}`
}
