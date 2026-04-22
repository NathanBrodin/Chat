import { fetchContextMessages } from '@convex-dev/agent'
import { MINUTE, RateLimiter, SECOND } from '@convex-dev/rate-limiter'

import type { DataModel } from './_generated/dataModel'
import type { MutationCtx, QueryCtx } from './_generated/server'

import { components } from './_generated/api'
import { getAuthUserId } from './auth'

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  sendMessage: {
    kind: 'fixed window',
    period: 5 * SECOND,
    rate: 1,
    capacity: 2,
  },
  tokenUsagePerUser: {
    kind: 'token bucket',
    period: MINUTE,
    rate: 2000,
    capacity: 10000,
  },
  globalSendMessage: {
    kind: 'token bucket',
    period: MINUTE,
    rate: 1000,
  },
  globalTokenUsage: {
    kind: 'token bucket',
    period: MINUTE,
    rate: 100000,
  },
})

export const { getRateLimit, getServerTime } = rateLimiter.hookAPI<DataModel>('sendMessage', {
  key: async (ctx) => (await getAuthUserId(ctx)) ?? 'anonymous',
})

export async function estimateTokens(
  ctx: QueryCtx | MutationCtx,
  threadId: string,
  question: string,
) {
  const promptTokens = Math.ceil(question.length / 4)
  const estimatedOutputTokens = promptTokens * 3 + 1

  const latestMessages = await fetchContextMessages(ctx, components.agent, {
    threadId,
    userId: (await getAuthUserId(ctx)) ?? undefined,
    searchText: question,
    contextOptions: { recentMessages: 2 },
  })

  const lastUsageMessage = latestMessages.reverse().find((message) => message.usage)
  const lastPromptTokens = lastUsageMessage?.usage?.totalTokens ?? 1

  return Math.ceil(lastPromptTokens + promptTokens + estimatedOutputTokens)
}
