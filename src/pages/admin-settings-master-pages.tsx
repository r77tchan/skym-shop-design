import { ArrowLeftIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { adminNewsLabelOptions } from '@/lib/admin-news'
import { productBrands, productCategoryItems } from '@/lib/shop-content'

type NameMasterItem = {
  id: number
  name: string
}

type CategoryMasterItem = {
  id: number
  name: string
  slug: string
}

const brandMasterItems: NameMasterItem[] = productBrands.map((name, index) => ({
  id: index + 1,
  name,
}))

const categoryMasterItems: CategoryMasterItem[] = productCategoryItems.map(
  (item, index) => ({
    id: index + 1,
    name: item.label,
    slug: item.slug,
  }),
)

const newsTagMasterItems: NameMasterItem[] = adminNewsLabelOptions.map(
  (name, index) => ({
    id: index + 1,
    name,
  }),
)

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function AdminSettingsBrandsPage() {
  return (
    <NameMasterSettingsPage
      description="商品登録や商品一覧の絞り込みで使うブランドを管理します。"
      initialItems={brandMasterItems}
      inputLabel="ブランド名"
      messageId="brand-master-message"
      title="ブランド"
    />
  )
}

export function AdminSettingsCategoriesPage() {
  return <CategoryMasterSettingsPage initialItems={categoryMasterItems} />
}

export function AdminSettingsNewsTagsPage() {
  return (
    <NameMasterSettingsPage
      description="お知らせ作成時に選択するタグを管理します。"
      initialItems={newsTagMasterItems}
      inputLabel="タグ名"
      messageId="news-tag-master-message"
      title="お知らせタグ"
    />
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

function NameMasterSettingsPage({
  description,
  initialItems,
  inputLabel,
  messageId,
  title,
}: {
  description: string
  initialItems: ReadonlyArray<NameMasterItem>
  inputLabel: string
  messageId: string
  title: string
}) {
  const [inputValue, setInputValue] = useState('')
  const [items, setItems] = useState<ReadonlyArray<NameMasterItem>>(
    () => initialItems,
  )
  const normalizedName = inputValue.trim()
  const isDuplicateName = items.some(
    (item) =>
      item.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase(),
  )
  const canAdd = normalizedName.length > 0 && !isDuplicateName
  const message =
    normalizedName.length === 0
      ? null
      : isDuplicateName
        ? '同じ名前が登録済みです'
        : null

  const handleAddItem = () => {
    if (!canAdd) {
      return
    }

    setItems((current) => [
      {
        id: getNextMasterId(current),
        name: normalizedName,
      },
      ...current,
    ])
    setInputValue('')
  }

  const handleDeleteItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  return (
    <>
      <SettingsDetailHeader title={title} />

      <section className="grid min-w-0 content-start gap-5 rounded-lg border bg-card p-4">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        <form
          className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
          onSubmit={(event) => {
            event.preventDefault()
            handleAddItem()
          }}
        >
          <label className="grid min-w-0 gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              {inputLabel}
            </span>
            <Input
              aria-describedby={message ? messageId : undefined}
              aria-invalid={message ? 'true' : undefined}
              className="bg-background"
              onChange={(event) => setInputValue(event.currentTarget.value)}
              type="text"
              value={inputValue}
            />
          </label>
          <Button className="h-11 px-3" disabled={!canAdd} type="submit">
            <PlusIcon data-icon="inline-start" />
            追加
          </Button>
        </form>

        {message ? (
          <p className="text-sm font-medium text-destructive" id={messageId}>
            {message}
          </p>
        ) : null}

        <NameMasterList items={items} onDeleteItem={handleDeleteItem} />
      </section>
    </>
  )
}

function CategoryMasterSettingsPage({
  initialItems,
}: {
  initialItems: ReadonlyArray<CategoryMasterItem>
}) {
  const [nameInput, setNameInput] = useState('')
  const [slugInput, setSlugInput] = useState('')
  const [items, setItems] = useState<ReadonlyArray<CategoryMasterItem>>(
    () => initialItems,
  )
  const normalizedName = nameInput.trim()
  const normalizedSlug = slugInput.trim().toLowerCase()
  const isDuplicateName = items.some(
    (item) =>
      item.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase(),
  )
  const isDuplicateSlug = items.some((item) => item.slug === normalizedSlug)
  const isValidSlug =
    normalizedSlug.length > 0 && slugPattern.test(normalizedSlug)
  const canAdd =
    normalizedName.length > 0 &&
    isValidSlug &&
    !isDuplicateName &&
    !isDuplicateSlug
  const message =
    normalizedName.length === 0 && normalizedSlug.length === 0
      ? null
      : normalizedName.length === 0
        ? 'カテゴリ名を入力してください'
        : !isValidSlug
          ? 'スラッグは半角英数字とハイフンで入力してください'
          : isDuplicateName
            ? '同じカテゴリ名が登録済みです'
            : isDuplicateSlug
              ? '同じスラッグが登録済みです'
              : null

  const handleAddCategory = () => {
    if (!canAdd) {
      return
    }

    setItems((current) => [
      {
        id: getNextMasterId(current),
        name: normalizedName,
        slug: normalizedSlug,
      },
      ...current,
    ])
    setNameInput('')
    setSlugInput('')
  }

  const handleDeleteCategory = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  return (
    <>
      <SettingsDetailHeader title="カテゴリ" />

      <section className="grid min-w-0 content-start gap-5 rounded-lg border bg-card p-4">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">カテゴリ</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            商品カテゴリとカテゴリページのURLスラッグを管理します。
          </p>
        </div>

        <form
          className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end"
          onSubmit={(event) => {
            event.preventDefault()
            handleAddCategory()
          }}
        >
          <label className="grid min-w-0 gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              カテゴリ名
            </span>
            <Input
              aria-describedby={message ? 'category-master-message' : undefined}
              aria-invalid={message ? 'true' : undefined}
              className="bg-background"
              onChange={(event) => setNameInput(event.currentTarget.value)}
              type="text"
              value={nameInput}
            />
          </label>

          <label className="grid min-w-0 gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              スラッグ
            </span>
            <Input
              aria-describedby={message ? 'category-master-message' : undefined}
              aria-invalid={message ? 'true' : undefined}
              className="bg-background"
              onChange={(event) => setSlugInput(event.currentTarget.value)}
              type="text"
              value={slugInput}
            />
          </label>

          <Button className="h-11 px-3" disabled={!canAdd} type="submit">
            <PlusIcon data-icon="inline-start" />
            追加
          </Button>
        </form>

        {message ? (
          <p
            className="text-sm font-medium text-destructive"
            id="category-master-message"
          >
            {message}
          </p>
        ) : null}

        <CategoryMasterList items={items} onDeleteItem={handleDeleteCategory} />
      </section>
    </>
  )
}

function NameMasterList({
  items,
  onDeleteItem,
}: {
  items: ReadonlyArray<NameMasterItem>
  onDeleteItem: (id: number) => void
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border">
      <div className="grid grid-cols-[48px_minmax(0,1fr)_56px] items-center gap-3 border-b bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
        <span>No</span>
        <span>名称</span>
        <span aria-hidden="true" />
      </div>

      <div className="divide-y">
        {items.map((item, index) => (
          <article
            className="grid grid-cols-[48px_minmax(0,1fr)_56px] items-center gap-3 px-4 py-3"
            key={item.id}
          >
            <span className="text-sm font-medium tabular-nums">
              {index + 1}
            </span>
            <span className="truncate text-sm font-semibold">{item.name}</span>
            <Button
              aria-label={`${item.name}を削除`}
              className="justify-self-end"
              onClick={() => onDeleteItem(item.id)}
              size="icon-sm"
              type="button"
              variant="outline"
            >
              <Trash2Icon aria-hidden="true" />
            </Button>
          </article>
        ))}
      </div>
    </div>
  )
}

function CategoryMasterList({
  items,
  onDeleteItem,
}: {
  items: ReadonlyArray<CategoryMasterItem>
  onDeleteItem: (id: number) => void
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border">
      <div className="min-w-0 overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[48px_minmax(160px,1fr)_minmax(180px,1fr)_56px] items-center gap-3 border-b bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>No</span>
            <span>カテゴリ名</span>
            <span>スラッグ</span>
            <span aria-hidden="true" />
          </div>

          <div className="divide-y">
            {items.map((item, index) => (
              <article
                className="grid grid-cols-[48px_minmax(160px,1fr)_minmax(180px,1fr)_56px] items-center gap-3 px-4 py-3"
                key={item.id}
              >
                <span className="text-sm font-medium tabular-nums">
                  {index + 1}
                </span>
                <span className="truncate text-sm font-semibold">
                  {item.name}
                </span>
                <span className="truncate text-sm font-medium text-muted-foreground">
                  {item.slug}
                </span>
                <Button
                  aria-label={`${item.name}を削除`}
                  className="justify-self-end"
                  onClick={() => onDeleteItem(item.id)}
                  size="icon-sm"
                  type="button"
                  variant="outline"
                >
                  <Trash2Icon aria-hidden="true" />
                </Button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getNextMasterId<TItem extends { id: number }>(
  items: ReadonlyArray<TItem>,
) {
  return Math.max(0, ...items.map((item) => item.id)) + 1
}
