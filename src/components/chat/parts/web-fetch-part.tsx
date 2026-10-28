import { ExternalLinkIcon } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { MarkdownPre } from "@/components/chat/markdown-code"
import { StatusIcon } from "@/components/chat/status-icon"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"
import { safeHttpUrl } from "@/lib/utils"
import { type WebFetchToolPart } from "@/tools"

const PREVIEW_LENGTH = 4_000

const compactNumberFormat = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
})

export function WebFetchPart({
  part,
  isStreaming,
}: {
  part: WebFetchToolPart
  isStreaming: boolean
}) {
  const target = getTarget(part.input?.url)

  if (part.state === "output-available") {
    const output = part.output

    if (output.type === "error") {
      return <WebFetchError target={target} message={output.message} />
    }

    const preview = output.content.slice(0, PREVIEW_LENGTH)
    const href = safeHttpUrl(output.finalUrl)
    const shownLength = output.offset + preview.length

    return (
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <StatusIcon />
            </TraceIcon>
            <TraceTitle>Read {target}</TraceTitle>
            <TraceDescription>{formatLength(output.totalLength)}</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex min-w-0 flex-col gap-0.5">
              {output.title && (
                <span className="line-clamp-2 font-medium text-foreground">{output.title}</span>
              )}
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-fit max-w-full min-w-0 items-center gap-1 hover:text-foreground"
                >
                  <span className="truncate">{output.finalUrl}</span>
                  <ExternalLinkIcon className="size-3 shrink-0" aria-hidden="true" />
                </a>
              ) : (
                <span className="truncate">{output.finalUrl}</span>
              )}
            </div>
            {output.content ? (
              <>
                <ScrollArea
                  className="h-auto! rounded-md border bg-muted/30 **:data-[slot=scroll-area-viewport]:h-auto! **:data-[slot=scroll-area-viewport]:max-h-80"
                  overscrollContain
                  scrollbarGutter
                  scrollFade
                >
                  <div className="typeset typeset-docs p-3">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{ pre: MarkdownPre, img: () => null }}
                    >
                      {preview}
                    </ReactMarkdown>
                  </div>
                </ScrollArea>
                {shownLength < output.totalLength && (
                  <span className="text-xs">
                    Showing {formatLength(shownLength)} of {formatLength(output.totalLength)}.
                  </span>
                )}
              </>
            ) : (
              <p className="m-0">
                {output.offset > 0
                  ? "No content at this offset."
                  : "No readable text. The page may require JavaScript."}
              </p>
            )}
          </div>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    )
  }

  if (part.state === "output-error") {
    return <WebFetchError target={target} message={part.errorText} />
  }

  return (
    <TraceLine status={isStreaming ? "running" : "error"}>
      <TraceIcon>
        <StatusIcon status={isStreaming ? "running" : "error"} />
      </TraceIcon>
      <TraceTitle>
        {isStreaming ? "Reading" : "Couldn't read"} {target}
      </TraceTitle>
    </TraceLine>
  )
}

function WebFetchError({ target, message }: { target: string; message: string }) {
  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>
        <TraceLine status="error">
          <TraceIcon>
            <StatusIcon status="error" />
          </TraceIcon>
          <TraceTitle>Couldn't read {target}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <p className="m-0">{message}</p>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

function getTarget(url: string | undefined) {
  if (!url) {
    return "the page"
  }

  try {
    return new URL(url).hostname.replace(/^www\./, "") || url
  } catch {
    return url
  }
}

function formatLength(value: number) {
  return `${compactNumberFormat.format(value)} ${value === 1 ? "char" : "chars"}`
}
