ALTER TABLE "account" DROP CONSTRAINT "account_user_id_user_id_fkey";--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_user_id_fkey";--> statement-breakpoint
DROP TABLE "account";--> statement-breakpoint
DROP TABLE "session";--> statement-breakpoint
DROP TABLE "user";--> statement-breakpoint
DROP TABLE "verification";