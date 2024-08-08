import { Geo } from "@vercel/edge"
import { ReactNode } from "react"
import { z } from "zod"

// Define the AI state and UI state types
export type ServerMessage = {
  role: "user" | "assistant"
  content: string
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  display: ReactNode
}

export type AIState = ServerMessage[]
export type UIState = ChatMessage[]

// Define the actions type
export type AIActions = {
  continueConversation: (input: string, location: Geo) => Promise<ReactNode>
}

export const questionsSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().describe("The example question, written at the first person (eg. What's my...)"),
        display: z
          .string()
          .max(25)
          .describe("The example question, written at the third person (eg. What's Nathan's...)"),
      })
    )
    .length(4)
    .describe("The four example questions"),
})

export type Questions = z.infer<typeof questionsSchema>
