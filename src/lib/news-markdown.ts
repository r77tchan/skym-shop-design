export type NewsMarkdownBlock =
  | { alt: string; type: 'image'; url: string }
  | { text: string; type: 'paragraph' }

// 簡易表示用の最小パーサ。空行で段落を区切り、画像のみの段落を画像ブロックに振り分ける。
const imageBlockPattern = /^!\[([^\]]*)\]\(([^)]+)\)$/

export function parseNewsMarkdown(body: string): NewsMarkdownBlock[] {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)
    .map((block) => {
      const imageMatch = imageBlockPattern.exec(block)

      if (imageMatch) {
        return { alt: imageMatch[1], type: 'image', url: imageMatch[2] }
      }

      return { text: block, type: 'paragraph' }
    })
}

export function getNewsExcerpt(body: string): string {
  const paragraph = parseNewsMarkdown(body).find(
    (block) => block.type === 'paragraph',
  )

  return paragraph?.type === 'paragraph' ? paragraph.text : ''
}
