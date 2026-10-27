import { StatusIcon } from "@/components/chat/status-icon"
import {
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"
import { type ReasoningMessagePart } from "@/tools"

export function ReasoningPart({
  part,
  isStreaming,
  duration,
}: {
  part: ReasoningMessagePart
  isStreaming: boolean
  duration?: number
}) {
  const running = isStreaming && part.state === "streaming"
  const status = running ? "running" : undefined

  const line = (
    <TraceLine status={status}>
      <TraceIcon>
        <StatusIcon status={status} />
      </TraceIcon>
      <TraceTitle>{running ? "Thinking" : "Thought"}</TraceTitle>
      {!running && duration !== undefined && (
        <TraceDescription>{Math.max(1, Math.round(duration / 1000))}s</TraceDescription>
      )}
    </TraceLine>
  )

  if (!part.text) {
    return line
  }

  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">{part.text}</TraceCollapsibleContent>
    </TraceCollapsible>
  )
}
