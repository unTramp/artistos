CREATE TABLE IF NOT EXISTS "learnings" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "statement" text NOT NULL,
  "scope" text NOT NULL,
  "confidence" text NOT NULL,
  "confidence_rationale" text NOT NULL,
  "references" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "fresh_until" timestamp with time zone,
  "status" text DEFAULT 'CANDIDATE' NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_by_actor_id" text,
  "updated_by_actor_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "learnings_scope_check" CHECK ("scope" IN ('ARTIST_GLOBAL','PLATFORM','SONG','PILLAR','FORMAT','AUDIENCE','CAMPAIGN','AUDIO_SEGMENT','NARRATIVE','MARKET','BUSINESS','IDENTITY')),
  CONSTRAINT "learnings_confidence_check" CHECK ("confidence" IN ('LOW','MEDIUM','HIGH')),
  CONSTRAINT "learnings_status_check" CHECK ("status" IN ('CANDIDATE','TESTING','VALIDATED','STALE','DEPRECATED'))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "learning_state_history" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "learning_id" uuid NOT NULL,
  "from_status" text,
  "to_status" text NOT NULL,
  "rationale" text,
  "actor_type" text NOT NULL,
  "actor_id" text,
  "trace_id" text NOT NULL,
  "changed_at" timestamp with time zone NOT NULL,
  CONSTRAINT "learning_state_history_from_status_check" CHECK ("from_status" IS NULL OR "from_status" IN ('CANDIDATE','TESTING','VALIDATED','STALE','DEPRECATED')),
  CONSTRAINT "learning_state_history_to_status_check" CHECK ("to_status" IN ('CANDIDATE','TESTING','VALIDATED','STALE','DEPRECATED'))
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "learnings" ADD CONSTRAINT "learnings_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "learning_state_history" ADD CONSTRAINT "learning_state_history_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "learning_state_history" ADD CONSTRAINT "learning_state_history_learning_id_learnings_id_fk" FOREIGN KEY ("learning_id") REFERENCES "public"."learnings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "learnings_artist_status_idx" ON "learnings" USING btree ("artist_id","status","updated_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "learnings_artist_scope_idx" ON "learnings" USING btree ("artist_id","scope");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "learnings_artist_fresh_idx" ON "learnings" USING btree ("artist_id","fresh_until");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "learning_state_history_learning_idx" ON "learning_state_history" USING btree ("learning_id","changed_at");
