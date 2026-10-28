import "@tanstack/react-start/server-only"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { ENV } from "varlock/env"

import { relations } from "@/lib/db/schema/relations"

const client = postgres(ENV.DATABASE_URL)

export const db = drizzle({
  client,
  relations,
})
