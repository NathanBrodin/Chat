import type { Id } from '@convex/_generated/dataModel'

import { api } from '@convex/_generated/api'
import { createServerFn } from '@tanstack/react-start'

import { fetchAuthMutation, fetchAuthQuery } from '@/lib/auth/auth-server'

export const createConversation = createServerFn({ method: 'POST' })
  .inputValidator((data: { title: string }) => data)
  .handler(async ({ data }) => {
    const conversationId = await fetchAuthMutation(api.chat.create, {
      title: data.title,
    })
    return conversationId as string
  })

export const renameConversation = createServerFn({ method: 'POST' })
  .inputValidator((data: { conversationId: string; title: string }) => data)
  .handler(async ({ data }) => {
    await fetchAuthMutation(api.chat.rename, {
      conversationId: data.conversationId as Id<'conversations'>,
      title: data.title,
    })
  })

export const removeConversation = createServerFn({ method: 'POST' })
  .inputValidator((data: { conversationId: string }) => data)
  .handler(async ({ data }) => {
    await fetchAuthMutation(api.chat.remove, {
      conversationId: data.conversationId as Id<'conversations'>,
    })
  })

export const getConversationMessages = createServerFn({ method: 'GET' })
  .inputValidator((data: { conversationId: string }) => data)
  .handler(async ({ data }) => {
    return await fetchAuthQuery(api.chat.getMessages, {
      conversationId: data.conversationId as Id<'conversations'>,
    })
  })

export const getConversation = createServerFn({ method: 'GET' })
  .inputValidator((data: { conversationId: string }) => data)
  .handler(async ({ data }) => {
    return await fetchAuthQuery(api.chat.get, {
      conversationId: data.conversationId as Id<'conversations'>,
    })
  })
