const CHAT_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/

export function isValidChatId(id: string): boolean {
  return CHAT_ID_PATTERN.test(id)
}
