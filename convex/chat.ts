import { abortStream, listUIMessages, storeFile, syncStreams, vStreamArgs } from '@convex-dev/agent'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'

import { components, internal } from './_generated/api'
import { action, internalAction, mutation, query } from './_generated/server'
import { agent } from './agent'
import { getAuthUserId } from './auth'
import { estimateTokens, rateLimiter } from './rateLimiting'
import { authorizeThreadAccess } from './thread'
import { getBillingPeriod, MONTHLY_LIMIT_TOKENS, getUsageTotalsForPeriod } from './usage'

export const initiateAsyncStreaming = mutation({
  args: {
    prompt: v.optional(v.string()),
    threadId: v.string(),
    attachments: v.optional(
      v.array(
        v.object({
          fileId: v.string(),
          filename: v.optional(v.string()),
          mediaType: v.string(),
          url: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, { prompt, threadId, attachments }) => {
    await authorizeThreadAccess(ctx, threadId)

    const userId = await getAuthUserId(ctx)
    if (!userId) {
      throw new Error('Unauthorized')
    }

    const content = [
      ...(attachments ?? []).map((attachment) =>
        attachment.mediaType.startsWith('image/')
          ? {
              type: 'image' as const,
              image: attachment.url,
              mediaType: attachment.mediaType,
            }
          : {
              type: 'file' as const,
              data: attachment.url,
              filename: attachment.filename,
              mediaType: attachment.mediaType,
            },
      ),
      ...(prompt && prompt.trim()
        ? [
            {
              type: 'text' as const,
              text: prompt,
            },
          ]
        : []),
    ]

    if (content.length === 0) {
      return
    }

    await rateLimiter.limit(ctx, 'sendMessage', {
      key: userId,
      throws: true,
    })
    await rateLimiter.limit(ctx, 'globalSendMessage', { throws: true })

    const estimatedTokenCount = await estimateTokens(ctx, threadId, prompt ?? '')

    await rateLimiter.check(ctx, 'tokenUsagePerUser', {
      key: userId,
      count: estimatedTokenCount,
      reserve: true,
      throws: true,
    })
    await rateLimiter.check(ctx, 'globalTokenUsage', {
      count: estimatedTokenCount,
      reserve: true,
      throws: true,
    })

    const billingPeriod = getBillingPeriod(Date.now())
    const currentUsage = await getUsageTotalsForPeriod(ctx, userId, billingPeriod)
    if (currentUsage.totalTokens + estimatedTokenCount > MONTHLY_LIMIT_TOKENS) {
      throw new Error('Monthly token usage limit reached. Please try again next month.')
    }

    const { messageId } = await agent.saveMessage(ctx, {
      threadId,
      message: {
        role: 'user',
        content,
      },
      metadata:
        attachments && attachments.length > 0
          ? { fileIds: attachments.map((attachment) => attachment.fileId) }
          : undefined,
      skipEmbeddings: true,
    })
    await ctx.scheduler.runAfter(0, internal.chat.streamAsync, {
      threadId,
      promptMessageId: messageId,
    })
  },
})

export const streamAsync = internalAction({
  args: { promptMessageId: v.string(), threadId: v.string() },
  handler: async (ctx, { promptMessageId, threadId }) => {
    const result = await agent.streamText(
      ctx,
      { threadId },
      { promptMessageId },
      { saveStreamDeltas: { chunking: 'word', throttleMs: 100 } },
    )
    await result.consumeStream()
  },
})

export const generateUploadUrl = mutation({
  args: { threadId: v.string() },
  handler: async (ctx, { threadId }) => {
    await authorizeThreadAccess(ctx, threadId)
    return await ctx.storage.generateUploadUrl()
  },
})

export const finalizeUploadedFile = action({
  args: {
    threadId: v.string(),
    storageId: v.id('_storage'),
    filename: v.optional(v.string()),
  },
  handler: async (ctx, { threadId, storageId, filename }) => {
    await authorizeThreadAccess(ctx, threadId)

    const blob = await ctx.storage.get(storageId)
    if (!blob) {
      throw new Error('Uploaded file not found')
    }

    const {
      file: { fileId, url, filename: savedFilename },
    } = await storeFile(ctx, components.agent, blob, { filename })

    await ctx.storage.delete(storageId)

    return {
      fileId,
      filename: savedFilename,
      mediaType: blob.type || 'application/octet-stream',
      url,
    }
  },
})

export const abortStreamByOrder = mutation({
  args: { threadId: v.string(), order: v.number() },
  handler: async (ctx, { threadId, order }) => {
    await authorizeThreadAccess(ctx, threadId)
    if (
      await abortStream(ctx, components.agent, {
        threadId,
        order,
        reason: 'Aborting explicitly',
      })
    ) {
      console.log('Aborted stream', threadId, order)
    } else {
      console.log('No stream found', threadId, order)
    }
  },
})

export const listThreadMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs,
  },
  handler: async (ctx, args) => {
    const { threadId, streamArgs } = args
    await authorizeThreadAccess(ctx, threadId)
    const streams = await syncStreams(ctx, components.agent, {
      threadId,
      streamArgs,
    })

    const paginated = await listUIMessages(ctx, components.agent, args)

    return {
      ...paginated,
      streams,
    }
  },
})
