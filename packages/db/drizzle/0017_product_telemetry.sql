CREATE TABLE IF NOT EXISTS "product_telemetry_events" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "event_name" text NOT NULL,
  "surface" text NOT NULL,
  "entity_type" text,
  "entity_id" text,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "actor_id" text,
  "occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_telemetry_events" ADD CONSTRAINT "product_telemetry_events_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_telemetry_artist_event_idx" ON "product_telemetry_events" USING btree ("artist_id","event_name","occurred_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_telemetry_artist_surface_idx" ON "product_telemetry_events" USING btree ("artist_id","surface","occurred_at");
