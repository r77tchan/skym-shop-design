import {
  ArrowLeftIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react'
import { Dialog } from 'radix-ui'
import { type FormEvent, useState } from 'react'
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
  const [editingItem, setEditingItem] = useState<NameMasterItem | null>(null)
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

  const handleUpdateItem = (updatedItem: NameMasterItem) => {
    setItems((current) =>
      current.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    )
    setEditingItem(null)
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

        <NameMasterList
          items={items}
          onDeleteItem={handleDeleteItem}
          onEditItem={setEditingItem}
        />
      </section>

      <Dialog.Root
        onOpenChange={(open) => {
          if (!open) {
            setEditingItem(null)
          }
        }}
        open={editingItem !== null}
      >
        {editingItem ? (
          <NameMasterEditDialogContent
            displayId={getMasterDisplayId(items, editingItem.id)}
            inputLabel={inputLabel}
            item={editingItem}
            items={items}
            key={editingItem.id}
            onSaveItem={handleUpdateItem}
            title={title}
          />
        ) : null}
      </Dialog.Root>
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
  const [editingItem, setEditingItem] = useState<CategoryMasterItem | null>(
    null,
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

  const handleUpdateCategory = (updatedItem: CategoryMasterItem) => {
    setItems((current) =>
      current.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    )
    setEditingItem(null)
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

        <CategoryMasterList
          items={items}
          onDeleteItem={handleDeleteCategory}
          onEditItem={setEditingItem}
        />
      </section>

      <Dialog.Root
        onOpenChange={(open) => {
          if (!open) {
            setEditingItem(null)
          }
        }}
        open={editingItem !== null}
      >
        {editingItem ? (
          <CategoryMasterEditDialogContent
            displayId={getMasterDisplayId(items, editingItem.id)}
            item={editingItem}
            items={items}
            key={editingItem.id}
            onSaveItem={handleUpdateCategory}
          />
        ) : null}
      </Dialog.Root>
    </>
  )
}

function NameMasterList({
  items,
  onDeleteItem,
  onEditItem,
}: {
  items: ReadonlyArray<NameMasterItem>
  onDeleteItem: (id: number) => void
  onEditItem: (item: NameMasterItem) => void
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border">
      <div className="grid grid-cols-[48px_64px_minmax(0,1fr)_48px_48px] items-center gap-3 border-b bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
        <span>No</span>
        <span>ID</span>
        <span>名称</span>
        <span>編集</span>
        <span>削除</span>
      </div>

      <div className="divide-y">
        {items.map((item, index) => (
          <article
            className="grid grid-cols-[48px_64px_minmax(0,1fr)_48px_48px] items-center gap-3 px-4 py-3"
            key={item.id}
          >
            <span className="text-sm font-medium tabular-nums">
              {index + 1}
            </span>
            <span className="text-sm font-medium tabular-nums">
              {items.length - index}
            </span>
            <span className="truncate text-sm font-semibold">{item.name}</span>
            <Button
              aria-label={`${item.name}を編集`}
              className="justify-self-start"
              onClick={() => onEditItem(item)}
              size="icon-sm"
              type="button"
              variant="outline"
            >
              <PencilIcon aria-hidden="true" />
            </Button>
            <Button
              aria-label={`${item.name}を削除`}
              className="justify-self-start"
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
  onEditItem,
}: {
  items: ReadonlyArray<CategoryMasterItem>
  onDeleteItem: (id: number) => void
  onEditItem: (item: CategoryMasterItem) => void
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border">
      <div className="min-w-0 overflow-x-auto">
        <div className="min-w-[736px]">
          <div className="grid grid-cols-[48px_64px_minmax(160px,1fr)_minmax(180px,1fr)_48px_48px] items-center gap-3 border-b bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>No</span>
            <span>ID</span>
            <span>カテゴリ名</span>
            <span>スラッグ</span>
            <span>編集</span>
            <span>削除</span>
          </div>

          <div className="divide-y">
            {items.map((item, index) => (
              <article
                className="grid grid-cols-[48px_64px_minmax(160px,1fr)_minmax(180px,1fr)_48px_48px] items-center gap-3 px-4 py-3"
                key={item.id}
              >
                <span className="text-sm font-medium tabular-nums">
                  {index + 1}
                </span>
                <span className="text-sm font-medium tabular-nums">
                  {items.length - index}
                </span>
                <span className="truncate text-sm font-semibold">
                  {item.name}
                </span>
                <span className="truncate text-sm font-medium text-muted-foreground">
                  {item.slug}
                </span>
                <Button
                  aria-label={`${item.name}を編集`}
                  className="justify-self-start"
                  onClick={() => onEditItem(item)}
                  size="icon-sm"
                  type="button"
                  variant="outline"
                >
                  <PencilIcon aria-hidden="true" />
                </Button>
                <Button
                  aria-label={`${item.name}を削除`}
                  className="justify-self-start"
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

function NameMasterEditDialogContent({
  displayId,
  inputLabel,
  item,
  items,
  onSaveItem,
  title,
}: {
  displayId: number
  inputLabel: string
  item: NameMasterItem
  items: ReadonlyArray<NameMasterItem>
  onSaveItem: (item: NameMasterItem) => void
  title: string
}) {
  const [nameInput, setNameInput] = useState(item.name)
  const normalizedName = nameInput.trim()
  const isDuplicateName = items.some(
    (currentItem) =>
      currentItem.id !== item.id &&
      currentItem.name.toLocaleLowerCase() ===
        normalizedName.toLocaleLowerCase(),
  )
  const message =
    normalizedName.length === 0
      ? `${inputLabel}を入力してください`
      : isDuplicateName
        ? '同じ名前が登録済みです'
        : null
  const canSave = message === null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSave) {
      return
    }

    onSaveItem({
      ...item,
      name: normalizedName,
    })
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/45" />
      <Dialog.Content className="fixed top-1/2 left-1/2 z-[80] grid max-h-[calc(100svh-2rem)] w-[min(calc(100vw-2rem),34rem)] -translate-x-1/2 -translate-y-1/2 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-lg border bg-background shadow-2xl outline-none">
        <div className="flex min-w-0 items-start justify-between gap-4 border-b p-5">
          <div className="min-w-0">
            <Dialog.Title className="font-heading text-xl font-semibold">
              {title}を編集
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
              ID {displayId} の内容を更新します。
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

        <form
          className="grid min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_auto]"
          onSubmit={handleSubmit}
        >
          <div className="grid min-h-0 min-w-0 content-start gap-4 overflow-y-auto p-5">
            <MasterDisplayField label="ID" value={String(displayId)} />

            <label className="grid min-w-0 gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                {inputLabel}
              </span>
              <Input
                aria-describedby={
                  message ? 'name-master-edit-message' : undefined
                }
                aria-invalid={message ? 'true' : undefined}
                className="bg-background"
                onChange={(event) => setNameInput(event.currentTarget.value)}
                type="text"
                value={nameInput}
              />
            </label>

            {message ? (
              <p
                className="text-sm font-medium text-destructive"
                id="name-master-edit-message"
              >
                {message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t p-5 sm:flex-row sm:items-center sm:justify-end">
            <Dialog.Close asChild>
              <Button type="button" variant="outline">
                キャンセル
              </Button>
            </Dialog.Close>
            <Button disabled={!canSave} type="submit">
              保存
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

function CategoryMasterEditDialogContent({
  displayId,
  item,
  items,
  onSaveItem,
}: {
  displayId: number
  item: CategoryMasterItem
  items: ReadonlyArray<CategoryMasterItem>
  onSaveItem: (item: CategoryMasterItem) => void
}) {
  const [nameInput, setNameInput] = useState(item.name)
  const [slugInput, setSlugInput] = useState(item.slug)
  const normalizedName = nameInput.trim()
  const normalizedSlug = slugInput.trim().toLowerCase()
  const isDuplicateName = items.some(
    (currentItem) =>
      currentItem.id !== item.id &&
      currentItem.name.toLocaleLowerCase() ===
        normalizedName.toLocaleLowerCase(),
  )
  const isDuplicateSlug = items.some(
    (currentItem) =>
      currentItem.id !== item.id && currentItem.slug === normalizedSlug,
  )
  const isValidSlug =
    normalizedSlug.length > 0 && slugPattern.test(normalizedSlug)
  const message =
    normalizedName.length === 0 && normalizedSlug.length === 0
      ? 'カテゴリ名とスラッグを入力してください'
      : normalizedName.length === 0
        ? 'カテゴリ名を入力してください'
        : !isValidSlug
          ? 'スラッグは半角英数字とハイフンで入力してください'
          : isDuplicateName
            ? '同じカテゴリ名が登録済みです'
            : isDuplicateSlug
              ? '同じスラッグが登録済みです'
              : null
  const canSave = message === null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSave) {
      return
    }

    onSaveItem({
      ...item,
      name: normalizedName,
      slug: normalizedSlug,
    })
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/45" />
      <Dialog.Content className="fixed top-1/2 left-1/2 z-[80] grid max-h-[calc(100svh-2rem)] w-[min(calc(100vw-2rem),38rem)] -translate-x-1/2 -translate-y-1/2 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-lg border bg-background shadow-2xl outline-none">
        <div className="flex min-w-0 items-start justify-between gap-4 border-b p-5">
          <div className="min-w-0">
            <Dialog.Title className="font-heading text-xl font-semibold">
              カテゴリを編集
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
              ID {displayId} の内容を更新します。
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

        <form
          className="grid min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_auto]"
          onSubmit={handleSubmit}
        >
          <div className="grid min-h-0 min-w-0 content-start gap-4 overflow-y-auto p-5">
            <MasterDisplayField label="ID" value={String(displayId)} />

            <label className="grid min-w-0 gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                カテゴリ名
              </span>
              <Input
                aria-describedby={
                  message ? 'category-master-edit-message' : undefined
                }
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
                aria-describedby={
                  message ? 'category-master-edit-message' : undefined
                }
                aria-invalid={message ? 'true' : undefined}
                className="bg-background"
                onChange={(event) => setSlugInput(event.currentTarget.value)}
                type="text"
                value={slugInput}
              />
            </label>

            {message ? (
              <p
                className="text-sm font-medium text-destructive"
                id="category-master-edit-message"
              >
                {message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t p-5 sm:flex-row sm:items-center sm:justify-end">
            <Dialog.Close asChild>
              <Button type="button" variant="outline">
                キャンセル
              </Button>
            </Dialog.Close>
            <Button disabled={!canSave} type="submit">
              保存
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

function MasterDisplayField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex h-11 min-w-0 items-center rounded-lg border bg-muted/35 px-3 text-base font-semibold md:text-sm">
        {value}
      </div>
    </div>
  )
}

function getMasterDisplayId<TItem extends { id: number }>(
  items: ReadonlyArray<TItem>,
  itemId: number,
) {
  const index = items.findIndex((item) => item.id === itemId)

  return index === -1 ? itemId : items.length - index
}

function getNextMasterId<TItem extends { id: number }>(
  items: ReadonlyArray<TItem>,
) {
  return Math.max(0, ...items.map((item) => item.id)) + 1
}
