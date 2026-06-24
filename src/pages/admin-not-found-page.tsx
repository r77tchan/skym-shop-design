import { ArrowLeftIcon, FileQuestionIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router'

import { Button } from '@/components/ui/button'

export function AdminNotFoundPage() {
  const { pathname } = useLocation()

  return (
    <>
      <section className="border-b pb-5">
        <div className="flex h-10 items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
              ページが見つかりません
            </h1>
          </div>
        </div>
      </section>

      <section className="grid min-h-[360px] place-items-center rounded-lg border bg-card p-6 text-center">
        <div className="grid max-w-md gap-5">
          <span className="mx-auto grid size-14 place-items-center rounded-lg bg-muted text-muted-foreground">
            <FileQuestionIcon aria-hidden="true" className="size-7" />
          </span>

          <div className="grid gap-2">
            <p className="font-heading text-lg font-semibold">
              管理画面内にこのページはありません
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {pathname} は存在しないか、まだ管理画面に追加されていません。
            </p>
          </div>

          <div className="flex justify-center">
            <Button asChild>
              <Link to="/admin">
                <ArrowLeftIcon data-icon="inline-start" />
                ホームへ戻る
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
