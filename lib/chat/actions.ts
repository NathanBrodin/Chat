import "server-only"

import { anthropic } from "@ai-sdk/anthropic"
import { openai } from "@ai-sdk/openai"
import { streamText, tool } from "ai"
import { createAI, createStreamableValue, getMutableAIState, StreamableValue } from "ai/rsc"
import { headers } from "next/headers"
import { z } from "zod"
import { AIActions, AIState, UIState } from "./types"
import { createResource } from "../ai/actions"
import { findRelevantContent } from "../ai/embedding"
import { rateLimit } from "../rate-limit"

export async function continueConversation(input: string): Promise<StreamableValue<string, any>> {
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
    model: anthropic("claude-3-5-sonnet-20240620"),
    messages: history.get(),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z.string().describe("the content or resource to add to the knowledge base"),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
    onFinish({ text, toolResults }) {
      // Update the AI state with the new assistant message.
      console.log(toolResults?.map(({ toolName, result }) => `${toolName}: ${result}`).join("\n"))

      history.done([...history.get(), { role: "assistant", content: text }])
    },
  })

  const stream = createStreamableValue(result.textStream)
  return stream.value
}

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState, AIActions>({
  initialAIState: [],
  initialUIState: [],
  actions: {
    continueConversation,
  },
})
