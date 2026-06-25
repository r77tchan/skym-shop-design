import {
  ArrowLeftIcon,
  CheckIcon,
  PlusIcon,
  ShieldCheckIcon,
  Trash2Icon,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type AllowedAdminEmail = {
  addedAt: string
  email: string
  status: '有効' | '招待中'
}

const allowedAdminEmails: AllowedAdminEmail[] = [
  {
    addedAt: '2026/06/22',
    email: 'tatsuya.asakawa@skym.co.jp',
    status: '有効',
  },
  {
    addedAt: '2026/06/22',
    email: 'dummy.dummy@skym.co.jp',
    status: '招待中',
  },
]

const allowedDomain = '@skym.co.jp'
const allowedLocalPartPattern = /^[A-Za-z0-9._%+-]+$/

export function AdminSettingsAuthPage() {
  const [localPartInput, setLocalPartInput] = useState('')
  const [emails, setEmails] =
    useState<ReadonlyArray<AllowedAdminEmail>>(allowedAdminEmails)
  const normalizedLocalPart = localPartInput.trim().toLowerCase()
  const normalizedEmail = `${normalizedLocalPart}${allowedDomain}`
  const isValidLocalPart =
    normalizedLocalPart.length > 0 &&
    allowedLocalPartPattern.test(normalizedLocalPart)
  const isDuplicateEmail = emails.some(
    (item) => item.email.toLowerCase() === normalizedEmail,
  )
  const canAddEmail = isValidLocalPart && !isDuplicateEmail
  const emailMessage =
    normalizedLocalPart.length === 0
      ? null
      : !isValidLocalPart
        ? '@ の前だけを半角英数字と記号 ._%+- で入力してください'
        : isDuplicateEmail
          ? 'このメールアドレスは登録済みです'
          : null

  const handleAddEmail = () => {
    if (!canAddEmail) {
      return
    }

    setEmails((current) => [
      {
        addedAt: '2026/06/22',
        email: normalizedEmail,
        status: '有効',
      },
      ...current,
    ])
    setLocalPartInput('')
  }

  const handleDeleteEmail = (email: string) => {
    setEmails((current) => current.filter((item) => item.email !== email))
  }

  return (
    <>
      <SettingsDetailHeader title="認証設定" />

      <section className="grid min-w-0 gap-5 rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-heading text-base font-semibold">
              Googleログイン
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              管理画面に入れるメールアドレスを登録します。
            </p>
          </div>
          <Badge className="w-fit bg-primary/10 text-primary">
            <ShieldCheckIcon data-icon="inline-start" />
            {allowedDomain}
          </Badge>
        </div>

        <form
          className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.55fr)_auto] lg:items-end admin-top-nav:grid-cols-[minmax(0,1fr)_minmax(260px,0.55fr)_auto] admin-top-nav:items-end"
          onSubmit={(event) => {
            event.preventDefault()
            handleAddEmail()
          }}
        >
          <label className="grid min-w-0 gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              ユーザー名
            </span>
            <Input
              aria-describedby={
                emailMessage ? 'admin-email-message' : undefined
              }
              aria-invalid={emailMessage ? 'true' : undefined}
              className="bg-background"
              onChange={(event) => setLocalPartInput(event.target.value)}
              placeholder="tatsuya.asakawa"
              type="text"
              value={localPartInput}
            />
          </label>
          <div className="grid min-w-0 gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              登録メール
            </span>
            <div className="flex h-11 min-w-0 items-center rounded-lg border bg-muted/35 px-3 text-base font-semibold md:text-sm">
              {normalizedLocalPart ? (
                <span className="min-w-0 truncate">{normalizedEmail}</span>
              ) : (
                <span className="text-muted-foreground">
                  tatsuya.asakawa{allowedDomain}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-end">
            <Button className="h-11 px-3" disabled={!canAddEmail} type="submit">
              <PlusIcon data-icon="inline-start" />
              追加
            </Button>
          </div>
        </form>

        {emailMessage ? (
          <p
            className="text-sm font-medium text-destructive"
            id="admin-email-message"
          >
            {emailMessage}
          </p>
        ) : null}
      </section>

      <AllowedEmailsTable emails={emails} onDeleteEmail={handleDeleteEmail} />
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

function AllowedEmailsTable({
  emails,
  onDeleteEmail,
}: {
  emails: ReadonlyArray<AllowedAdminEmail>
  onDeleteEmail: (email: string) => void
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-lg border bg-card [contain:paint]">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-base font-semibold">
            ログイン許可メール
          </h2>
        </div>
      </div>

      <div className="hidden min-w-0 overflow-x-auto lg:block admin-top-nav:block">
        <div className="min-w-[784px]">
          <div className="grid grid-cols-[48px_64px_minmax(280px,1fr)_104px_112px_72px] items-center gap-3 border-y bg-muted/35 px-4 py-2 text-xs font-medium text-muted-foreground">
            <span>No</span>
            <span>ID</span>
            <span>メールアドレス</span>
            <span>状態</span>
            <span>追加日</span>
            <span aria-hidden="true" />
          </div>

          <div className="divide-y">
            {emails.map((item, index) => (
              <AllowedEmailTableRow
                displayId={emails.length - index}
                displayNo={index + 1}
                item={item}
                key={item.email}
                onDeleteEmail={onDeleteEmail}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid divide-y lg:hidden admin-top-nav:hidden">
        {emails.map((item, index) => (
          <AllowedEmailMobileCard
            displayId={emails.length - index}
            displayNo={index + 1}
            item={item}
            key={item.email}
            onDeleteEmail={onDeleteEmail}
          />
        ))}
      </div>
    </section>
  )
}

function AllowedEmailTableRow({
  displayId,
  displayNo,
  item,
  onDeleteEmail,
}: {
  displayId: number
  displayNo: number
  item: AllowedAdminEmail
  onDeleteEmail: (email: string) => void
}) {
  return (
    <article className="grid grid-cols-[48px_64px_minmax(280px,1fr)_104px_112px_72px] items-center gap-3 px-4 py-3">
      <span className="text-sm font-medium tabular-nums">{displayNo}</span>
      <span className="text-sm font-medium tabular-nums">{displayId}</span>
      <span className="truncate text-sm font-medium">{item.email}</span>
      <AllowedEmailStatusBadge status={item.status} />
      <span className="text-sm font-medium">{item.addedAt}</span>
      <Button
        aria-label={`${item.email}を削除`}
        className="justify-self-end"
        onClick={() => onDeleteEmail(item.email)}
        size="icon-sm"
        type="button"
        variant="outline"
      >
        <Trash2Icon aria-hidden="true" />
      </Button>
    </article>
  )
}

function AllowedEmailMobileCard({
  displayId,
  displayNo,
  item,
  onDeleteEmail,
}: {
  displayId: number
  displayNo: number
  item: AllowedAdminEmail
  onDeleteEmail: (email: string) => void
}) {
  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 p-4">
      <div className="grid min-w-0 gap-3">
        <div className="grid min-w-0 gap-1">
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            No {displayNo} / ID {displayId}
          </span>
          <span className="truncate text-sm font-semibold">{item.email}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AllowedEmailStatusBadge status={item.status} />
          <span className="text-sm font-medium text-muted-foreground">
            {item.addedAt}
          </span>
        </div>
      </div>
      <Button
        aria-label={`${item.email}を削除`}
        onClick={() => onDeleteEmail(item.email)}
        size="icon-sm"
        type="button"
        variant="outline"
      >
        <Trash2Icon aria-hidden="true" />
      </Button>
    </article>
  )
}

function AllowedEmailStatusBadge({
  status,
}: {
  status: AllowedAdminEmail['status']
}) {
  if (status === '招待中') {
    return (
      <Badge className="w-fit bg-muted text-muted-foreground">招待中</Badge>
    )
  }

  return (
    <Badge className="w-fit bg-primary/10 text-primary">
      <CheckIcon data-icon="inline-start" />
      有効
    </Badge>
  )
}
