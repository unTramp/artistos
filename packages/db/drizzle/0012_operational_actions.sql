CREATE TABLE "operational_actions" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "source_domain" text NOT NULL,
  "source_entity_type" text NOT NULL,
  "source_entity_id" text NOT NULL,
  "platform" text,
  "title" text NOT NULL,
  "description" text,
  "action_type" text NOT NULL,
  "status" text DEFAULT 'OPEN' NOT NULL,
  "priority" text DEFAULT 'NORMAL' NOT NULL,
  "due_at" timestamp with time zone,
  "not_before" timestamp with time zone,
  "execution_mode" text NOT NULL,
  "external_url" text,
  "evidence_ref" text,
  "state_reason" text,
  "version" integer DEFAULT 1 NOT NULL,
  "completed_at" timestamp with time zone,
  "created_by_actor_id" text,
  "updated_by_actor_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "operational_actions_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "operational_actions_status_check" CHECK ("status" IN ('OPEN','IN_PROGRESS','BLOCKED','DONE','SKIPPED','EXPIRED')),
  CONSTRAINT "operational_actions_priority_check" CHECK ("priority" IN ('LOW','NORMAL','HIGH','URGENT')),
  CONSTRAINT "operational_actions_execution_mode_check" CHECK ("execution_mode" IN ('MANUAL_NATIVE','EXTERNAL','API_ASSISTED','SYSTEM_CHECK')),
  CONSTRAINT "operational_actions_window_check" CHECK ("due_at" IS NULL OR "not_before" IS NULL OR "not_before" <= "due_at"),
  CONSTRAINT "operational_actions_done_time_check" CHECK (("status" = 'DONE' AND "completed_at" IS NOT NULL) OR ("status" <> 'DONE' AND "completed_at" IS NULL))
);
--> statement-breakpoint
CREATE INDEX "operational_actions_artist_status_idx" ON "operational_actions" USING btree ("artist_id","status");
--> statement-breakpoint
CREATE INDEX "operational_actions_artist_due_idx" ON "operational_actions" USING btree ("artist_id","due_at");
--> statement-breakpoint
CREATE INDEX "operational_actions_source_idx" ON "operational_actions" USING btree ("artist_id","source_domain","source_entity_type","source_entity_id");
