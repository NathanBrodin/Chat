"use client"

import dynamic from "next/dynamic"
import { useAnimatedText } from "@/hooks/use-animated-text"

const Markdown = dynamic(() => import("./markdown").then((mod) => mod.Markdown), { ssr: false })

type ContentProps = {
  content: string
  duration?: number
}

export function Content({ content, duration }: ContentProps) {
  const text = useAnimatedText(content, duration)

  return (
    <Markdown className="prose prose-sm prose-stone !max-w-none break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
      {text}
    </Markdown>
  )
}
