import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createFileRoute } from '@tanstack/react-router'
import {
  streamText,
  convertToModelMessages,
  tool,
  type UIMessage,
  simulateReadableStream,
} from 'ai'
import { z } from 'zod'

const openrouter = createOpenRouter({
  apiKey: import.meta.env.OPENROUTER_API_KEY,
})

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        return new Response(
          simulateReadableStream({
            initialDelayInMs: 100, // Delay before the first chunk
            chunkDelayInMs: 100, // Delay between chunks
            chunks: [
              `data: {"type":"start","messageId":"msg-123"}\n\n`,
              `data: {"type":"text-start","id":"text-1"}\n\n`,

              // --- Markdown Chunks Start ---
              `data: {"type":"text-delta","id":"text-1","delta":"## Mock Response Example\\n\\n"}\n\n`,

              `data: {"type":"text-delta","id":"text-1","delta":"Welcome to the **Frontend Test**! "}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"Here are some UI elements to test your rendering components:\\n\\n"}\n\n`,

              // Lists
              `data: {"type":"text-delta","id":"text-1","delta":"### 1. Lists\\n"}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"* Item one is *italicized*\\n"}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"* Item two is **bold**\\n"}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"* Item three has \`inline code\`\\n\\n"}\n\n`,

              // Tables
              `data: {"type":"text-delta","id":"text-1","delta":"### 2. Table\\n"}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"| Feature | Supported | Notes |\\n"}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"| :--- | :---: | :--- |\\n"}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"| Tables | ✅ | Markdown tables |\\n"}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"| Code Blocks | ✅ | Syntax highlighting |\\n"}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"| Inline Styles | ✅ | Bold, italic, strikethrough |\\n\\n"}\n\n`,

              // Code Blocks
              `data: {"type":"text-delta","id":"text-1","delta":"### 3. Code Block\\n"}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"\`\`\`typescript\\n"}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"const testUI = (): boolean => {\\n"}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"  console.log(\\\"Rendering rich markdown!\\\");\\n"}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"  return true;\\n"}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"};\\n"}\n\n`,
              `data: {"type":"text-delta","id":"text-1","delta":"\`\`\`\\n\\n"}\n\n`,

              // Outro
              `data: {"type":"text-delta","id":"text-1","delta":"Happy coding! 🚀"}\n\n`,
              // --- Markdown Chunks End ---

              `data: {"type":"text-end","id":"text-1"}\n\n`,
              `data: {"type":"finish"}\n\n`,
              `data: [DONE]\n\n`,
            ],
          }).pipeThrough(new TextEncoderStream()),
          {
            status: 200,
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              Connection: 'keep-alive',
              'x-vercel-ai-ui-message-stream': 'v1',
            },
          },
        )

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
