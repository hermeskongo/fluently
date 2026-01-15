CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstname" varchar(100) NOT NULL,
	"lastname" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" varchar NOT NULL,
	"bio" varchar(255),
	"picture" text DEFAULT '',
	"nativeLanguage" varchar(25) DEFAULT '',
	"learningLanguage" varchar(25) DEFAULT '',
	"isOnboarded" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_name_unique" UNIQUE("name")
);
