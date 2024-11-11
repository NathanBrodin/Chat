import { decimal, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core"

// Conversations table
export const conversations = pgTable("chat_conversations", {
  id: varchar("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),

  // Geographic information
  city: varchar("city", { length: 100 }),
  region: varchar("region", { length: 100 }),
  country: varchar("country", { length: 100 }),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  countryRegion: varchar("country_region", { length: 100 }),
})

// Messages table
export const messages = pgTable("chat_messages", {
  id: varchar("id").primaryKey(),
  conversationId: varchar("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 10 }).notNull().$type<"user" | "assistant">(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
