import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  rawUsage: defineTable({
    userId: v.string(),
    agentName: v.optional(v.string()),
    model: v.string(),
    provider: v.string(),
    usage: v.object({
      totalTokens: v.number(),
      inputTokens: v.number(),
      outputTokens: v.number(),
      reasoningTokens: v.number(),
      cachedInputTokens: v.number(),
    }),
    providerMetadata: v.optional(v.any()),
    billingPeriod: v.string(),
  })
    .index('by_billingPeriod_and_userId', ['billingPeriod', 'userId'])
    .index('by_userId_and_billingPeriod', ['userId', 'billingPeriod']),

  usageByPeriod: defineTable({
    userId: v.string(),
    billingPeriod: v.string(),
    totalTokens: v.number(),
    inputTokens: v.number(),
    outputTokens: v.number(),
    reasoningTokens: v.number(),
    cachedInputTokens: v.number(),
    lastUpdatedAt: v.number(),
  })
    .index('by_billingPeriod_and_userId', ['billingPeriod', 'userId'])
    .index('by_userId_and_billingPeriod', ['userId', 'billingPeriod']),
})
