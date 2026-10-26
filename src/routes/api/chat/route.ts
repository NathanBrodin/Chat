import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { createFileRoute } from "@tanstack/react-router"
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

import { isValidChatId } from "@/lib/chat/chat-id"
import { getLocation } from "@/lib/chat/geolocation"
import { checkChatRateLimit } from "@/lib/chat/rate-limit"
import { saveConversation } from "@/lib/chat/store"
import { chatErrors } from "@/lib/errors/chat"
import { useLogger } from "@/lib/logger.server"
import { getTools, type ChatUIMessage } from "@/tools/index"

const openrouter = createOpenRouter({
  apiKey: ENV.OPENROUTER_API_KEY,
})

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const log = useLogger()

        await checkChatRateLimit(request)

        let body: unknown
        try {
          body = await request.json()
        } catch (err) {
          throw chatErrors.INVALID_JSON({
            cause: err instanceof Error ? err : undefined,
          })
        }

        const id = (body as { id?: unknown })?.id
        if (typeof id !== "string" || !isValidChatId(id)) {
          throw chatErrors.INVALID_CHAT_ID()
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
        } catch (err) {
          throw chatErrors.INVALID_MESSAGES({
            cause: err instanceof Error ? err : undefined,
          })
        }

        const location = getLocation(request)

        log.set({ chat: { id, messageCount: messages.length } })
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
            originalMessages: messages,
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
            onError: (err) => {
              const streamError = chatErrors.STREAM_FAILED({
                cause: err instanceof Error ? err : undefined,
              })
              return JSON.stringify(streamError.toJSON())
            },
            onEnd: async ({ messages: updatedMessages, outcome }) => {
              if (outcome.status !== "completed") {
                return
              }

              try {
                await saveConversation({ id, messages: updatedMessages, location })
              } catch {
                // Best-effort: a persistence failure must not corrupt the stream.
                // No logging here — the request event has already emitted.
              }
            },
          }),
        })
      },
    },
  },
})
