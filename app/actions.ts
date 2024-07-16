"use server"

import { anthropic } from "@ai-sdk/anthropic"
import { CoreMessage, streamText } from "ai"
import { createStreamableValue } from "ai/rsc"
import { rateLimit } from "@/lib/rate-limit"

export async function continueConversation(messages: CoreMessage[], ip?: string) {
  const { success } = await rateLimit(ip || "unknown")
  if (!success) {
    throw new Error("Rate limit exceeded")
  }

  const result = await streamText({
    model: anthropic("claude-3-haiku-20240307"),
    messages,
  })

  const stream = createStreamableValue(result.textStream)
  return stream.value
}
