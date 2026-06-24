import { Link } from 'react-router'

import { ThemeToggle } from '@/components/theme-toggle'
import { assetUrl } from '@/lib/asset-url'
import { companyName, companyUrl, shopDescription } from '@/lib/shop-content'

const footerLinkClassName =
  'group -mx-1.5 inline-flex min-h-8 items-center gap-2 rounded-md px-1.5 text-sm text-footer-muted hover:bg-white/8 hover:text-footer-foreground focus-visible:ring-2 focus-visible:ring-footer-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-footer focus-visible:outline-none'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-footer-border bg-footer text-footer-foreground">
      <div className="mx-auto grid max-w-7xl gap-section px-gutter py-section md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(140px,180px))]">
        <div>
          <Link
            className="-mx-1.5 inline-flex min-h-9 items-center gap-2 rounded-md px-1.5 font-heading text-lg font-semibold hover:bg-white/8 hover:text-footer-muted focus-visible:ring-2 focus-visible:ring-footer-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-footer focus-visible:outline-none"
            to="/"
          >
            <img
              alt=""
              aria-hidden="true"
              className="size-5 rounded-full"
              src={assetUrl(
                '/skym-shop-assets/images/theme/skymshop-favicon.png',
              )}
            />
            SKYMSHOP
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-footer-muted">
            <a
              className="relative inline-flex items-center gap-1.5 rounded-sm after:pointer-events-none after:absolute after:right-0 after:bottom-[2px] after:left-0 after:border-b after:border-footer-muted/70 after:content-[''] hover:text-footer-foreground hover:after:border-footer-foreground focus-visible:ring-2 focus-visible:ring-footer-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-footer focus-visible:outline-none"
              href={companyUrl}
            >
              <img
                alt=""
                aria-hidden="true"
                className="size-4 shrink-0"
                src={assetUrl('/favicon.ico')}
              />
              {companyName}
            </a>
            {shopDescription.slice(companyName.length)}
          </p>
          <div className="mt-5">
            <p className="text-sm font-semibold text-footer-foreground">
              THEME
            </p>
            <ThemeToggle
              activeButtonClassName="bg-footer-foreground text-footer hover:bg-footer-foreground hover:text-footer"
              buttonClassName="text-footer-muted hover:bg-white/10 hover:text-footer-foreground focus-visible:border-footer-foreground/40 focus-visible:ring-footer-foreground/30"
              className="mt-2 border-footer-border bg-white/8 text-footer-muted"
            />
          </div>
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
            { label: 'お問い合わせ', to: '/contact' },
            { label: '特定商取引法に基づく表記', to: '/law' },
            { label: 'プライバシーポリシー', to: '/privacy' },
          ]}
          title="GUIDE"
        />
        <FooterColumn
          items={[
            {
              href: 'https://www.instagram.com/_skymshop/',
              icon: '/skym-shop-assets/images/social/instagram.svg',
              label: 'Instagram',
            },
            {
              href: 'https://x.com/skymshop',
              icon: '/skym-shop-assets/images/social/x.svg',
              label: 'X',
            },
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
  icon?: string
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
              <a
                className={footerLinkClassName}
                href={item.href}
                rel="noreferrer"
                target="_blank"
              >
                {item.icon ? (
                  <img
                    alt=""
                    aria-hidden="true"
                    className="size-4 opacity-80 invert transition-opacity group-hover:opacity-100"
                    src={assetUrl(item.icon)}
                  />
                ) : null}
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
