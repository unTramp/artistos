CREATE TABLE "planning_objectives" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "title" text NOT NULL,
  "statement" text NOT NULL,
  "period_start" date NOT NULL,
  "period_end" date NOT NULL,
  "scope" text NOT NULL,
  "campaign_id" uuid,
  "release_id" uuid,
  "priority" text NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "completed_at" timestamp with time zone,
  "created_by_actor_id" text,
  "updated_by_actor_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "planning_objectives_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "planning_objectives_scope_check" CHECK ("scope" IN ('ARTIST','CAMPAIGN','RELEASE','EVERGREEN','CUSTOM')),
  CONSTRAINT "planning_objectives_priority_check" CHECK ("priority" IN ('PRIMARY','SECONDARY')),
  CONSTRAINT "planning_objectives_period_check" CHECK ("period_start" <= "period_end"),
  CONSTRAINT "planning_objectives_scope_ref_check" CHECK (
    ("scope" = 'CAMPAIGN' AND "campaign_id" IS NOT NULL AND "release_id" IS NULL)
    OR ("scope" = 'RELEASE' AND "release_id" IS NOT NULL AND "campaign_id" IS NULL)
    OR ("scope" NOT IN ('CAMPAIGN','RELEASE') AND "campaign_id" IS NULL AND "release_id" IS NULL)
  )
);
--> statement-breakpoint
CREATE INDEX "planning_objectives_artist_period_idx" ON "planning_objectives" USING btree ("artist_id","period_start","period_end");
--> statement-breakpoint
CREATE INDEX "planning_objectives_artist_priority_idx" ON "planning_objectives" USING btree ("artist_id","priority","completed_at");
