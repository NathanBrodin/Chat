import { Agent } from '@convex-dev/agent'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

import { components } from './_generated/api'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export const agent = new Agent(components.agent, {
  name: 'Basic Agent',
  languageModel: openrouter.chat('openrouter/free'),
})
