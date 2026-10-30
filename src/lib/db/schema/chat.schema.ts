import { doublePrecision, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import type { ConversationMetadata } from "@/lib/chat/context-usage"
import type { ChatUIMessage } from "@/tools"

export const conversation = pgTable("conversation", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),

  // Geolocation
  city: text("city"),
  country: text("country"),
  region: text("region"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  timezone: text("timezone"),

  metadata: jsonb("metadata").$type<ConversationMetadata | null>(),
  messages: jsonb("messages").$type<ChatUIMessage[]>().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})
