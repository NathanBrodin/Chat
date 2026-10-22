"use client"

import type { ChatUIMessage } from "@/tools"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/preview-card"
import { CircularProgress } from "@/components/ui/circular-progress"
import { Progress } from "@/components/ui/progress"

// Context window of the model hardcoded in app/api/chat/route.ts
// (glm-flash: 128k). The AI SDK does not send it, so keep it in sync
// with the model.
const CONTEXT_LIMIT = 131_072

function formatTokens(value: number) {
  if (value < 1000) {
    return String(value)
  }

  return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`
}

export function ChatContext({ messages }: { messages: ChatUIMessage[] }) {
  const usage = messages.findLast(
    (message) => message.role === "assistant" && message.metadata?.usage
  )?.metadata?.usage

  const input = usage?.inputTokens ?? 0
  const output = usage?.outputTokens ?? 0
  const reasoning = usage?.outputTokenDetails.reasoningTokens ?? 0
  const used = input + output
  const percent = Math.min(100, Math.round((used / CONTEXT_LIMIT) * 100))

  const rows = [
    { label: "Input", value: input },
    { label: "Output", value: output },
    ...(reasoning > 0 ? [{ label: "Reasoning", value: reasoning }] : []),
  ]

  return (
    <HoverCard>
      <HoverCardTrigger
        delay={10}
        closeDelay={100}
        render={<Button variant="ghost" size="icon" />}
      >
        <CircularProgress value={percent} aria-label="Context used" />
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-3">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">Context</span>
          <span className="text-muted-foreground">
            {formatTokens(used)} / {formatTokens(CONTEXT_LIMIT)}
          </span>
        </div>
        <Progress value={percent} aria-label="Context used" />
        <div className="flex flex-col gap-1 text-sm">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-3">
              <span className="text-muted-foreground">{row.label}</span>
              <span>{formatTokens(row.value)}</span>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
