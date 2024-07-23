import { ReactNode } from "react"

// Define the AI state and UI state types
export type ServerMessage = {
  role: "user" | "assistant"
  content: string
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  display: ReactNode
  /**
   * @deprecated Status is deprecated and I will removed in future versions, where UI streaming will be enabled
   */
  status?: "loading" | "complete"
}

export type AIState = ServerMessage[]
export type UIState = ChatMessage[]
