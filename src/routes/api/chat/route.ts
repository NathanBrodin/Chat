import { api } from '@convex/_generated/api'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createFileRoute } from '@tanstack/react-router'
import { NoSuchModelError, convertToModelMessages, createIdGenerator, streamText } from 'ai'

import type { ChatAttachmentMetadata, ChatMessageMetadata, ChatMessage } from '@/lib/chat/types'

import { fetchAuthMutation, fetchAuthQuery } from '@/lib/auth/auth-server'
import { tools } from '@/lib/chat/tools'
import { parseStoredMessages, validateChatMessages } from '@/lib/chat/utils'

function getMessageAttachments(message: ChatMessage): ChatAttachmentMetadata[] | undefined {
  const attachments = message.metadata?.attachments?.filter((attachment) => attachment.storageId)
  return attachments?.length ? attachments : undefined
}

function toStoredMessage(message: ChatMessage) {
  const metadata = message.metadata
    ? Object.fromEntries(Object.entries(message.metadata).filter(([key]) => key !== 'attachments'))
    : undefined

  return {
    ...message,
    metadata:
      metadata && Object.keys(metadata).length > 0
        ? (metadata as Omit<ChatMessageMetadata, 'attachments'>)
        : undefined,
    parts: message.parts.map((part) => {
      if (part.type !== 'file') {
        return part
      }

      const { url: _url, ...storedPart } = part
      return storedPart
    }),
  }
}

const openrouter = createOpenRouter({
  apiKey: import.meta.env.OPENROUTER_API_KEY,
})

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const {
          message,
          id,
          model,
        }: { message: ChatMessage; id: string | null; model: string | null } = await request.json()

        if (!model) {
          throw new NoSuchModelError({ modelId: 'no-model', modelType: 'languageModel' })
        }

        let messages: ChatMessage[] = []

        if (id) {
          const attachments = getMessageAttachments(message)

          // Save the user's message
          await fetchAuthMutation(api.chat.insertMessage, {
            conversationId: id as any,
            messageId: message.id,
            attachments: attachments?.map((attachment) => ({
              ...attachment,
              storageId: attachment.storageId as any,
            })),
            messageData: JSON.stringify(toStoredMessage(message)),
          })

          // Load previous messages
          const rawMessages = await fetchAuthQuery(api.chat.getMessages, {
            conversationId: id as any,
          })
          messages = parseStoredMessages(rawMessages)
        } else {
          messages = [message]
        }

        // Validate messages against tools to ensure consistency
        const validatedMessages = await validateChatMessages(messages)

        const result = streamText({
          model: openrouter.chat(model),
          messages: await convertToModelMessages(validatedMessages),
          tools,
        })

        // Consume the stream so onFinish fires even if client disconnects
        result.consumeStream()

        return result.toUIMessageStreamResponse({
          sendSources: true,
          sendReasoning: true,
          originalMessages: validatedMessages,
          generateMessageId: createIdGenerator({
            prefix: 'msg',
            size: 16,
          }),
          onFinish: async ({ responseMessage }) => {
            if (!id) return

            try {
              await fetchAuthMutation(api.chat.insertMessage, {
                conversationId: id as any,
                messageId: responseMessage.id,
                messageData: JSON.stringify(responseMessage),
              })
            } catch (error) {
              console.error('Failed to save messages:', error)
            }
          },
        })
      },
    },
  },
})
