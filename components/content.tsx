import remarkGfm from "remark-gfm"
import { CodeBlock, Pre } from "@/components/ui/code"
import { MemoizedReactMarkdown } from "./markdown"

type ContentProps = {
  content: string
}

export function Content({ content }: ContentProps) {
  return (
    <MemoizedReactMarkdown
      className="prose prose-sm prose-stone !max-w-none break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
      remarkPlugins={[remarkGfm]}
      components={{ code: CodeBlock, pre: Pre }}
    >
      {content}
    </MemoizedReactMarkdown>
  )
}
