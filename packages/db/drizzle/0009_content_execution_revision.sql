CREATE TABLE "content_execution_revisions" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "content_unit_id" uuid NOT NULL,
  "revision_number" integer NOT NULL,
  "status" text DEFAULT 'DRAFT' NOT NULL,
  "source_type" text DEFAULT 'MANUAL' NOT NULL,
  "format" text NOT NULL,
  "production_intent" text NOT NULL,
  "identity_version_id" uuid NOT NULL,
  "era_identity_id" uuid,
  "snapshot" jsonb NOT NULL,
  "source_provenance" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "decision_reason" text,
  "decided_by_actor_id" text,
  "decided_at" timestamp with time zone,
  "created_by_actor_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "content_execution_revisions_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "content_execution_revisions_content_unit_id_content_units_id_fk" FOREIGN KEY ("content_unit_id") REFERENCES "public"."content_units"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "content_execution_revisions_identity_version_id_fk" FOREIGN KEY ("identity_version_id") REFERENCES "public"."artist_identity_versions"("id") ON DELETE restrict ON UPDATE no action,
  CONSTRAINT "content_execution_revisions_era_identity_id_fk" FOREIGN KEY ("era_identity_id") REFERENCES "public"."era_identities"("id") ON DELETE set null ON UPDATE no action,
  CONSTRAINT "content_execution_revisions_revision_positive_check" CHECK ("revision_number" > 0),
  CONSTRAINT "content_execution_revisions_status_check" CHECK ("status" IN ('DRAFT','APPROVED','REJECTED','SUPERSEDED')),
  CONSTRAINT "content_execution_revisions_source_type_check" CHECK ("source_type" IN ('MANUAL','AI_PROPOSAL')),
  CONSTRAINT "content_execution_revisions_production_intent_check" CHECK ("production_intent" IN ('AUTHENTIC','CASUAL','POLISHED','CINEMATIC','EXPERIMENTAL')),
  CONSTRAINT "content_execution_revisions_unit_revision_uidx" UNIQUE("content_unit_id", "revision_number")
);
--> statement-breakpoint
CREATE INDEX "content_execution_revisions_artist_status_idx" ON "content_execution_revisions" USING btree ("artist_id", "status");
--> statement-breakpoint
CREATE INDEX "content_execution_revisions_unit_status_idx" ON "content_execution_revisions" USING btree ("content_unit_id", "status");
