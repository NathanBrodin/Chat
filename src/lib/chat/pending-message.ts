import type { PendingChatMessage } from './types'

const pendingMessages = new Map<string, PendingChatMessage>()

export function setPendingMessage(conversationId: string, message: PendingChatMessage) {
  pendingMessages.set(conversationId, message)
}

export function consumePendingMessage(conversationId: string) {
  const storedMessage = pendingMessages.get(conversationId)

  pendingMessages.delete(conversationId)

  return storedMessage
}
