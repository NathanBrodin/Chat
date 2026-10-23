import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { createFileRoute } from "@tanstack/react-router"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  validateUIMessages,
} from "ai"
import { createAILogger, createEvlogIntegration } from "evlog/ai"
import { ENV } from "varlock/env"

import { useLogger } from "@/lib/logger.server.ts"
import { getTools, type ChatUIMessage } from "@/tools/index.ts"

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
  apiKey: ENV.OPENROUTER_API_KEY,
})

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "ip"

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
          body = await request.json()
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

        const log = useLogger()
        const ai = createAILogger(log)

        const result = streamText({
          model: ai.wrap(openrouter("~z-ai/glm-flash-latest")),
          maxOutputTokens: 8192,
          messages: await convertToModelMessages(messages),
          tools,
          stopWhen: isStepCount(5),
          abortSignal: request.signal,
          telemetry: {
            integrations: [createEvlogIntegration(ai)],
          },
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

              const start = part.type === "reasoning-end" ? reasoningStarts.get(part.id) : undefined

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
      },
    },
  },
})
