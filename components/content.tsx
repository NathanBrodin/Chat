"use client"

import remarkGfm from "remark-gfm"
import { CodeBlock, Pre } from "@/components/ui/code"
import { useAnimatedText } from "@/hooks/use-animated-text"
import { MemoizedReactMarkdown } from "./markdown"

type ContentProps = {
  content: string
  duration?: number
}

export function Content({ content, duration }: ContentProps) {
  const text = useAnimatedText(content, duration)

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
