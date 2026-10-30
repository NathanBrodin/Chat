import type { ComponentProps } from "react"
import ReactMarkdown, { type Components, type ExtraProps } from "react-markdown"
import remarkGfm from "remark-gfm"

import { MarkdownPre } from "@/components/chat/markdown-code"
import { type TextMessagePart } from "@/lib/chat/tools"

function MarkdownLink({ href, children }: ComponentProps<"a"> & ExtraProps) {
  const isExternal = href !== undefined && /^https?:\/\//i.test(href)

  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "nofollow ugc noopener noreferrer" } : {})}
    >
      {children}
    </a>
  )
}

function MarkdownImage({ src, alt }: ComponentProps<"img"> & ExtraProps) {
  return <img src={src} alt={alt ?? ""} loading="lazy" referrerPolicy="no-referrer" />
}

const markdownComponents: Components = {
  pre: MarkdownPre,
  a: MarkdownLink,
  img: MarkdownImage,
}

export function TextPart({ part }: { part: TextMessagePart }) {
  return (
    <div className="typeset typeset-docs">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {part.text}
      </ReactMarkdown>
    </div>
  )
}
