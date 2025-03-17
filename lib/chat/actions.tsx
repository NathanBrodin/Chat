import "server-only"

import { anthropic } from "@ai-sdk/anthropic"
import { Geo } from "@vercel/edge"
import { generateId, streamText } from "ai"
import { createAI, createStreamableValue, getMutableAIState, StreamableValue } from "ai/rsc"
import { headers } from "next/headers"
import { systemPrompt } from "./prompt"
import { AIActions, AIState, ServerMessage, UIState } from "./types"
import { saveChat } from "../db/actions"
import { rateLimit } from "../rate-limit"

export async function continueConversation(input: string, location: Geo): Promise<StreamableValue<any, any>> {
  "use server"
  // Implement rate limit based on the request's IP
  const header = await headers()
  const ip = (header.get("x-forwarded-for") ?? "127.0.0.2").split(",")[0]
  const { success } = await rateLimit(ip)
  if (!success) {
    throw new Error("Rate limit exceeded")
  }
  const history = getMutableAIState<typeof AI>("messages")
  // Update the AI state with the new user message.
  history.update([...(history.get() as ServerMessage[]), { role: "user", content: input }])
  const stream = createStreamableValue()

  // Create a promise that can be rejected from the onError callback
  let rejectStreamPromise: (reason?: any) => void = () => {}
  const streamPromise = new Promise<void>((resolve, reject) => {
    rejectStreamPromise = reject
  })

  try {
    ;(async () => {
      try {
        const { textStream } = streamText({
          model: anthropic("claude-3-5-haiku-latest"),
          system: systemPrompt(location),
          messages: history.get() as ServerMessage[],
          onFinish(event) {
            history.done([...(history.get() as ServerMessage[]), { role: "assistant", content: event.text }])
          },
          onError(error) {
            rejectStreamPromise(error)
          },
        })

        for await (const text of textStream) {
          stream.update(text)
        }
        stream.done()
        // Resolve the promise when everything completes successfully
        Promise.resolve()
      } catch (innerError) {
        rejectStreamPromise(innerError)
      }
    })()

    // Wait for either the stream to complete or an error to be thrown
    await streamPromise
    return stream.value
  } catch (error) {
    stream.done()
    throw error
  }
}

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState, AIActions>({
  initialAIState: { messages: [], id: generateId(), location: {} },
  initialUIState: [],
  actions: {
    continueConversation,
  },
  onSetAIState: async ({ state, done }) => {
    "use server"

    if (done) {
      await saveChat(state)
    }
  },
})
