import { Agent, type UsageHandler } from '@convex-dev/agent'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

import { components } from './_generated/api'
import { rateLimiter } from './rateLimiting'
import { usageHandler as defaultUsageHandler } from './usage'

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

const usageHandler: UsageHandler = async (ctx, args) => {
  if (!args.userId) {
    return
  }

  const inputTokens = args.usage.inputTokens ?? 0
  const outputTokens = args.usage.outputTokens ?? 0
  const totalTokens = args.usage.totalTokens ?? inputTokens + outputTokens

  await rateLimiter.limit(ctx, 'tokenUsagePerUser', {
    key: args.userId,
    count: totalTokens,
    reserve: true,
  })
  await rateLimiter.limit(ctx, 'globalTokenUsage', {
    count: totalTokens,
    reserve: true,
  })

  await defaultUsageHandler(ctx, args)
}

export const agent = new Agent(components.agent, {
  name: 'Basic Agent',
  languageModel: openrouter.chat('openrouter/free'),
  usageHandler,
})
