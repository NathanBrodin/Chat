import { TypeValidationError, validateUIMessages } from 'ai'

import type { ChatMessage } from './types'

import { tools } from './tools'

export function parseStoredMessages(rawMessages: readonly string[] | undefined): ChatMessage[] {
  if (!rawMessages?.length) {
    return []
  }

  const messages: ChatMessage[] = []

  for (const rawMessage of rawMessages) {
    try {
      messages.push(JSON.parse(rawMessage) as ChatMessage)
    } catch (error) {
      console.error('Failed to parse stored message:', error)
    }
  }

  return messages
}

export async function validateChatMessages(
  messages: ChatMessage[],
  fallbackMessages: ChatMessage[] = [],
): Promise<ChatMessage[]> {
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
