CREATE TYPE "public"."friendship_status" AS ENUM('accepted', 'pending', 'rejected');--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "nativeLanguage" TO "native_language";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "learningLanguage" TO "learning_language";