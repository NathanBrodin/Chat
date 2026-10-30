import { Button } from "@/components/ui/button"
import { CircularProgress } from "@/components/ui/circular-progress"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/preview-card"
import { Progress } from "@/components/ui/progress"
import { getContextPercent, getUsedTokens } from "@/lib/chat/context-usage"
import { formatCost } from "@/lib/chat/format"
import { model } from "@/lib/chat/model"
import type { ChatUIMessage } from "@/tools"

function formatTokens(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`
  }

  return String(value)
}

export function ChatContext({ messages }: { messages: ChatUIMessage[] }) {
  const lastAssistant = messages.findLast(
    (message) => message.role === "assistant" && message.metadata?.usage,
  )
  const usage = lastAssistant?.metadata?.usage
  const contextModel = lastAssistant?.metadata?.model ?? model
  const used = getUsedTokens(usage)
  const percent = getContextPercent(usage, contextModel.contextWindow)
  const cost = messages.reduce(
    (total, message) => total + (message.role === "assistant" ? (message.metadata?.cost ?? 0) : 0),
    0,
  )

  const input = usage?.inputTokens ?? 0
  const output = usage?.outputTokens ?? 0
  const reasoning = usage?.outputTokenDetails.reasoningTokens ?? 0

  const rows = [
    { label: "Input", value: formatTokens(input) },
    { label: "Output", value: formatTokens(output) },
    ...(reasoning > 0 ? [{ label: "Reasoning", value: formatTokens(reasoning) }] : []),
    ...(cost > 0 ? [{ label: "Cost", value: formatCost(cost) }] : []),
  ]

  return (
    <HoverCard>
      <HoverCardTrigger delay={10} closeDelay={100} render={<Button variant="ghost" size="icon" />}>
        <CircularProgress value={percent} aria-label="Context used" />
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">Context</span>
            <span className="text-muted-foreground">
              {formatTokens(used)} / {formatTokens(contextModel.contextWindow)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{contextModel.name}</span>
        </div>
        <Progress value={percent} aria-label="Context used" />
        <div className="flex flex-col gap-1 text-sm">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-3">
              <span className="text-muted-foreground">{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
