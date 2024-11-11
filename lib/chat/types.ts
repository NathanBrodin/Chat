import { Geo } from "@vercel/edge"
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

export type AIState = { id: string; messages: ServerMessage[] }
export type UIState = ChatMessage[]

// Define the actions type
export type AIActions = {
  continueConversation: (input: string, location: Geo) => Promise<ReactNode>
}
