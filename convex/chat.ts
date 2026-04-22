import {
  abortStream,
  createThread,
  listUIMessages,
  syncStreams,
  vStreamArgs,
} from '@convex-dev/agent'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'

import { components, internal } from './_generated/api'
import { internalAction, mutation, query } from './_generated/server'
import { agent } from './agent'
import { authorizeThreadAccess } from './thread'

export const initiateAsyncStreaming = mutation({
  args: { prompt: v.string(), threadId: v.string() },
  handler: async (ctx, { prompt, threadId }) => {
    await authorizeThreadAccess(ctx, threadId)
    const { messageId } = await agent.saveMessage(ctx, {
      threadId,
      prompt,
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
