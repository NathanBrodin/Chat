"use server"

import { anthropic } from "@ai-sdk/anthropic"
import { CoreMessage, streamText } from "ai"
import { createStreamableValue } from "ai/rsc"

export async function continueConversation(messages: CoreMessage[]) {
  const result = await streamText({
    model: anthropic("claude-3-haiku-20240307"),
    messages,
  })

  const stream = createStreamableValue(result.textStream)
  return stream.value
}
