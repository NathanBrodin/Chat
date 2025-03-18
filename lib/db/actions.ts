"use server"

import { generateId } from "ai"
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm"
import { conversations, messages as messagesTable } from "./schema"
import { AIState } from "../chat/types"
import { db } from "."
import { getDateRange } from "../utils"
import { unstable_cache } from "next/cache"

export async function saveChat(state: AIState) {
  const { id, messages: chatMessages, location } = state

  // If we only have two messages, then it's the initial conversation
  if (chatMessages.length === 2) {
    // Get the preview from the second-to-last message
    const previewMessage = chatMessages.at(-2)?.content || ""
    const preview = previewMessage.slice(0, 100)

    const conversation: typeof conversations.$inferInsert = {
      id: id,
      preview,
      city: location?.city,
      region: location?.region,
      country: location?.country,
      latitude: location?.latitude,
      longitude: location?.longitude,
      countryRegion: location?.region,
    }

    try {
      await db.insert(conversations).values(conversation)
    } catch {}
  }

  // Format the last two new messages of the conversation
  const messages: (typeof messagesTable.$inferInsert)[] = chatMessages.slice(-2).map((message) => ({
    id: generateId(),
    conversationId: id,
    role: message.role,
    content: message.content,
  }))

  try {
    await db.insert(messagesTable).values(messages)
  } catch {}
}

export async function getConversations({
  page = 1,
  limit = 10,
  countries = [],
  dateRange,
}: {
  page?: number
  limit?: number
  countries?: string[]
  dateRange?: string
}) {
  const offset = (page - 1) * limit

  // Build the condition dynamically
  let baseCondition = undefined

  // Add country filter if provided
  if (countries && countries.length > 0) {
    baseCondition = inArray(conversations.country, countries)
  }

  // Add date range filter if provided
  if (dateRange) {
    const dateRangeObj = getDateRange(dateRange)
    if (dateRangeObj) {
      const dateRangeCondition = and(
        gte(conversations.createdAt, dateRangeObj.start),
        lte(conversations.createdAt, dateRangeObj.end)
      )

      baseCondition = baseCondition ? and(baseCondition, dateRangeCondition) : dateRangeCondition
    }
  }

  const data = await db
    .select({
      id: conversations.id,
      preview: conversations.preview,
      createdAt: conversations.createdAt,
      city: conversations.city,
      region: conversations.region,
      country: conversations.country,
    })
    .from(conversations)
    .where(baseCondition)
    .orderBy(desc(conversations.createdAt))
    .limit(limit)
    .offset(offset)

  // Apply the same filtering to the count query
  const totalCount = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(conversations)
    .where(baseCondition)

  return {
    conversations: data,
    totalCount: totalCount[0].count,
    hasMore: offset + data.length < totalCount[0].count,
  }
}

export const getMessages = unstable_cache(async (conversationId: string) => {
  return await db
    .select({ id: messagesTable.id, role: messagesTable.role, display: messagesTable.content })
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationId))
})
