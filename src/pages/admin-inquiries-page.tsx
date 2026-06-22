export function AdminInquiriesPage() {
  return <AdminPageHeader title="お問い合わせ" />
}

function AdminPageHeader({ title }: { title: string }) {
  return (
    <section className="border-b pb-5">
      <div className="flex h-10 items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold tracking-normal sm:text-3xl">
            {title}
          </h1>
        </div>
      </div>
    </section>
  )
}
