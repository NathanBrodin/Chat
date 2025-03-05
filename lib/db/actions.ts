"use server"

import { captureException } from "@sentry/nextjs"
import { generateId } from "ai"
import { desc, eq, not, sql } from "drizzle-orm"
import { conversations, messages as messagesTable } from "./schema"
import { AIState } from "../chat/types"
import { db } from "."

export async function saveChat(state: AIState) {
  const { id, messages: chatMessages, location } = state

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

  // Format the last two new messages of the conversation
  const messages: (typeof messagesTable.$inferInsert)[] = chatMessages.slice(-2).map((message) => ({
    id: generateId(),
    conversationId: id,
    role: message.role,
    content: message.content,
  }))

  try {
    await db.insert(conversations).values(conversation).onConflictDoNothing()
    await db.insert(messagesTable).values(messages)
  } catch (error) {
    captureException(error)
  }
}

export async function getConversations(page = 1, limit = 10) {
  const offset = (page - 1) * limit

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
    .where(not(eq(conversations.city, "Unknown")))
    .orderBy(desc(conversations.createdAt))
    .limit(limit)
    .offset(offset)

  const totalCount = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(conversations)

  return {
    conversations: data,
    totalCount: totalCount[0].count,
    hasMore: offset + data.length < totalCount[0].count,
  }
}

export async function getMessages(conversationId: string) {
  return await db
    .select({ id: messagesTable.id, role: messagesTable.role, display: messagesTable.content })
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationId))
}
