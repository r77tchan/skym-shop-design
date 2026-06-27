import {
  ArrowLeftIcon,
  ChevronDownIcon,
  MailIcon,
  SaveIcon,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  adminInquiryStatusOptions,
  findAdminInquiryById,
  getAdminInquiryStatusClassName,
  type AdminInquiry,
  type AdminInquiryStatus,
} from '@/lib/admin-inquiries'
import {
  fieldLabelClassName,
  fieldWrapperClassName,
  selectFieldClassName,
} from '@/lib/ui-styles'
import { cn } from '@/lib/utils'


export function AdminInquiryDetailPage() {
  const { inquiryId } = useParams()
  const inquiry = findAdminInquiryById(inquiryId)

  if (!inquiry) {
    return <InquiryNotFound inquiryId={inquiryId} />
  }

  return <AdminInquiryDetail inquiry={inquiry} />
}

function AdminInquiryDetail({ inquiry }: { inquiry: AdminInquiry }) {
  const navigate = useNavigate()
  const [statusValue, setStatusValue] = useState(inquiry.status)

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

            <Button className="h-10 px-3" type="button">
              <SaveIcon data-icon="inline-start" />
              保存
            </Button>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge className="bg-primary/10 text-primary">
                  ID {inquiry.id}
                </Badge>
                <Badge className="bg-secondary text-secondary-foreground">
                  {inquiry.category}
                </Badge>
                <Badge
                  className={cn(
                    'w-fit',
                    getAdminInquiryStatusClassName(statusValue),
                  )}
                >
                  {statusValue}
                </Badge>
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
                {inquiry.subject}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {inquiry.name} / {inquiry.receivedAt}
              </p>
            </div>
          </div>
        </div>
      </section>

      <form className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid min-w-0 content-start gap-5">
          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">
                お問い合わせ内容
              </h2>
            </div>

            <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
              <ReadOnlyField label="種別" value={inquiry.category} />
              <ReadOnlyField label="件名" value={inquiry.subject} />
            </div>

            <ReadOnlyField
              label="内容"
              multiline
              value={inquiry.body}
              variant="message"
            />
          </section>

          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-heading text-base font-semibold">
                お問い合わせ者
              </h2>

              <Button asChild className="w-fit" size="sm" variant="outline">
                <a href={`mailto:${inquiry.email}`}>
                  <MailIcon data-icon="inline-start" />
                  返信メール作成
                </a>
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <ReadOnlyField label="氏名" value={inquiry.name} />
              <ReadOnlyField label="メールアドレス" value={inquiry.email} />
            </div>
          </section>
        </div>

        <aside className="grid min-w-0 content-start gap-5">
          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">対応</h2>
            </div>

            <label className={fieldWrapperClassName}>
              <span className={fieldLabelClassName}>ステータス</span>
              <SelectField onChange={setStatusValue} value={statusValue}>
                {adminInquiryStatusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </SelectField>
            </label>
          </section>

          <section className="grid min-w-0 gap-4 rounded-lg border bg-card p-4">
            <div className="min-w-0">
              <h2 className="font-heading text-base font-semibold">受付情報</h2>
            </div>

            <div className="grid gap-2 text-sm">
              <InfoRow label="ID" value={String(inquiry.id)} />
              <InfoRow label="受付日時" value={inquiry.receivedAt} />
              <InfoRow label="種別" value={inquiry.category} />
            </div>
          </section>
        </aside>
      </form>
    </>
  )
}

function SelectField({
  children,
  onChange,
  value,
}: {
  children: ReactNode
  onChange: (value: AdminInquiryStatus) => void
  value: AdminInquiryStatus
}) {
  return (
    <span className="relative">
      <select
        className={selectFieldClassName}
        onChange={(event) =>
          onChange(event.currentTarget.value as AdminInquiryStatus)
        }
        value={value}
      >
        {children}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </span>
  )
}

function ReadOnlyField({
  className,
  emptyText = '-',
  label,
  multiline,
  value,
  variant = 'plain',
}: {
  className?: string
  emptyText?: string
  label: string
  multiline?: boolean
  value: string
  variant?: 'message' | 'plain'
}) {
  const isEmpty = !value

  return (
    <div className={cn('grid min-w-0 content-start gap-1.5', className)}>
      <p className={fieldLabelClassName}>{label}</p>
      <p
        className={cn(
          'min-w-0 text-sm leading-6 font-semibold text-foreground',
          multiline ? 'whitespace-pre-wrap' : 'truncate',
          isEmpty && 'font-medium text-muted-foreground',
          variant === 'message' &&
            'rounded-lg bg-muted/35 p-4 leading-7 font-medium',
        )}
      >
        {isEmpty ? emptyText : value}
      </p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate font-medium">{value || '-'}</span>
    </div>
  )
}

function InquiryNotFound({ inquiryId }: { inquiryId?: string }) {
  return (
    <>
      <section className="border-b pb-5">
        <div className="flex h-10 items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
              お問い合わせが見つかりません
            </h1>
          </div>
        </div>
      </section>

      <section className="grid min-h-[320px] place-items-center rounded-lg border bg-card p-6 text-center">
        <div className="grid max-w-md gap-5">
          <div className="grid gap-2">
            <p className="font-heading text-lg font-semibold">
              お問い合わせID {inquiryId ?? '-'} は表示できません
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              お問い合わせ一覧から対象のお問い合わせを選択してください。
            </p>
          </div>

          <div className="flex justify-center">
            <Button asChild>
              <Link to="/admin/inquiries">
                <ArrowLeftIcon data-icon="inline-start" />
                お問い合わせ一覧へ戻る
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
