import "server-only"

import { anthropic } from "@ai-sdk/anthropic"
import { createAI, createStreamableValue, getMutableAIState, streamUI } from "ai/rsc"
import { headers } from "next/headers"
import { ReactNode } from "react"
import { Content } from "@/components/content"
import { AIActions, AIState, UIState } from "./types"
import { rateLimit } from "../rate-limit"

export async function continueConversation(input: string): Promise<ReactNode> {
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

  let stream = createStreamableValue("")
  let node = <Content content={stream.value} />

  const result = await streamUI({
    model: anthropic("claude-3-haiku-20240307"),
    messages: history.get(),
    text: ({ content, done }) => {
      if (done) {
        stream.done()
        history.done([...history.get(), { role: "assistant", content }])
      } else {
        stream.update(content)
      }

      return node
    },
  })

  return result.value
}

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState, AIActions>({
  initialAIState: [],
  initialUIState: [],
  actions: {
    continueConversation,
  },
})
