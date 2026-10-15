import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  validateUIMessages,
} from "ai"

import { DEFAULT_MODEL, isModelAllowed } from "@/lib/models"
import { getTools, type ChatUIMessage } from "@/tools"

export const maxDuration = 30

const MAX_OUTPUT_TOKENS = 8192

// This endpoint is public and spends your AI Gateway credits on every request.
// Before exposing it to real traffic, add a rate limit (e.g. Vercel Firewall /
// WAF or @upstash/ratelimit), authentication, and an AI Gateway spend limit.
// See the README "Security" section.
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const model = (body as { model?: unknown })?.model
  const modelId = typeof model === "string" ? model : DEFAULT_MODEL

  if (!isModelAllowed(modelId)) {
    return Response.json(
      { error: `Model ${modelId} is not available.` },
      { status: 400 }
    )
  }

  const tools = getTools(modelId)

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
    model: modelId,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: isStepCount(5),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
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
