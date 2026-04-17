import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

import { tables as authTables } from './auth/schema'

export default defineSchema({
  conversations: defineTable({
    title: v.string(),
    userId: v.string(),
  }).index('by_userId', ['userId']),
  messages: defineTable({
    conversationId: v.id('conversations'),
    messageId: v.string(),
    messageData: v.string(),
  })
    .index('by_conversationId', ['conversationId'])
    .index('by_conversationId_and_messageId', ['conversationId', 'messageId']),
  ...authTables,
})
