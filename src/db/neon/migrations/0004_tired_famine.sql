ALTER TABLE "chat" ADD COLUMN "last_message_id" uuid;--> statement-breakpoint
ALTER TABLE "chat" ADD COLUMN "last_message_snippet" varchar(100);