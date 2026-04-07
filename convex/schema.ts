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
  ...authTables,
})
