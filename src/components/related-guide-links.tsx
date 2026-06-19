import {
  ArrowRightIcon,
  FileTextIcon,
  MailIcon,
  ShieldCheckIcon,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import { cn } from '@/lib/utils'

type GuidePage = 'contact' | 'law' | 'privacy'

type GuideLink = {
  description: string
  icon: LucideIcon
  id: GuidePage
  label: string
  to: string
}

const guideLinks: GuideLink[] = [
  {
    description: '商品、在庫、注文、配送について相談できます。',
    icon: MailIcon,
    id: 'contact',
    label: 'お問い合わせ',
    to: '/contact',
  },
  {
    description: '販売事業者、支払方法、返品について確認できます。',
    icon: FileTextIcon,
    id: 'law',
    label: '特定商取引法に基づく表記',
    to: '/law',
  },
  {
    description: '個人情報の取扱いやCookie利用について確認できます。',
    icon: ShieldCheckIcon,
    id: 'privacy',
    label: 'プライバシーポリシー',
    to: '/privacy',
  },
]

export function RelatedGuideLinks({
  className,
  current,
  text = '購入前後の確認に使うページをまとめています。',
  title = '関連ページ',
}: {
  className?: string
  current?: GuidePage
  text?: string
  title?: string
}) {
  const links = guideLinks.filter((link) => link.id !== current)

  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>

      <div className="mt-3 grid gap-1">
        {links.map((link) => (
          <Link
            className="-mx-2 grid grid-cols-[2rem_minmax(0,1fr)_1rem] items-center gap-2 rounded-md px-2 py-2 hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            key={link.id}
            to={link.to}
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <link.icon aria-hidden="true" className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm leading-5 font-semibold">
                {link.label}
              </span>
              <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                {link.description}
              </span>
            </span>
            <ArrowRightIcon
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
