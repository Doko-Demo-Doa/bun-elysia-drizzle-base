CREATE TABLE IF NOT EXISTS "wallpapers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_name" varchar(2048) NOT NULL,
	"url" varchar(2048) NOT NULL,
	"is_mobile" smallint NOT NULL,
	"created_at" date NOT NULL,
	"updated_at" date
);
