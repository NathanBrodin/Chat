import "server-only"

import { anthropic } from "@ai-sdk/anthropic"
import { streamText } from "ai"
import { createAI, createStreamableValue, getMutableAIState } from "ai/rsc"
import { headers } from "next/headers"
import { AIState, UIState } from "./types"
import { rateLimit } from "../rate-limit"

export async function continueConversation(input: string) {
  "use server"

  // Implement rate limit based on the request's IP
  const header = headers()
  const ip = (header.get("x-forwarded-for") ?? "127.0.0.2").split(",")[0]

  const { success } = await rateLimit(ip)
  if (!success) {
    throw new Error("Rate limit exceeded")
  }

  const history = getMutableAIState<typeof AI>()

  // Update the AI state with the new user message.
  history.update([...history.get(), { role: "user", content: input }])

  const result = await streamText({
    model: anthropic("claude-3-haiku-20240307"),
    messages: history.get(),
    onFinish({ text }) {
      // Update the AI state with the new assistant message.
      history.done([...history.get(), { role: "assistant", content: text }])
    },
  })

  const stream = createStreamableValue(result.textStream)
  return stream.value
}

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState>({
  initialAIState: [],
  initialUIState: [],
  actions: {
    continueConversation,
  },
})
