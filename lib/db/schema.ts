import { generateId } from "ai"
import { sql } from "drizzle-orm"
import { index, pgTableCreator, text, timestamp, varchar, vector } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const createTable = pgTableCreator((name) => `chat_${name}`)

export const resources = createTable("resources", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  content: text("content").notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
})

export const embeddings = createTable(
  "embeddings",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    resourceId: varchar("resource_id", { length: 191 }).references(() => resources.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using("hnsw", table.embedding.op("vector_cosine_ops")),
  })
)

// Schema for resources - used to validate API requests
export const insertResourceSchema = createSelectSchema(resources).extend({}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

// Type for resources - used to type API request params and within Components
export type NewResourceParams = z.infer<typeof insertResourceSchema>
