import { desc, eq } from "drizzle-orm"

import type { ConversationLocation } from "@/lib/chat/geolocation"
import { db } from "@/lib/db/index"
import { conversation } from "@/lib/db/schema/chat.schema"
import type { ChatUIMessage } from "@/tools/index"

const TITLE_MAX_LENGTH = 80

function deriveTitle(messages: ChatUIMessage[]) {
  const text = messages
    .find((message) => message.role === "user")
    ?.parts.filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ")
    .trim()
    .replace(/\s+/g, " ")

  if (!text) {
    return "New conversation"
  }

  return text.length > TITLE_MAX_LENGTH ? `${text.slice(0, TITLE_MAX_LENGTH).trimEnd()}…` : text
}

function deriveUsage(messages: ChatUIMessage[]) {
  return messages.findLast((message) => message.role === "assistant")?.metadata?.usage ?? null
}

export async function saveConversation({
  id,
  messages,
  location,
}: {
  id: string
  messages: ChatUIMessage[]
  location: ConversationLocation
}) {
  const values = {
    id,
    title: deriveTitle(messages),
    ...location,
    usage: deriveUsage(messages),
    messages,
  }

  await db
    .insert(conversation)
    .values(values)
    .onConflictDoUpdate({
      target: conversation.id,
      set: {
        ...values,
        updatedAt: new Date(),
      },
    })
}

export function listConversations() {
  return db
    .select({
      id: conversation.id,
      title: conversation.title,
      country: conversation.country,
      city: conversation.city,
      createdAt: conversation.createdAt,
    })
    .from(conversation)
    .orderBy(desc(conversation.createdAt))
}

export async function getConversation(id: string) {
  const rows = await db.select().from(conversation).where(eq(conversation.id, id)).limit(1)
  return rows[0] ?? null
}
