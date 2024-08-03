"use client"

import { StreamableValue } from "ai/rsc"
import remarkGfm from "remark-gfm"
import { CodeBlock, Pre } from "@/components/ui/code"
import { useStreamableText } from "@/hooks/use-streamable-text"
import { MemoizedReactMarkdown } from "./markdown"

type ContentProps = {
  content: string | StreamableValue<string>
}

export function Content({ content }: ContentProps) {
  const text = useStreamableText(content)

  return (
    <MemoizedReactMarkdown
      className="prose prose-sm prose-stone !max-w-none break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
      remarkPlugins={[remarkGfm]}
      components={{ code: CodeBlock, pre: Pre }}
    >
      {text}
    </MemoizedReactMarkdown>
  )
}
