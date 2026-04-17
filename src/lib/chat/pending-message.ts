const pendingMessages = new Map<string, string>()

function getStorageKey(conversationId: string) {
  return `pending-chat-message:${conversationId}`
}

export function setPendingMessage(conversationId: string, message: string) {
  pendingMessages.set(conversationId, message)

  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(getStorageKey(conversationId), message)
  }
}

export function consumePendingMessage(conversationId: string) {
  const message =
    pendingMessages.get(conversationId) ??
    (typeof window !== 'undefined'
      ? (window.sessionStorage.getItem(getStorageKey(conversationId)) ?? undefined)
      : undefined)

  pendingMessages.delete(conversationId)

  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(getStorageKey(conversationId))
  }

  return message
}
