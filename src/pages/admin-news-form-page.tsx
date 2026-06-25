import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  EyeIcon,
  SaveIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  adminNewsLabelOptions,
  findAdminNewsById,
  getAdminNewsContentValue,
  getAdminNewsDateInputValue,
  getAdminNewsPublicPath,
  type AdminNewsItem,
} from '@/lib/admin-news'
import { cn } from '@/lib/utils'

const fieldWrapperClassName = 'grid min-w-0 content-start gap-1.5'
const fieldLabelClassName = 'text-xs font-medium text-muted-foreground'
const selectFieldClassName =
  'h-11 w-full min-w-0 cursor-pointer appearance-none rounded-lg border border-input bg-background py-0 pr-10 pl-3 text-base font-medium outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm'

export function AdminNewsNewPage() {
  return <AdminNewsFormPage mode="new" />
}

export function AdminNewsDetailPage() {
  const { newsId } = useParams()
  const item = findAdminNewsById(newsId)

  if (!item) {
    return <NewsNotFound newsId={newsId} />
  }

  return <AdminNewsFormPage item={item} mode="detail" />
}

function AdminNewsFormPage({
  item,
  mode,
}: {
  item?: AdminNewsItem
  mode: 'detail' | 'new'
}) {
  const navigate = useNavigate()
  const isNew = mode === 'new'
  const [titleValue, setTitleValue] = useState(item?.title ?? '')
  const [labelValue, setLabelValue] = useState(
    item?.label ?? adminNewsLabelOptions[0] ?? '',
  )
  const [contentValue, setContentValue] = useState(
    item ? getAdminNewsContentValue(item) : '',
  )
  const [publishedAtValue, setPublishedAtValue] = useState(
    item ? getAdminNewsDateInputValue(item.date) : getTodayDateInputValue(),
  )
  const [isPublished, setIsPublished] = useState(item?.published ?? false)
  const pageTitle = isNew ? 'お知らせ作成' : (item?.title ?? 'お知らせ詳細')

  return (
    <>
      <section className="border-b pb-5">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              onClick={() => navigate(-1)}
              type="button"
              variant="outline"
            >
              <ArrowLeftIcon data-icon="inline-start" />
              Back
            </Button>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {!isNew && item?.published ? (
                <Button asChild className="h-10 px-3" variant="outline">
                  <Link to={getAdminNewsPublicPath(item)}>
                    <ExternalLinkIcon data-icon="inline-start" />
                    サイト表示
                  </Link>
                </Button>
              ) : null}

              <Button className="h-10 px-3" type="button" variant="outline">
                <EyeIcon data-icon="inline-start" />
                プレビュー
              </Button>

              <Button className="h-10 px-3" type="button">
                <SaveIcon data-icon="inline-start" />
                {isNew ? '登録' : '保存'}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge className="bg-primary/10 text-primary">
                  {isNew ? '新規' : `ID ${item?.id}`}
                </Badge>
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
                {pageTitle}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <form className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid min-w-0 content-start gap-5">
          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">基本情報</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] admin-top-nav:grid-cols-[minmax(0,1fr)_220px]">
              <label className={fieldWrapperClassName}>
                <span className={fieldLabelClassName}>タイトル</span>
                <Input
                  onChange={(event) => setTitleValue(event.currentTarget.value)}
                  type="text"
                  value={titleValue}
                />
              </label>

              <label className={fieldWrapperClassName}>
                <span className={fieldLabelClassName}>ラベル</span>
                <SelectField
                  onChange={setLabelValue}
                  options={adminNewsLabelOptions}
                  value={labelValue}
                />
              </label>
            </div>

            <label className={fieldWrapperClassName}>
              <span className={fieldLabelClassName}>本文</span>
              <Textarea
                onChange={(event) => setContentValue(event.currentTarget.value)}
                value={contentValue}
              />
            </label>
          </section>
        </div>

        <aside className="grid min-w-0 content-start gap-5">
          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">公開設定</h2>
            </div>

            <label className={fieldWrapperClassName}>
              <span className={fieldLabelClassName}>公開状態</span>
              <PublishStateToggle
                disabled={isNew}
                isPublished={isPublished}
                onChange={setIsPublished}
              />
            </label>

            <label className={fieldWrapperClassName}>
              <span className={fieldLabelClassName}>公開日</span>
              <Input
                onChange={(event) =>
                  setPublishedAtValue(event.currentTarget.value)
                }
                type="date"
                value={publishedAtValue}
              />
            </label>
          </section>
        </aside>
      </form>
    </>
  )
}

function SelectField({
  onChange,
  options,
  value,
}: {
  onChange: (value: string) => void
  options: ReadonlyArray<string>
  value: string
}) {
  return (
    <span className="relative">
      <select
        className={selectFieldClassName}
        onChange={(event) => onChange(event.currentTarget.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </span>
  )
}

function PublishStateToggle({
  disabled = false,
  isPublished,
  onChange,
}: {
  disabled?: boolean
  isPublished: boolean
  onChange: (isPublished: boolean) => void
}) {
  return (
    <button
      aria-checked={isPublished}
      aria-label={
        disabled
          ? 'お知らせは非公開です'
          : isPublished
            ? 'お知らせを非公開にする'
            : 'お知らせを公開する'
      }
      className={cn(
        'inline-flex h-11 w-full items-center justify-between rounded-lg border px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        disabled
          ? 'cursor-not-allowed bg-muted/45 text-muted-foreground'
          : 'bg-background hover:bg-accent/55',
      )}
      disabled={disabled}
      onClick={() => onChange(!isPublished)}
      role="switch"
      type="button"
    >
      <span>{isPublished ? '公開' : '非公開'}</span>
      <span
        aria-hidden="true"
        className={cn(
          'relative h-6 w-11 rounded-full',
          disabled
            ? 'bg-muted-foreground/25'
            : isPublished
              ? 'bg-primary'
              : 'bg-muted-foreground/45',
        )}
      >
        <span
          className={cn(
            'absolute top-1 left-1 size-4 rounded-full bg-background',
            isPublished ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </span>
    </button>
  )
}

function getTodayDateInputValue() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const date = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${date}`
}

function NewsNotFound({ newsId }: { newsId?: string }) {
  return (
    <>
      <section className="border-b pb-5">
        <div className="flex h-10 items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
              お知らせが見つかりません
            </h1>
          </div>
        </div>
      </section>

      <section className="grid min-h-[320px] place-items-center rounded-lg border bg-card p-6 text-center">
        <div className="grid max-w-md gap-5">
          <div className="grid gap-2">
            <p className="font-heading text-lg font-semibold">
              お知らせID {newsId ?? '-'} は表示できません
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              お知らせ一覧から対象のお知らせを選択してください。
            </p>
          </div>

          <div className="flex justify-center">
            <Button asChild>
              <Link to="/admin/news">
                <ArrowLeftIcon data-icon="inline-start" />
                お知らせ一覧へ戻る
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
