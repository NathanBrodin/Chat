import { TypeValidationError, validateUIMessages, type UIMessage } from 'ai'

import { tools } from './tools'

export function parseStoredMessages(rawMessages: readonly string[] | undefined): UIMessage[] {
  if (!rawMessages?.length) {
    return []
  }

  const messages: UIMessage[] = []

  for (const rawMessage of rawMessages) {
    try {
      messages.push(JSON.parse(rawMessage) as UIMessage)
    } catch (error) {
      console.error('Failed to parse stored message:', error)
    }
  }

  return messages
}

export async function validateChatMessages(
  messages: UIMessage[],
  fallbackMessages: UIMessage[] = [],
): Promise<UIMessage[]> {
  if (!messages.length) {
    return []
  }

  try {
    return await validateUIMessages({ messages, tools: tools as any })
  } catch (error) {
    if (error instanceof TypeValidationError) {
      console.error('Message validation failed:', error)
      return fallbackMessages
    }

    throw error
  }
}
