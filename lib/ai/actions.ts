import "server-only"

import { insertResourceSchema, NewResourceParams, resources } from "@/lib/db/schema"
import { generateEmbeddings } from "./embedding"
import { db } from "../db"
import { embeddings as embeddingsTable } from "../db/schema"

export const createResource = async (input: NewResourceParams) => {
  "use server"
  try {
    const { content } = insertResourceSchema.parse(input)

    const [resource] = await db.insert(resources).values({ content }).returning()

    const embeddings = await generateEmbeddings(content)
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        resourceId: resource.id,
        ...embedding,
      }))
    )

    return "Resource successfully created and embedded."
  } catch (e) {
    if (e instanceof Error) return e.message.length > 0 ? e.message : "Error, please try again."
  }
}
