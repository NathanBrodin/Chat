import { type CoreMessage } from "ai"

/**
A message that can be used in the `messages` field of a prompt.
It can be a user message, an assistant message, or a tool message.
 */
export type ChatMessage = CoreMessage & {
  id: string
  status?: "loading" | "complete"
}
