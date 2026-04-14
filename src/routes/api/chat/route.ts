import { api } from '@convex/_generated/api'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createFileRoute } from '@tanstack/react-router'
import {
  type UIMessage,
  TypeValidationError,
  convertToModelMessages,
  createIdGenerator,
  streamText,
  tool,
  validateUIMessages,
} from 'ai'
import { z } from 'zod'

import { fetchAuthMutation, fetchAuthQuery } from '@/lib/auth/auth-server'

const openrouter = createOpenRouter({
  apiKey: import.meta.env.OPENROUTER_API_KEY,
})

const tools = {
  weather: tool({
    description: 'Get the weather in a location (fahrenheit)',
    inputSchema: z.object({
      location: z.string().describe('The location to get the weather for'),
    }),
    execute: async ({ location }) => {
      const temperature = Math.round(Math.random() * (90 - 32) + 32)
      return {
        location,
        temperature,
      }
    },
  }),
  convertFahrenheitToCelsius: tool({
    description: 'Convert a temperature in fahrenheit to celsius',
    inputSchema: z.object({
      temperature: z.number().describe('The temperature in fahrenheit to convert'),
    }),
    execute: async ({ temperature }) => {
      const celsius = Math.round((temperature - 32) * (5 / 9))
      return {
        celsius,
      }
    },
  }),
}

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { message, id }: { message: UIMessage; id: string | null } = await request.json()

        // Load previous messages from Convex if we have a conversation ID
        let previousMessages: UIMessage[] = []
        if (id) {
          try {
            const rawMessages: string[] = await fetchAuthQuery(api.conversations.getMessages, {
              conversationId: id as any,
            })
            previousMessages = rawMessages.map((m) => JSON.parse(m) as UIMessage)
          } catch {
            // If loading fails (e.g. conversation not found), start fresh
            previousMessages = []
          }
        }

        // Append the new message from the client
        const messages = [...previousMessages, message]

        // Validate messages against tools to ensure consistency
        let validatedMessages: UIMessage[]
        try {
          validatedMessages = await validateUIMessages({
            messages,
            tools: tools as any,
          })
        } catch (error) {
          if (error instanceof TypeValidationError) {
            console.error('Message validation failed:', error)
            // Fall back to just the new message if stored messages are invalid
            validatedMessages = [message]
          } else {
            throw error
          }
        }

        const result = streamText({
          model: openrouter.chat('arcee-ai/trinity-large-preview:free'),
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
            if (!id) return

            try {
              await fetchAuthMutation(api.conversations.saveMessages, {
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
