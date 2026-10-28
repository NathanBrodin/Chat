CREATE TABLE "conversation" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"city" text,
	"country" text,
	"region" text,
	"latitude" double precision,
	"longitude" double precision,
	"timezone" text,
	"usage" jsonb,
	"messages" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
