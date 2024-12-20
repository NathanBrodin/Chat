import { Geo } from "@vercel/edge"
import { StreamableValue } from "ai/rsc"
import { ReactNode } from "react"

// Define the AI state and UI state types
export type ServerMessage = {
  role: "user" | "assistant"
  content: string
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant" | "error"
  display: ReactNode
}

export type AIState = { id: string; messages: ServerMessage[]; location: Geo }
export type UIState = ChatMessage[]

// Define the actions type
export type AIActions = {
  continueConversation: (input: string, location: Geo) => Promise<StreamableValue<any, any>>
}
