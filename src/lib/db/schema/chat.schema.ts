import type { LanguageModelUsage } from "ai"
import { doublePrecision, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import type { ChatUIMessage } from "@/tools"

export const conversation = pgTable("conversation", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),

  // Geolocation, one column per Vercel header so it can be filtered later.
  city: text("city"),
  country: text("country"),
  region: text("region"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  timezone: text("timezone"),

  usage: jsonb("usage").$type<LanguageModelUsage | null>(),
  messages: jsonb("messages").$type<ChatUIMessage[]>().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})
