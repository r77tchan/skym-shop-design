import { ShieldCheckIcon } from 'lucide-react'
import { Link } from 'react-router'

import { RelatedGuideLinks } from '@/components/related-guide-links'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

const privacyPolicyItems = [
  {
    title: '個人情報の定義',
    paragraphs: [
      '個人情報とは、氏名、住所、電話番号、メールアドレス、購入履歴など、特定の個人を識別できる情報を指します。',
    ],
  },
  {
    title: '個人情報の利用目的',
    paragraphs: [
      '当ショップは、お客様の個人情報を、注文商品の発送、決済、問い合わせ対応、サービス改善、重要なお知らせの連絡、不正利用の防止などに必要な範囲で利用します。',
    ],
    list: [
      '商品の販売、発送、アフターサポートのため',
      'お問い合わせやご相談への回答のため',
      '商品、サービス、規約変更などの案内のため',
      'サイトやサービスの改善、統計データ作成のため',
      '不正利用や規約違反への対応のため',
    ],
  },
  {
    title: '利用目的の変更',
    paragraphs: [
      '利用目的を変更する場合は、変更前の目的と合理的に関連する範囲で行い、必要に応じてサイト上で公表します。',
    ],
  },
  {
    title: '個人情報の取得と管理',
    paragraphs: [
      '当ショップは、適正な方法で個人情報を取得し、不正な手段による取得は行いません。',
      '個人情報の漏えい、紛失、改ざんなどを防ぐため、必要な安全管理に努めます。業務上必要な範囲で外部サービスへ取扱いを委託する場合も、適切な管理が行われるよう確認します。',
    ],
  },
  {
    title: '第三者提供',
    paragraphs: [
      '法令に基づく場合、生命・身体・財産の保護に必要な場合、業務委託や事業承継に伴う場合などを除き、本人の同意なく個人情報を第三者へ提供しません。',
    ],
  },
  {
    title: '開示・訂正・利用停止',
    paragraphs: [
      'お客様ご本人から個人情報の開示、訂正、追加、削除、利用停止などの請求があった場合は、本人確認のうえ、法令に従って適切に対応します。',
    ],
  },
  {
    title: 'Cookie・アクセス解析',
    paragraphs: [
      '当ショップでは、サイトの利用状況把握やサービス改善のため、Cookieおよび類似技術を利用する場合があります。',
      'Google Analyticsなどの解析サービスを利用する場合、取得される情報には特定の個人を識別する情報は含まれません。Cookieを無効にしたい場合は、ブラウザ設定から変更できます。',
    ],
    links: [
      {
        href: 'https://www.google.com/analytics/terms/jp.html',
        label: 'Google アナリティクス利用規約',
      },
      {
        href: 'https://policies.google.com/privacy?hl=ja',
        label: 'Google プライバシーポリシー',
      },
    ],
  },
  {
    title: 'お問い合わせ',
    paragraphs: [
      '個人情報の取扱いに関するお問い合わせは、特定商取引法に基づく表記の連絡先、またはお問い合わせフォームよりご連絡ください。',
    ],
  },
  {
    title: '継続的改善',
    paragraphs: [
      '当ショップは、個人情報の取扱いを必要に応じて見直し、継続的な改善に努めます。内容を変更する場合は、本ページ上でお知らせします。',
    ],
  },
] as const

const externalLinkClassName =
  'w-fit rounded-sm text-xs font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none'

export function PrivacyPolicyPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <SiteHeader />

      <section className="border-b bg-muted/35 pt-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-gutter py-10 sm:py-12">
          <nav
            aria-label="パンくず"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
          >
            <Link
              className="underline decoration-foreground/35 underline-offset-4 hover:text-foreground hover:decoration-foreground"
              to="/"
            >
              トップ
            </Link>
            <span aria-hidden="true" className="text-border">
              /
            </span>
            <span className="text-foreground">プライバシーポリシー</span>
          </nav>

          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-primary">PRIVACY POLICY</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
              プライバシーポリシー
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              個人情報の取扱い、利用目的、Cookieの利用、お問い合わせ先についてまとめています。
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-6 px-gutter py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-10">
          <div className="overflow-hidden rounded-lg border bg-card">
            {privacyPolicyItems.map((item, index) => (
              <section
                className="grid gap-3 border-b p-5 last:border-b-0 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-6"
                key={item.title}
              >
                <h2 className="text-sm font-semibold text-muted-foreground">
                  {index + 1}. {item.title}
                </h2>
                <div className="grid gap-3 text-sm leading-6 font-medium">
                  {item.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {'list' in item ? (
                    <ul className="grid gap-1.5 text-sm text-foreground/86">
                      {item.list.map((listItem) => (
                        <li className="flex gap-2" key={listItem}>
                          <span aria-hidden="true" className="text-primary">
                            -
                          </span>
                          <span>{listItem}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {'links' in item ? (
                    <div className="grid gap-1.5">
                      {item.links.map((link) => (
                        <a
                          className={externalLinkClassName}
                          href={link.href}
                          key={link.href}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </section>
            ))}
          </div>

          <aside className="grid content-start gap-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <ShieldCheckIcon aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">個人情報の取扱い</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    注文、配送、問い合わせ対応に必要な範囲で情報を取り扱います。
                  </p>
                </div>
              </div>
            </div>

            <RelatedGuideLinks
              current="privacy"
              text="販売事業者の表記や問い合わせ先もあわせて確認できます。"
            />
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
