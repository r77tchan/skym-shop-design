import { assetUrl } from '@/lib/asset-url'
import { parseNewsMarkdown } from '@/lib/news-markdown'
import { cn } from '@/lib/utils'

function resolveImageSrc(url: string) {
  return /^https?:\/\//.test(url) ? url : assetUrl(url)
}

export function NewsMarkdown({
  body,
  className,
}: {
  body: string
  className?: string
}) {
  const blocks = parseNewsMarkdown(body)

  if (blocks.length === 0) {
    return null
  }

  return (
    <div className={cn('grid gap-5', className)}>
      {blocks.map((block, index) =>
        block.type === 'image' ? (
          <img
            alt={block.alt}
            className="w-full rounded-lg border bg-muted"
            key={`image-${index}`}
            src={resolveImageSrc(block.url)}
          />
        ) : (
          <p
            className="text-sm leading-8 whitespace-pre-line text-foreground/86 sm:text-base"
            key={`paragraph-${index}`}
          >
            {block.text}
          </p>
        ),
      )}
    </div>
  )
}
