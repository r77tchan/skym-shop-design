import type { ReactNode } from 'react'

export function AdminPageHeader({
  title,
  action,
}: {
  title: string
  action?: ReactNode
}) {
  return (
    <section className="border-b pb-5">
      <div className="flex h-10 items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
            {title}
          </h1>
        </div>

        {action ? (
          <div className="flex shrink-0 items-center gap-2">{action}</div>
        ) : null}
      </div>
    </section>
  )
}
