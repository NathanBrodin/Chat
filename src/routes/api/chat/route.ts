import { api } from '@convex/_generated/api'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createFileRoute } from '@tanstack/react-router'
import {
  NoSuchModelError,
  type UIMessage,
  convertToModelMessages,
  createIdGenerator,
  streamText,
} from 'ai'

import { fetchAuthMutation, fetchAuthQuery } from '@/lib/auth/auth-server'
import { tools } from '@/lib/chat/tools'
import { parseStoredMessages, validateChatMessages } from '@/lib/chat/utils'

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
        }: { message: UIMessage; id: string | null; model: string | null } = await request.json()

        if (!model) {
          throw new NoSuchModelError({ modelId: 'no-model', modelType: 'languageModel' })
        }

        let messages: UIMessage[] = []

        if (id) {
          // Save the user's message
          await fetchAuthMutation(api.chat.insertMessage, {
            conversationId: id as any,
            messageId: message.id,
            messageData: JSON.stringify(message),
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
