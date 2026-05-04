import ReactMarkdown from 'react-markdown'

export function MarkdownPreview({ content }: { content: string }) {
  return (
    <article className="prose prose-neutral dark:prose-invert">
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  )
}

