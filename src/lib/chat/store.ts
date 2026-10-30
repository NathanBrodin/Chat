import { desc, eq } from "drizzle-orm"

import type { ConversationMetadata } from "@/lib/chat/context-usage"
import { model } from "@/lib/chat/model"
import type { ChatUIMessage } from "@/lib/chat/tools"
import { db } from "@/lib/db/index"
import { conversation } from "@/lib/db/schema/chat.schema"
import type { Location } from "@/lib/geolocation"

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

function deriveMetadata(messages: ChatUIMessage[]): ConversationMetadata {
  const lastAssistant = messages.findLast((message) => message.role === "assistant")

  return {
    model: lastAssistant?.metadata?.model ?? model,
    usage: lastAssistant?.metadata?.usage ?? null,
    cost: messages.reduce(
      (total, message) =>
        total + (message.role === "assistant" ? (message.metadata?.cost ?? 0) : 0),
      0,
    ),
  }
}

export async function saveConversation({
  id,
  messages,
  location,
}: {
  id: string
  messages: ChatUIMessage[]
  location: Location
}) {
  const values = {
    id,
    title: deriveTitle(messages),
    ...location,
    metadata: deriveMetadata(messages),
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

const DEFAULT_CONVERSATION_PAGE_SIZE = 20

function selectConversationSummaries() {
  return db
    .select({
      id: conversation.id,
      title: conversation.title,
      country: conversation.country,
      city: conversation.city,
      metadata: conversation.metadata,
      createdAt: conversation.createdAt,
    })
    .from(conversation)
}

export type ConversationSummary = Awaited<ReturnType<typeof selectConversationSummaries>>[number]

export type ConversationPage = {
  conversations: ConversationSummary[]
  nextOffset: number | null
}

export async function listConversations({
  offset = 0,
  limit = DEFAULT_CONVERSATION_PAGE_SIZE,
}: {
  offset?: number
  limit?: number
} = {}): Promise<ConversationPage> {
  // Fetch one extra row to know whether another page exists without a count query.
  const rows = await selectConversationSummaries()
    .orderBy(desc(conversation.createdAt), desc(conversation.id))
    .limit(limit + 1)
    .offset(offset)

  const hasMore = rows.length > limit

  return {
    conversations: hasMore ? rows.slice(0, limit) : rows,
    nextOffset: hasMore ? offset + limit : null,
  }
}

export async function getConversation(id: string) {
  const rows = await db.select().from(conversation).where(eq(conversation.id, id)).limit(1)
  const row = rows[0]

  if (!row) {
    return null
  }

  // Older rows were saved before response message IDs were generated, which
  // collides React keys. Derive stable ids so they can be resumed safely.
  return {
    ...row,
    messages: row.messages.map((message, index) => ({
      ...message,
      id: message.id || `${row.id}-${index}`,
    })),
  }
}
