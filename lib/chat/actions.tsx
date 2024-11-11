import "server-only"

import { anthropic } from "@ai-sdk/anthropic"
import { captureException } from "@sentry/nextjs"
import { Geo } from "@vercel/edge"
import { generateId } from "ai"
import { createAI, createStreamableValue, getMutableAIState, streamUI } from "ai/rsc"
import { headers } from "next/headers"
import { ReactNode } from "react"
import { Content } from "@/components/content"
import { systemPrompt } from "./prompt"
import { AIActions, AIState, ServerMessage, UIState } from "./types"
import { rateLimit } from "../rate-limit"

export async function continueConversation(input: string, location: Geo): Promise<ReactNode> {
  "use server"

  // Implement rate limit based on the request's IP
  const header = headers()
  const ip = (header.get("x-forwarded-for") ?? "127.0.0.2").split(",")[0]

  const { success } = await rateLimit(ip)
  if (!success) {
    throw new Error("Rate limit exceeded")
  }

  const history = getMutableAIState<typeof AI>("messages")

  // Update the AI state with the new user message.
  history.update([...(history.get() as ServerMessage[]), { role: "user", content: input }])

  let stream = createStreamableValue("")
  let node = <Content content={stream.value} />

  try {
    const result = await streamUI({
      model: anthropic("claude-3-haiku-20240307"),
      system: systemPrompt(location),
      messages: history.get() as ServerMessage[],
      text: ({ content, done }) => {
        if (done) {
          stream.done()
          history.done([...(history.get() as ServerMessage[]), { role: "assistant", content }])
        } else {
          stream.update(content)
        }

        return node
      },
    })
    return result.value
  } catch (error) {
    stream.done()
    captureException(error)
    throw new Error("Failed to send message")
  }
}

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState, AIActions>({
  initialAIState: { messages: [], id: generateId() },
  initialUIState: [],
  actions: {
    continueConversation,
  },
  onSetAIState: async ({ state, done }) => {
    "use server"

    if (done) {
      console.log("From conversation: ", state.id)
      console.log(state.messages.slice(-2))
    }
  },
})
