ALTER TABLE "users" DROP CONSTRAINT "users_email_key";--> statement-breakpoint
CREATE UNIQUE INDEX "user_index" ON "users" ("email");