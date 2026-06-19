import { Link } from 'react-router'

import { companyName, companyUrl, shopDescription } from '@/lib/shop-content'

const footerLinkClassName =
  '-mx-1.5 inline-flex min-h-8 items-center rounded-md px-1.5 text-sm text-footer-muted hover:bg-white/8 hover:text-footer-foreground focus-visible:ring-2 focus-visible:ring-footer-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-footer focus-visible:outline-none'

export function SiteFooter() {
  return (
    <footer className="border-t border-footer-border bg-footer text-footer-foreground">
      <div className="mx-auto grid max-w-7xl gap-section px-gutter py-section md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(140px,180px))]">
        <div>
          <Link
            className="-mx-1.5 inline-flex min-h-9 items-center rounded-md px-1.5 font-heading text-lg font-semibold hover:bg-white/8 hover:text-footer-muted focus-visible:ring-2 focus-visible:ring-footer-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-footer focus-visible:outline-none"
            to="/"
          >
            SKYMSHOP
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-footer-muted">
            <a
              className="rounded-sm underline decoration-footer-muted/70 decoration-1 underline-offset-4 hover:text-footer-foreground hover:decoration-footer-foreground focus-visible:ring-2 focus-visible:ring-footer-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-footer focus-visible:outline-none"
              href={companyUrl}
            >
              {companyName}
            </a>
            {shopDescription.slice(companyName.length)}
          </p>
        </div>
        <FooterColumn
          items={[
            { label: 'トップページ', to: '/' },
            { label: '商品一覧', to: '/items' },
            { label: 'お知らせ一覧', to: '/news' },
          ]}
          title="MENU"
        />
        <FooterColumn
          items={[
            { href: '#', label: 'お問い合わせ' },
            { href: '#', label: '特定商取引法' },
            { href: '#', label: 'プライバシーポリシー' },
          ]}
          title="GUIDE"
        />
        <FooterColumn
          items={[
            { href: '#', label: 'Instagram' },
            { href: '#', label: 'X' },
            { href: '#', label: 'LINE' },
          ]}
          title="SNS"
        />
        <p className="text-xs text-footer-muted md:col-span-4 md:justify-self-end">
          Copyright © SKYM, Inc. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

type FooterLinkItem = {
  href?: string
  label: string
  to?: string
}

function FooterColumn({
  items,
  title,
}: {
  items: FooterLinkItem[]
  title: string
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-footer-foreground">{title}</p>
      <ul className="mt-2 grid gap-0.5">
        {items.map((item) => (
          <li key={item.label}>
            {item.to ? (
              <Link className={footerLinkClassName} to={item.to}>
                {item.label}
              </Link>
            ) : (
              <a className={footerLinkClassName} href={item.href}>
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
