import {
  ChevronDownIcon,
  ClockIcon,
  MailIcon,
  MessageSquareTextIcon,
  PackageCheckIcon,
  PhoneIcon,
  SendIcon,
} from 'lucide-react'
import { Link } from 'react-router'

import { RelatedGuideLinks } from '@/components/related-guide-links'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const selectFieldClassName =
  'h-11 w-full min-w-0 cursor-pointer appearance-none rounded-lg border border-input bg-background py-0 pr-12 pl-3 text-base outline-none focus:border-ring focus:ring-3 focus:ring-ring/30 md:text-sm'

const fieldGroupClassName = 'grid min-w-0 items-start gap-4 sm:grid-cols-2'

const fieldWrapperClassName = 'grid min-w-0 content-start gap-2'

const contactTopics = [
  {
    icon: MessageSquareTextIcon,
    title: '商品・在庫',
    text: '商品名、カラー、サイズが分かる場合は内容に含めてください。',
  },
  {
    icon: PackageCheckIcon,
    title: '注文・配送',
    text: '注文番号がある場合は、確認しやすいようにあわせて入力してください。',
  },
  {
    icon: ClockIcon,
    title: '返信について',
    text: '内容を確認のうえ順次返信します。お問い合わせ内容により時間がかかる場合があります。',
  },
]

export function ContactPage() {
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
            <span className="text-foreground">お問い合わせ</span>
          </nav>

          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-primary">CONTACT</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
              お問い合わせ
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              商品、在庫、配送に関するご相談はこちらからお送りください。
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-6 px-gutter py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-10">
          <form className="grid min-w-0 gap-5 rounded-lg border bg-card p-5">
            <div className={fieldGroupClassName}>
              <label className={fieldWrapperClassName}>
                <span className="text-sm font-semibold">お名前</span>
                <Input
                  autoComplete="name"
                  placeholder="山田 太郎"
                  type="text"
                />
              </label>

              <label className={fieldWrapperClassName}>
                <span className="text-sm font-semibold">メールアドレス</span>
                <Input
                  autoComplete="email"
                  placeholder="sample@example.com"
                  type="email"
                />
              </label>
            </div>

            <div className={fieldGroupClassName}>
              <label className={fieldWrapperClassName}>
                <span className="text-sm font-semibold">お問い合わせ種別</span>
                <div className="relative">
                  <select className={selectFieldClassName}>
                    <option>商品について</option>
                    <option>注文・配送について</option>
                    <option>返品・交換について</option>
                    <option>イベント・その他</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-foreground"
                  />
                </div>
              </label>

              <label className={fieldWrapperClassName}>
                <span className="text-sm font-semibold">注文番号</span>
                <Input placeholder="任意" type="text" />
              </label>
            </div>

            <label className={fieldWrapperClassName}>
              <span className="text-sm font-semibold">件名</span>
              <Input placeholder="お問い合わせの件名" type="text" />
            </label>

            <label className={fieldWrapperClassName}>
              <span className="text-sm font-semibold">お問い合わせ内容</span>
              <Textarea placeholder="商品名、カラー、注文番号など、確認に必要な内容をご入力ください。" />
            </label>

            <div className="flex justify-end border-t pt-5">
              <Button className="h-11 px-4" type="button">
                送信
                <SendIcon data-icon="inline-end" />
              </Button>
            </div>
          </form>

          <aside className="grid min-w-0 content-start gap-3">
            {contactTopics.map((topic) => (
              <div
                className="min-w-0 rounded-lg border bg-card p-4"
                key={topic.title}
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <topic.icon aria-hidden="true" className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{topic.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {topic.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <RelatedGuideLinks
              current="contact"
              text="返品、個人情報、販売事業者に関する確認はこちらからできます。"
              title="ご確認ください"
            />

            <div className="min-w-0 rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <PhoneIcon aria-hidden="true" className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">電話でのお問い合わせ</p>
                  <div className="mt-1 grid gap-1 text-xs leading-5 text-muted-foreground">
                    <p>
                      事務所：
                      <a
                        className="underline decoration-foreground/35 underline-offset-4 hover:text-foreground hover:decoration-foreground"
                        href="tel:0353092175"
                      >
                        03-5309-2175
                      </a>
                    </p>
                    <p>
                      代表携帯：
                      <a
                        className="underline decoration-foreground/35 underline-offset-4 hover:text-foreground hover:decoration-foreground"
                        href="tel:08092172538"
                      >
                        080-9217-2538
                      </a>
                    </p>
                    <p>受付時間：平日 10:00〜18:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <MailIcon aria-hidden="true" className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">メール受信設定</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    返信が届かない場合は、迷惑メールフォルダや受信設定をご確認ください。
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
