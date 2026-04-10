import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createFileRoute } from '@tanstack/react-router'
import { streamText, convertToModelMessages, tool, type UIMessage } from 'ai'
import { z } from 'zod'

const openrouter = createOpenRouter({
  apiKey: import.meta.env.OPENROUTER_API_KEY,
})

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages }: { messages: UIMessage[] } = await request.json()

        const result = streamText({
          model: openrouter.chat('arcee-ai/trinity-large-preview:free'),
          messages: await convertToModelMessages(messages),
          tools: {
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
          },
        })

        return result.toUIMessageStreamResponse({
          sendSources: true,
          sendReasoning: true,
        })
      },
    },
  },
})
