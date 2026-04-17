import { v } from 'convex/values'

import type { Id } from './_generated/dataModel'

import { internal } from './_generated/api'
import { internalMutation, mutation, query, type QueryCtx } from './_generated/server'

async function getUserId(ctx: QueryCtx): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity()
  return identity?.tokenIdentifier ?? null
}

async function assertOwnership(ctx: QueryCtx, conversationId: Id<'conversations'>) {
  const userId = await getUserId(ctx)
  if (!userId) {
    throw new Error('Not authenticated')
  }
  const conversation = await ctx.db.get(conversationId)
  if (!conversation) {
    throw new Error('Conversation not found')
  }
  if (conversation.userId !== userId) {
    throw new Error('Not authorized')
  }
  return { userId, conversation }
}

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)
    if (!userId) {
      return undefined
    }

    const conversationId = await ctx.db.insert('conversations', {
      title: args.title,
      userId,
    })

    return conversationId
  },
})

export const rename = mutation({
  args: {
    conversationId: v.id('conversations'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await assertOwnership(ctx, args.conversationId)
    await ctx.db.patch(args.conversationId, { title: args.title })
  },
})

export const remove = mutation({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    await assertOwnership(ctx, args.conversationId)

    // Delete all messages in batches to stay within transaction limits
    const messageBatch = await ctx.db
      .query('messages')
      .withIndex('by_conversationId', (q) => q.eq('conversationId', args.conversationId))
      .take(500)

    for (const msg of messageBatch) {
      await ctx.db.delete(msg._id)
    }

    // If there are more messages, schedule another run to clean up the rest
    if (messageBatch.length === 500) {
      await ctx.scheduler.runAfter(0, internal.chat.removeRemainingMessages, {
        conversationId: args.conversationId,
      })
    }

    await ctx.db.delete(args.conversationId)
  },
})

export const removeRemainingMessages = internalMutation({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const messageBatch = await ctx.db
      .query('messages')
      .withIndex('by_conversationId', (q) => q.eq('conversationId', args.conversationId))
      .take(500)

    for (const msg of messageBatch) {
      await ctx.db.delete(msg._id)
    }

    if (messageBatch.length === 500) {
      await ctx.scheduler.runAfter(0, internal.chat.removeRemainingMessages, {
        conversationId: args.conversationId,
      })
    }
  },
})

export const saveMessages = mutation({
  args: {
    conversationId: v.id('conversations'),
    messages: v.array(
      v.object({
        id: v.string(),
        messageData: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await assertOwnership(ctx, args.conversationId)

    const existingMessages = await ctx.db
      .query('messages')
      .withIndex('by_conversationId', (q) => q.eq('conversationId', args.conversationId))
      .collect()

    const existingByMessageId = new Map(existingMessages.map((m) => [m.messageId, m]))
    const nextMessageIds = new Set(args.messages.map((message) => message.id))

    for (const msg of args.messages) {
      const existing = existingByMessageId.get(msg.id)
      if (existing) {
        if (existing.messageData !== msg.messageData) {
          await ctx.db.patch(existing._id, { messageData: msg.messageData })
        }
      } else {
        await ctx.db.insert('messages', {
          conversationId: args.conversationId,
          messageId: msg.id,
          messageData: msg.messageData,
        })
      }
    }

    for (const existing of existingMessages) {
      if (!nextMessageIds.has(existing.messageId)) {
        await ctx.db.delete(existing._id)
      }
    }
  },
})

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx)
    if (!userId) {
      return []
    }

    return await ctx.db
      .query('conversations')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .order('desc')
      .take(50)
  },
})

export const get = query({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)
    const conversation = await ctx.db.get(args.conversationId)

    if (!conversation) {
      return null
    }

    // Only allow owner to view their conversations
    if (conversation.userId !== userId) {
      return null
    }

    return conversation
  },
})

export const getMessages = query({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx)
    const conversation = await ctx.db.get(args.conversationId)

    if (!conversation || conversation.userId !== userId) {
      return []
    }

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversationId', (q) => q.eq('conversationId', args.conversationId))
      .order('asc')
      .collect()

    return messages.map((m) => m.messageData)
  },
})
