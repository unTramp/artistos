CREATE TABLE "tone_corpus_items" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "text_content" text NOT NULL,
  "label" text NOT NULL,
  "source_type" text NOT NULL,
  "source_reference" text,
  "language" text,
  "is_private" boolean DEFAULT false NOT NULL,
  "created_by_actor_id" text,
  "archived_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "tone_corpus_items_label_check" CHECK ("label" IN ('AUTHENTIC', 'GOOD', 'NEUTRAL', 'DO_NOT_COPY', 'OUTDATED'))
);
--> statement-breakpoint
CREATE TABLE "candidate_knowledge" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "source_type" text NOT NULL,
  "source_id" text NOT NULL,
  "content" text NOT NULL,
  "destination" text NOT NULL,
  "destination_target_id" text,
  "status" text DEFAULT 'PENDING' NOT NULL,
  "confidence_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "promoted_entity_type" text,
  "promoted_entity_id" text,
  "merged_into_candidate_id" uuid,
  "resolution_reason" text,
  "resolved_by_actor_id" text,
  "resolved_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "candidate_knowledge_destination_check" CHECK ("destination" IN ('ARTIST_BRAIN', 'SONG_BRAIN', 'IDENTITY', 'ERA', 'PLATFORM_KNOWLEDGE', 'BUSINESS_KNOWLEDGE')),
  CONSTRAINT "candidate_knowledge_status_check" CHECK ("status" IN ('PENDING', 'ACCEPTED', 'REJECTED', 'MERGED', 'EXPIRED'))
);
--> statement-breakpoint
CREATE TABLE "artist_brain_knowledge_items" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "content" text NOT NULL,
  "source_candidate_id" uuid NOT NULL,
  "source_type" text NOT NULL,
  "source_id" text NOT NULL,
  "created_by_actor_id" text,
  "archived_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artist_brain_snapshots" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "version_number" integer NOT NULL,
  "payload" jsonb NOT NULL,
  "source_refs" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "built_by_actor_id" text,
  "built_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tone_corpus_items" ADD CONSTRAINT "tone_corpus_items_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "candidate_knowledge" ADD CONSTRAINT "candidate_knowledge_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "candidate_knowledge" ADD CONSTRAINT "candidate_knowledge_merged_into_candidate_id_fk" FOREIGN KEY ("merged_into_candidate_id") REFERENCES "public"."candidate_knowledge"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "artist_brain_knowledge_items" ADD CONSTRAINT "artist_brain_knowledge_items_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "artist_brain_knowledge_items" ADD CONSTRAINT "artist_brain_knowledge_items_source_candidate_id_fk" FOREIGN KEY ("source_candidate_id") REFERENCES "public"."candidate_knowledge"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "artist_brain_snapshots" ADD CONSTRAINT "artist_brain_snapshots_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "tone_corpus_items_artist_label_idx" ON "tone_corpus_items" USING btree ("artist_id", "label");
--> statement-breakpoint
CREATE INDEX "candidate_knowledge_artist_status_idx" ON "candidate_knowledge" USING btree ("artist_id", "status");
--> statement-breakpoint
CREATE INDEX "candidate_knowledge_artist_destination_idx" ON "candidate_knowledge" USING btree ("artist_id", "destination");
--> statement-breakpoint
CREATE UNIQUE INDEX "artist_brain_knowledge_source_candidate_uidx" ON "artist_brain_knowledge_items" USING btree ("source_candidate_id");
--> statement-breakpoint
CREATE INDEX "artist_brain_knowledge_artist_idx" ON "artist_brain_knowledge_items" USING btree ("artist_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "artist_brain_snapshots_artist_version_uidx" ON "artist_brain_snapshots" USING btree ("artist_id", "version_number");
