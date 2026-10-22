"use client"

import * as React from "react"
import { type ExtraProps } from "react-markdown"

import { useHighlightedCode } from "@/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"

// Fenced code arrives as <pre><code>, so read it from the hast node.
export function MarkdownPre({
  node,
  children,
  ...props
}: React.ComponentProps<"pre"> & ExtraProps) {
  const element = node?.children[0]

  if (element?.type !== "element" || element.tagName !== "code") {
    return <pre {...props}>{children}</pre>
  }

  const language =
    /language-([^\s,]+)/.exec(
      String(element.properties.className ?? "")
    )?.[1] ?? ""
  const code = element.children
    .map((child) => (child.type === "text" ? child.value : ""))
    .join("")
    .replace(/\n$/, "")

  return <MarkdownCodeBlock code={code} language={language} />
}

function MarkdownCodeBlock({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlock className="not-typeset mt-(--typeset-flow)">
      <CodeBlockHeader>
        <CodeBlockTitle>{language || "text"}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent>
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}
