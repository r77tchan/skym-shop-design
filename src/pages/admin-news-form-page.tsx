import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  EyeIcon,
  ImagePlusIcon,
  PencilIcon,
  SaveIcon,
  Trash2Icon,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { NewsMarkdown } from '@/components/news-markdown'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  adminNewsTagOptions,
  findAdminNewsById,
  getAdminNewsDateInputValue,
  getAdminNewsPublicPath,
  type AdminNewsItem,
} from '@/lib/admin-news'
import { assetUrl } from '@/lib/asset-url'
import { cn } from '@/lib/utils'

// デザイン確認用のダミー画像（実アップロードは未実装）。
const sampleMainImagePath =
  '/skym-shop-assets/images/products/daysprout-pico-chatakura-md-ss-front.jpg'
const sampleBodyImageMarkdown =
  '![画像の説明](/skym-shop-assets/images/products/161b25ac6ba3c56743cad57b38ad7ee5.jpg)'

const noTagValue = ''

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
  const [tagValue, setTagValue] = useState(item?.tag ?? noTagValue)
  const [bodyValue, setBodyValue] = useState(item?.body ?? '')
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(
    item?.mainImageUrl ?? null,
  )
  const [publishedAtValue, setPublishedAtValue] = useState(
    item
      ? getAdminNewsDateInputValue(item.publishedOn)
      : getTodayDateInputValue(),
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
                  onChange={setTagValue}
                  options={adminNewsTagOptions}
                  placeholder="（なし）"
                  value={tagValue}
                />
              </label>
            </div>

            <MarkdownBodyField onChange={setBodyValue} value={bodyValue} />
          </section>
        </div>

        <aside className="grid min-w-0 content-start gap-5">
          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">
                メイン画像
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                一覧と詳細で表示する画像です（本文中の画像とは別）。
              </p>
            </div>

            <MainImagePicker onChange={setMainImageUrl} value={mainImageUrl} />
          </section>

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
  placeholder,
  value,
}: {
  onChange: (value: string) => void
  options: ReadonlyArray<string>
  placeholder?: string
  value: string
}) {
  return (
    <span className="relative">
      <select
        className={selectFieldClassName}
        onChange={(event) => onChange(event.currentTarget.value)}
        value={value}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
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

function MarkdownBodyField({
  onChange,
  value,
}: {
  onChange: (value: string) => void
  value: string
}) {
  const [showPreview, setShowPreview] = useState(false)

  const handleInsertImage = () => {
    const snippet = value.trim()
      ? `${value.trimEnd()}\n\n${sampleBodyImageMarkdown}\n`
      : `${sampleBodyImageMarkdown}\n`

    onChange(snippet)
  }

  return (
    <div className={fieldWrapperClassName}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={fieldLabelClassName}>本文（Markdown）</span>
        <div className="flex items-center gap-1.5">
          <Button
            className="h-8 px-2.5 text-xs"
            onClick={handleInsertImage}
            type="button"
            variant="outline"
          >
            <ImagePlusIcon data-icon="inline-start" />
            画像を挿入
          </Button>
          <Button
            className="h-8 px-2.5 text-xs"
            onClick={() => setShowPreview((current) => !current)}
            type="button"
            variant="outline"
          >
            {showPreview ? (
              <>
                <PencilIcon data-icon="inline-start" />
                編集
              </>
            ) : (
              <>
                <EyeIcon data-icon="inline-start" />
                プレビュー
              </>
            )}
          </Button>
        </div>
      </div>

      {showPreview ? (
        <div className="min-h-44 rounded-lg border bg-background p-4">
          {value.trim() ? (
            <NewsMarkdown body={value} />
          ) : (
            <p className="text-sm text-muted-foreground">
              プレビューする内容がありません
            </p>
          )}
        </div>
      ) : (
        <Textarea
          className="min-h-44"
          onChange={(event) => onChange(event.currentTarget.value)}
          value={value}
        />
      )}

      <p className="text-xs leading-5 text-muted-foreground">
        空行で段落を分け、<code>![説明](画像URL)</code>{' '}
        で本文中に画像を埋め込めます。
      </p>
    </div>
  )
}

function MainImagePicker({
  onChange,
  value,
}: {
  onChange: (value: string | null) => void
  value: string | null
}) {
  if (value) {
    return (
      <div className="grid min-w-0 gap-3">
        <div className="overflow-hidden rounded-lg border bg-muted">
          <img
            alt="メイン画像プレビュー"
            className="aspect-[16/9] w-full object-cover"
            src={assetUrl(value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            className="h-9 px-3 text-xs"
            onClick={() => onChange(sampleMainImagePath)}
            type="button"
            variant="outline"
          >
            <ImagePlusIcon data-icon="inline-start" />
            画像を変更
          </Button>
          <Button
            className="h-9 px-3 text-xs"
            onClick={() => onChange(null)}
            type="button"
            variant="outline"
          >
            <Trash2Icon data-icon="inline-start" />
            削除
          </Button>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          ※ デザイン確認用のダミーです。
        </p>
      </div>
    )
  }

  return (
    <div className="grid min-w-0 gap-2">
      <button
        className="grid aspect-[16/9] w-full place-items-center gap-2 rounded-lg border border-dashed bg-background text-muted-foreground outline-none hover:bg-accent/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={() => onChange(sampleMainImagePath)}
        type="button"
      >
        <ImagePlusIcon aria-hidden="true" className="size-6" />
        <span className="text-sm font-medium">
          画像をアップロード（ダミー）
        </span>
      </button>
      <p className="text-xs leading-5 text-muted-foreground">
        ※ デザイン確認用のダミーです。
      </p>
    </div>
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
