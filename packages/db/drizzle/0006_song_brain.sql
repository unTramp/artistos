CREATE TABLE "song_brain_statements" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "song_id" uuid NOT NULL,
  "statement_type" text NOT NULL,
  "statement" text NOT NULL,
  "source_label" text,
  "created_by_actor_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "song_brain_statements_type_check" CHECK ("statement_type" IN ('FACT', 'ARTIST_INTERPRETATION', 'AUDIENCE_INTERPRETATION'))
);
--> statement-breakpoint
CREATE TABLE "song_identity_contexts" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "song_id" uuid NOT NULL,
  "identity_version_id" uuid NOT NULL,
  "era_identity_id" uuid,
  "song_specific_visual_notes" text,
  "song_specific_anchors" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "allowed_overrides" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "song_identity_contexts_song_uidx" UNIQUE("song_id")
);
--> statement-breakpoint
ALTER TABLE "song_brain_statements" ADD CONSTRAINT "song_brain_statements_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "song_brain_statements" ADD CONSTRAINT "song_brain_statements_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "song_identity_contexts" ADD CONSTRAINT "song_identity_contexts_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "song_identity_contexts" ADD CONSTRAINT "song_identity_contexts_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "song_identity_contexts" ADD CONSTRAINT "song_identity_contexts_identity_version_id_artist_identity_versions_id_fk" FOREIGN KEY ("identity_version_id") REFERENCES "public"."artist_identity_versions"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "song_identity_contexts" ADD CONSTRAINT "song_identity_contexts_era_identity_id_era_identities_id_fk" FOREIGN KEY ("era_identity_id") REFERENCES "public"."era_identities"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "song_brain_statements_song_idx" ON "song_brain_statements" USING btree ("song_id", "created_at");
