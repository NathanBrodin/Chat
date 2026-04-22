import { createThread, getThreadMetadata, saveMessage, vMessage } from '@convex-dev/agent'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { z } from 'zod/v3'

import { components } from './_generated/api'
import { action, ActionCtx, mutation, MutationCtx, query, QueryCtx } from './_generated/server.js'
import { agent } from './agent'
import { getAuthUserId } from './auth'

export const listThreads = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)

    if (!userId) {
      return {
        page: [],
        isDone: true,
        continueCursor: '',
      }
    }

    const threads = await ctx.runQuery(components.agent.threads.listThreadsByUserId, {
      userId,
      paginationOpts: args.paginationOpts,
    })
    return threads
  },
})

export const createNewThread = mutation({
  args: { title: v.optional(v.string()), initialMessage: v.optional(vMessage) },
  handler: async (ctx, { title, initialMessage }) => {
    const userId = await getAuthUserId(ctx)
    const threadId = await createThread(ctx, components.agent, {
      userId,
      title,
    })
    if (initialMessage) {
      await saveMessage(ctx, components.agent, {
        threadId,
        message: initialMessage,
      })
    }
    return threadId
  },
})

export const getThreadDetails = query({
  args: { threadId: v.string() },
  handler: async (ctx, { threadId }) => {
    await authorizeThreadAccess(ctx, threadId)
    const { title, summary } = await getThreadMetadata(ctx, components.agent, {
      threadId,
    })
    return { title, summary }
  },
})

export const generateThreadTitle = action({
  args: { threadId: v.string() },
  handler: async (ctx, { threadId }) => {
    await authorizeThreadAccess(ctx, threadId)
    const { thread } = await agent.continueThread(ctx, { threadId })
    const {
      object: { title, summary },
    } = await thread.generateObject(
      {
        schemaDescription:
          "Generate a title and summary for the thread. The title should be a single sentence that captures the main topic of the thread. The summary should be a short description of the thread that could be used to describe it to someone who hasn't read it.",
        schema: z.object({
          title: z.string().describe('The new title for the thread'),
          summary: z.string().describe('The new summary for the thread'),
        }),
        prompt: 'Generate a title and summary for this thread.',
      },
      { storageOptions: { saveMessages: 'none' } },
    )
    await thread.updateMetadata({ title, summary })
  },
})

export const updateThreadTitle = mutation({
  args: { threadId: v.string(), title: v.optional(v.string()), summary: v.optional(v.string()) },
  handler: async (ctx, { threadId, title, summary }) => {
    await authorizeThreadAccess(ctx, threadId)

    const patch: { title?: string; summary?: string } = {}
    if (title !== undefined) {
      patch.title = title
    }
    if (summary !== undefined) {
      patch.summary = summary
    }

    if (Object.keys(patch).length === 0) {
      return
    }

    await ctx.runMutation(components.agent.threads.updateThread, {
      threadId,
      patch,
    })
  },
})

export const deleteThread = mutation({
  args: { threadId: v.string() },
  handler: async (ctx, { threadId }) => {
    await agent.deleteThreadAsync(ctx, { threadId })
  },
})

export async function authorizeThreadAccess(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  threadId: string,
  requireUser?: boolean,
) {
  const userId = await getAuthUserId(ctx)
  if (requireUser && !userId) {
    throw new Error('Unauthorized: user is required')
  }
  const { userId: threadUserId } = await getThreadMetadata(ctx, components.agent, { threadId })
  if (requireUser && threadUserId !== userId) {
    throw new Error('Unauthorized: user does not match thread user')
  }
}
