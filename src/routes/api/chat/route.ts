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

        // Load previous messages from Convex if we have a conversation ID
        let previousMessages: UIMessage[] = []
        if (id) {
          try {
            const rawMessages: string[] = await fetchAuthQuery(api.chat.getMessages, {
              conversationId: id as any,
            })
            previousMessages = parseStoredMessages(rawMessages)
          } catch {
            // If loading fails (e.g. conversation not found), start fresh
            previousMessages = []
          }
        }

        // Append the new message from the client
        const messages = [...previousMessages, message]

        // Validate messages against tools to ensure consistency
        const validatedMessages = await validateChatMessages(messages, [message])

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
          onFinish: async ({ messages: finalMessages }) => {
            console.log('Saving ', id)
            if (!id) return

            try {
              await fetchAuthMutation(api.chat.saveMessages, {
                conversationId: id as any,
                messages: finalMessages.map((m) => ({
                  id: m.id,
                  messageData: JSON.stringify(m),
                })),
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
