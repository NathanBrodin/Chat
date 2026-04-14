import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

import { tables as authTables } from './auth/schema'

export default defineSchema({
  products: defineTable({
    title: v.string(),
    imageId: v.string(),
    price: v.number(),
  }),
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
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
