import type { UsageHandler } from '@convex-dev/agent'

import { v } from 'convex/values'

import type { MutationCtx, QueryCtx } from './_generated/server'

import { internal } from './_generated/api'
import { internalMutation, query } from './_generated/server'
import { getAuthUserId } from './auth'

export const MONTHLY_LIMIT_TOKENS = 150_000

export function getBillingPeriod(at: number) {
  const now = new Date(at)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth())
  return startOfMonth.toISOString().split('T')[0]
}

export async function getUsageTotalsForPeriod(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  billingPeriod: string,
) {
  const rows = await ctx.db
    .query('usageByPeriod')
    .withIndex('by_userId_and_billingPeriod', (q) =>
      q.eq('userId', userId).eq('billingPeriod', billingPeriod),
    )
    .take(1)

  const usage = rows[0]

  return {
    totalTokens: usage?.totalTokens ?? 0,
    inputTokens: usage?.inputTokens ?? 0,
    outputTokens: usage?.outputTokens ?? 0,
    reasoningTokens: usage?.reasoningTokens ?? 0,
    cachedInputTokens: usage?.cachedInputTokens ?? 0,
  }
}

export const usageHandler: UsageHandler = async (ctx, args) => {
  if (!args.userId) {
    return
  }

  await ctx.runMutation(internal.usage.insertRawUsage, {
    userId: args.userId,
    agentName: args.agentName,
    model: args.model,
    provider: args.provider,
    usage: args.usage,
    providerMetadata: args.providerMetadata,
  })
}

export const insertRawUsage = internalMutation({
  args: {
    userId: v.string(),
    agentName: v.optional(v.string()),
    model: v.string(),
    provider: v.string(),
    usage: v.object({
      totalTokens: v.optional(v.number()),
      inputTokens: v.optional(v.number()),
      outputTokens: v.optional(v.number()),
      reasoningTokens: v.optional(v.number()),
      cachedInputTokens: v.optional(v.number()),
      inputTokenDetails: v.optional(v.any()),
      outputTokenDetails: v.optional(v.any()),
      raw: v.optional(v.any()),
    }),
    providerMetadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const billingPeriod = getBillingPeriod(Date.now())
    const inputTokens = args.usage.inputTokens ?? 0
    const outputTokens = args.usage.outputTokens ?? 0
    const totalTokens = args.usage.totalTokens ?? inputTokens + outputTokens
    const reasoningTokens = args.usage.reasoningTokens ?? 0
    const cachedInputTokens = args.usage.cachedInputTokens ?? 0

    await ctx.db.insert('rawUsage', {
      userId: args.userId,
      agentName: args.agentName,
      model: args.model,
      provider: args.provider,
      usage: {
        totalTokens,
        inputTokens,
        outputTokens,
        reasoningTokens,
        cachedInputTokens,
      },
      providerMetadata: args.providerMetadata,
      billingPeriod,
    })

    const existingRows = await ctx.db
      .query('usageByPeriod')
      .withIndex('by_userId_and_billingPeriod', (q) =>
        q.eq('userId', args.userId).eq('billingPeriod', billingPeriod),
      )
      .take(1)

    const existing = existingRows[0]
    if (!existing) {
      await ctx.db.insert('usageByPeriod', {
        userId: args.userId,
        billingPeriod,
        totalTokens,
        inputTokens,
        outputTokens,
        reasoningTokens,
        cachedInputTokens,
        lastUpdatedAt: Date.now(),
      })
      return
    }

    await ctx.db.patch(existing._id, {
      totalTokens: existing.totalTokens + totalTokens,
      inputTokens: existing.inputTokens + inputTokens,
      outputTokens: existing.outputTokens + outputTokens,
      reasoningTokens: existing.reasoningTokens + reasoningTokens,
      cachedInputTokens: existing.cachedInputTokens + cachedInputTokens,
      lastUpdatedAt: Date.now(),
    })
  },
})

export const getCurrentUserUsage = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      return null
    }

    const billingPeriod = getBillingPeriod(Date.now())
    const usage = await getUsageTotalsForPeriod(ctx, userId, billingPeriod)
    const remainingTokens = Math.max(0, MONTHLY_LIMIT_TOKENS - usage.totalTokens)
    const percentUsed = Math.min(100, (usage.totalTokens / MONTHLY_LIMIT_TOKENS) * 100)

    return {
      billingPeriod,
      monthlyLimitTokens: MONTHLY_LIMIT_TOKENS,
      remainingTokens,
      percentUsed,
      ...usage,
    }
  },
})
