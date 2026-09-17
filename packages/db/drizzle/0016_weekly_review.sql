CREATE TABLE IF NOT EXISTS "weekly_reviews" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "period_start" timestamp with time zone NOT NULL,
  "period_end" timestamp with time zone NOT NULL,
  "generated_at" timestamp with time zone NOT NULL,
  "configuration_version" text NOT NULL,
  "source_snapshot_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "insight_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_by_actor_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "weekly_reviews_period_check" CHECK ("period_end" > "period_start"),
  CONSTRAINT "weekly_reviews_generated_check" CHECK ("generated_at" >= "period_end")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "weekly_reviews" ADD CONSTRAINT "weekly_reviews_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "weekly_reviews_artist_period_idx" ON "weekly_reviews" USING btree ("artist_id","period_end","generated_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "weekly_reviews_artist_generated_idx" ON "weekly_reviews" USING btree ("artist_id","generated_at");
