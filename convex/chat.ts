import { v } from 'convex/values'

import type { Id } from './_generated/dataModel'

import { mutation, query, type QueryCtx } from './_generated/server'

const attachmentValidator = v.object({
  storageId: v.id('_storage'),
  filename: v.optional(v.string()),
  mediaType: v.string(),
  size: v.optional(v.number()),
})

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

    while (true) {
      const messages = await ctx.db
        .query('messages')
        .withIndex('by_conversationId', (q) => q.eq('conversationId', args.conversationId))
        .take(100)

      if (messages.length === 0) {
        break
      }

      for (const message of messages) {
        for (const attachment of message.attachments ?? []) {
          await ctx.storage.delete(attachment.storageId)
        }

        await ctx.db.delete(message._id)
      }
    }

    await ctx.db.delete(args.conversationId)
  },
})

export const insertMessage = mutation({
  args: {
    conversationId: v.id('conversations'),
    messageId: v.string(),
    messageData: v.string(),
    attachments: v.optional(v.array(attachmentValidator)),
  },
  handler: async (ctx, args) => {
    await assertOwnership(ctx, args.conversationId)

    return await ctx.db.insert('messages', {
      attachments: args.attachments,
      conversationId: args.conversationId,
      messageId: args.messageId,
      messageData: args.messageData,
    })
  },
})

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx)
    if (!userId) {
      throw new Error('Not authenticated')
    }

    return await ctx.storage.generateUploadUrl()
  },
})

// Queries

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

    return await Promise.all(
      messages.map(async (message) => {
        const parsedMessage = JSON.parse(message.messageData) as {
          parts?: Array<{
            type?: string
            filename?: string
            mediaType?: string
            url?: string
          }>
        }

        if (!Array.isArray(parsedMessage.parts) || (message.attachments?.length ?? 0) === 0) {
          return message.messageData
        }

        let attachmentIndex = 0

        const hydratedParts = await Promise.all(
          parsedMessage.parts.map(async (part) => {
            if (part.type !== 'file') {
              return part
            }

            const attachment = message.attachments?.[attachmentIndex]
            attachmentIndex += 1

            if (!attachment) {
              return part
            }

            const url = await ctx.storage.getUrl(attachment.storageId)
            return url ? { ...part, url } : part
          }),
        )

        return JSON.stringify({
          ...parsedMessage,
          parts: hydratedParts,
        })
      }),
    )
  },
})
