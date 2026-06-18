import { shopDescription } from '@/lib/shop-content'

export function SiteFooter() {
  return (
    <footer className="border-t border-footer-border bg-footer text-footer-foreground">
      <div className="mx-auto grid max-w-7xl gap-section px-gutter py-section md:grid-cols-[minmax(0,1fr)_repeat(2,minmax(140px,180px))]">
        <div>
          <p className="font-heading text-lg font-semibold">SKYMSHOP</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-footer-muted">
            {shopDescription}
          </p>
        </div>
        <FooterColumn
          items={['お問い合わせ', '特定商取引法', 'プライバシーポリシー']}
          title="GUIDE"
        />
        <FooterColumn items={['Instagram', 'X', 'LINE']} title="SNS" />
        <p className="text-xs text-footer-muted md:col-span-3 md:justify-self-end">
          Copyright © SKYM, Inc. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

function FooterColumn({ items, title }: { items: string[]; title: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-footer-foreground">{title}</p>
      <ul className="mt-3 grid gap-2">
        {items.map((item) => (
          <li key={item}>
            <a
              className="text-sm text-footer-muted hover:text-footer-foreground"
              href="#"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
