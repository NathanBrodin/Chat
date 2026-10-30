import { type ChatStatus } from "ai"

import { type ChatUIMessage } from "@/lib/chat/tools"

export type ChatResponseState = "idle" | "submitted" | "reasoning" | "responding"

// Derives the current phase of the assistant's response from the chat status and the last message
export function useChatResponseState(
  status: ChatStatus,
  messages: ChatUIMessage[],
): ChatResponseState {
  // The request was sent and the stream has not started yet.
  if (status === "submitted") {
    return "submitted"
  }

  if (status !== "streaming") {
    return "idle"
  }

  const lastMessage = messages.at(-1)
  const lastPart = lastMessage?.role === "assistant" ? lastMessage.parts.at(-1) : undefined

  // Text streaming means the answer is being written; anything else is a
  // reasoning step or a tool call still in flight.
  if (lastPart?.type === "text" && lastPart.text.trim()) {
    return "responding"
  }

  return "reasoning"
}
