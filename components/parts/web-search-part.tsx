import { type WebSearchToolPart } from "@/tools"
import { StatusIcon } from "@/components/status-icon"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import {
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export function WebSearchPart({
  part,
  isStreaming,
}: {
  part: WebSearchToolPart
  isStreaming: boolean
}) {
  const target = part.input?.query
    ? `the web for “${part.input.query}”`
    : "the web"

  if (part.state === "output-available") {
    return (
      <TraceLine>
        <TraceIcon>
          <StatusIcon />
        </TraceIcon>
        <TraceTitle>Searched {target}</TraceTitle>
      </TraceLine>
    )
  }

  if (part.state === "output-error") {
    return (
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <StatusIcon status="error" />
            </TraceIcon>
            <TraceTitle>Failed to search {target}</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm" variant="destructive">
            <CodeBlockContent wrap className="max-h-64">
              {part.errorText}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    )
  }

  return (
    <TraceLine status={isStreaming ? "running" : "error"}>
      <TraceIcon>
        <StatusIcon status={isStreaming ? "running" : "error"} />
      </TraceIcon>
      <TraceTitle>
        {isStreaming ? "Searching" : "Failed to search"} {target}
      </TraceTitle>
    </TraceLine>
  )
}
