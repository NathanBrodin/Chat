import "server-only"

import { captureException } from "@sentry/nextjs"
import { generateId } from "ai"
import { conversations, messages as messagesTable } from "./schema"
import { AIState } from "../chat/types"
import { db } from "."
import { desc, eq } from "drizzle-orm"

export async function saveChat(state: AIState) {
  "use server"

  const { id, messages: chatMessages, location } = state

  const conversation: typeof conversations.$inferInsert = {
    id: id,
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

export async function getConversations() {
  "use server"

  return await db
    .select({
      id: conversations.id,
      createdAt: conversations.createdAt,
      city: conversations.city,
      region: conversations.region,
      country: conversations.country,
    })
    .from(conversations)
    .orderBy(desc(conversations.createdAt))
    .limit(10)
}

export async function getMessages(conversationId: string) {
  "use server"

  return await db
    .select({ id: messagesTable.id, role: messagesTable.role, display: messagesTable.content })
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, conversationId))
}
