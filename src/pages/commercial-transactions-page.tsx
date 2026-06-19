import { FileTextIcon } from 'lucide-react'
import { Link } from 'react-router'

import { RelatedGuideLinks } from '@/components/related-guide-links'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

const commercialTransactionItems = [
  {
    label: '会社名',
    value: ['株式会社ＳＫＹＭ'],
  },
  {
    label: '事業者の名称',
    value: ['渡邉浩一'],
  },
  {
    label: '事業者の所在地',
    value: ['〒170-0013', '東京都豊島区東池袋2丁目38番23号 SAMビル5B'],
  },
  {
    label: '事業者の連絡先',
    value: ['080-9217-2538'],
  },
  {
    label: '営業時間・ショップ情報など',
    value: ['お問い合わせ対応時間：平日 10:00〜18:00', '定休日：土日祝'],
  },
  {
    label: '販売価格',
    value: [
      '販売価格は税込表記です。',
      '別途送料がかかる場合があります。送料は商品詳細ページまたは購入画面でご確認ください。',
    ],
  },
  {
    label: '代金の支払方法・時期',
    value: [
      'クレジットカード決済：商品注文確定時にお支払いが確定します。',
      'PAY ID あと払い：コンビニ支払いは翌月10日までのお支払い、支払い手数料は350円（税込）です。口座振替は指定口座より引き落とし、支払い手数料は無料です。',
      '銀行振込決済：ご請求後5営業日以内のお支払い、支払い手数料は360円（税込）です。',
      'PayPay決済：ショップにて発送処理後、お支払いが確定します。',
    ],
  },
  {
    label: '商品のお届け時期',
    value: [
      '代金のお支払い確定後、約2〜3日以内に発送いたします。',
      '後払い決済の場合は、注文確定後、約2〜3日以内に発送いたします。',
    ],
  },
  {
    label: '返品について',
    value: ['商品に欠陥がある場合を除き、基本的には返品には応じません。'],
  },
] as const

export function CommercialTransactionsPage() {
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
            <span className="text-foreground">特定商取引法に基づく表記</span>
          </nav>

          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-primary">LEGAL</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
              特定商取引法に基づく表記
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              販売事業者、販売価格、支払方法、配送、返品に関する表記をまとめています。
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-6 px-gutter py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-10">
          <div className="overflow-hidden rounded-lg border bg-card">
            {commercialTransactionItems.map((item) => (
              <section
                className="grid gap-2 border-b p-5 last:border-b-0 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-6"
                key={item.label}
              >
                <h2 className="text-sm font-semibold text-muted-foreground">
                  {item.label}
                </h2>
                <div className="grid gap-2 text-sm leading-6 font-medium">
                  {item.value.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="grid content-start gap-3">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <FileTextIcon aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">表記内容について</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    商品、配送、返品に関するご不明点はお問い合わせよりご連絡ください。
                  </p>
                </div>
              </div>
            </div>

            <RelatedGuideLinks
              current="law"
              text="お問い合わせと個人情報の取扱いもあわせて確認できます。"
            />
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
