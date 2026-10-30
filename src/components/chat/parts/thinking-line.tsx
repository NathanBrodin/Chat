import { StatusIcon } from "@/components/chat/status-icon"
import { TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"

export function ThinkingLine() {
  return (
    <TraceLine status="running">
      <TraceIcon>
        <StatusIcon status="running" />
      </TraceIcon>
      <TraceTitle>Thinking</TraceTitle>
    </TraceLine>
  )
}
