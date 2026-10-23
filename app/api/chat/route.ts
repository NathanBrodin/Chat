import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  validateUIMessages,
} from "ai"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

import { getTools, type ChatUIMessage } from "@/tools"

import { NextRequest } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

const burst = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "30s"),
  prefix: "chat:burst",
  analytics: true,
})

const daily = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(50, "24h"),
  prefix: "chat:daily",
  analytics: true,
})

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "ip"

  const { success: burstOk } = await burst.limit(ip)
  if (!burstOk) {
    return Response.json({ error: "Ratelimited" }, { status: 429 })
  }

  const { success: dailyOk } = await daily.limit(ip)
  if (!dailyOk) {
    return Response.json({ error: "Ratelimited" }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const tools = getTools()

  // Validate the shape of every message and tool part before trusting it.
  let messages: ChatUIMessage[]
  try {
    const validated = await validateUIMessages<ChatUIMessage>({
      messages: (body as { messages?: unknown })?.messages,
      tools: tools as Parameters<typeof validateUIMessages>[0]["tools"],
    })
    messages = validated
  } catch {
    return Response.json({ error: "Invalid messages." }, { status: 400 })
  }

  const result = streamText({
    model: openrouter("~z-ai/glm-flash-latest"),
    maxOutputTokens: 8192,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: isStepCount(5),
    abortSignal: req.signal,
  })

  // A reply after ask_user continues the last message, so count its parts.
  const lastMessage = messages.at(-1)
  let reasoningCount =
    lastMessage?.role === "assistant"
      ? lastMessage.parts.filter((part) => part.type === "reasoning").length
      : 0
  const reasoningStarts = new Map<string, { index: number; time: number }>()

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      sendSources: true,
      // The AI SDK does not time reasoning, so time each block here.
      messageMetadata: ({ part }) => {
        if (part.type === "finish") {
          return { usage: part.totalUsage }
        }

        if (part.type === "reasoning-start") {
          reasoningStarts.set(part.id, {
            index: reasoningCount++,
            time: Date.now(),
          })
        }

        const start =
          part.type === "reasoning-end"
            ? reasoningStarts.get(part.id)
            : undefined

        if (!start) {
          return undefined
        }

        return {
          reasoningDurations: { [start.index]: Date.now() - start.time },
        }
      },
      onError: () => "Something went wrong. Please try again.",
    }),
  })
}
