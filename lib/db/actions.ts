import "server-only"

import { captureException } from "@sentry/nextjs"
import { generateId } from "ai"
import { conversations, messages as messagesTable } from "./schema"
import { AIState } from "../chat/types"
import { db } from "."

export async function saveChat(state: AIState) {
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
