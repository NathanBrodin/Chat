CREATE TABLE IF NOT EXISTS "chat_embeddings" (
	"id" varchar PRIMARY KEY NOT NULL,
	"resource_id" varchar(191),
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat_resources" (
	"id" varchar PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_embeddings" ADD CONSTRAINT "chat_embeddings_resource_id_chat_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."chat_resources"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "chat_embeddings" USING hnsw ("embedding" vector_cosine_ops);