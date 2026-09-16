CREATE TABLE "content_angles" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "song_id" uuid,
  "campaign_id" uuid,
  "identity_version_id" uuid,
  "era_identity_id" uuid,
  "title" text NOT NULL,
  "idea" text NOT NULL,
  "pillar" text NOT NULL,
  "mode" text NOT NULL,
  "goal" text NOT NULL,
  "audience" text NOT NULL,
  "platform_targets" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "required_assets" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "learning_value" text NOT NULL,
  "why" text NOT NULL,
  "identity_fit_rationale" text NOT NULL,
  "production_effort" text NOT NULL,
  "source_type" text DEFAULT 'MANUAL' NOT NULL,
  "source_provenance" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "original_snapshot" jsonb NOT NULL,
  "status" text DEFAULT 'DRAFT' NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "rejection_reason" text,
  "decision_note" text,
  "decided_by_actor_id" text,
  "decided_at" timestamp with time zone,
  "created_by_actor_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "content_angles_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "content_angles_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE set null ON UPDATE no action,
  CONSTRAINT "content_angles_identity_version_id_fk" FOREIGN KEY ("identity_version_id") REFERENCES "public"."artist_identity_versions"("id") ON DELETE set null ON UPDATE no action,
  CONSTRAINT "content_angles_era_identity_id_fk" FOREIGN KEY ("era_identity_id") REFERENCES "public"."era_identities"("id") ON DELETE set null ON UPDATE no action,
  CONSTRAINT "content_angles_status_check" CHECK ("status" IN ('DRAFT','APPROVED','REJECTED','DEFERRED')),
  CONSTRAINT "content_angles_pillar_check" CHECK ("pillar" IN ('PERFORMANCE','ACOUSTIC','STORY','PERSONALITY','BTS','LYRICS','REACTION','COMMUNITY','PHOTO','PROMO','RELEASE','EXPERIMENTAL')),
  CONSTRAINT "content_angles_mode_check" CHECK ("mode" IN ('CAMPAIGN','EVERGREEN','OPPORTUNISTIC','EXPERIMENTAL')),
  CONSTRAINT "content_angles_source_type_check" CHECK ("source_type" IN ('MANUAL','AI_PROPOSAL')),
  CONSTRAINT "content_angles_rejection_reason_check" CHECK ("rejection_reason" IS NULL OR "rejection_reason" IN ('TOO_GENERIC','NOT_ME','ALREADY_DONE','TOO_EXPENSIVE','NOT_FEASIBLE','WRONG_SONG','WRONG_TONE','WRONG_VISUAL','DO_NOT_LIKE_IDEA','OTHER'))
);
--> statement-breakpoint
CREATE INDEX "content_angles_artist_status_idx" ON "content_angles" USING btree ("artist_id", "status");
--> statement-breakpoint
CREATE INDEX "content_angles_artist_song_idx" ON "content_angles" USING btree ("artist_id", "song_id");
--> statement-breakpoint
CREATE TABLE "content_angle_revisions" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "angle_id" uuid NOT NULL,
  "revision_number" integer NOT NULL,
  "revision_type" text NOT NULL,
  "snapshot" jsonb NOT NULL,
  "actor_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "content_angle_revisions_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "content_angle_revisions_angle_id_content_angles_id_fk" FOREIGN KEY ("angle_id") REFERENCES "public"."content_angles"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "content_angle_revisions_revision_type_check" CHECK ("revision_type" IN ('CREATE','EDIT','APPROVE','REJECT','DEFER')),
  CONSTRAINT "content_angle_revisions_angle_revision_uidx" UNIQUE("angle_id", "revision_number")
);
--> statement-breakpoint
CREATE INDEX "content_angle_revisions_artist_idx" ON "content_angle_revisions" USING btree ("artist_id");
--> statement-breakpoint
CREATE TABLE "content_units" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "unit_code" text NOT NULL,
  "angle_id" uuid,
  "song_id" uuid,
  "campaign_id" uuid,
  "identity_version_id" uuid NOT NULL,
  "era_identity_id" uuid,
  "identity_deviation_id" uuid,
  "title" text NOT NULL,
  "idea" text NOT NULL,
  "pillar" text NOT NULL,
  "format" text,
  "platform_targets" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "hook_type" text,
  "hook_text" text,
  "duration_target" text,
  "cta" text,
  "caption" text,
  "keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "edit_brief" text,
  "priority" text,
  "status" text DEFAULT 'APPROVED' NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "archived_at" timestamp with time zone,
  "created_by_actor_id" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "content_units_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "content_units_angle_id_content_angles_id_fk" FOREIGN KEY ("angle_id") REFERENCES "public"."content_angles"("id") ON DELETE set null ON UPDATE no action,
  CONSTRAINT "content_units_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE set null ON UPDATE no action,
  CONSTRAINT "content_units_identity_version_id_fk" FOREIGN KEY ("identity_version_id") REFERENCES "public"."artist_identity_versions"("id") ON DELETE restrict ON UPDATE no action,
  CONSTRAINT "content_units_era_identity_id_fk" FOREIGN KEY ("era_identity_id") REFERENCES "public"."era_identities"("id") ON DELETE set null ON UPDATE no action,
  CONSTRAINT "content_units_status_check" CHECK ("status" IN ('IDEA','APPROVED','SCRIPT_READY','TO_SHOOT','SHOT','EDITING','REVIEW','READY','SCHEDULED','PUBLISHED','MEASURING','ANALYZED','ARCHIVED','BLOCKED','REJECTED','PAUSED')),
  CONSTRAINT "content_units_artist_code_uidx" UNIQUE("artist_id", "unit_code"),
  CONSTRAINT "content_units_angle_uidx" UNIQUE("angle_id")
);
--> statement-breakpoint
CREATE INDEX "content_units_artist_status_idx" ON "content_units" USING btree ("artist_id", "status");
--> statement-breakpoint
CREATE TABLE "content_unit_status_history" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "content_unit_id" uuid NOT NULL,
  "from_status" text,
  "to_status" text NOT NULL,
  "reason" text,
  "actor_id" text,
  "command_id" text NOT NULL,
  "changed_at" timestamp with time zone NOT NULL,
  CONSTRAINT "content_unit_status_history_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "content_unit_status_history_content_unit_id_content_units_id_fk" FOREIGN KEY ("content_unit_id") REFERENCES "public"."content_units"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "content_unit_status_history_from_status_check" CHECK ("from_status" IS NULL OR "from_status" IN ('IDEA','APPROVED','SCRIPT_READY','TO_SHOOT','SHOT','EDITING','REVIEW','READY','SCHEDULED','PUBLISHED','MEASURING','ANALYZED','ARCHIVED','BLOCKED','REJECTED','PAUSED')),
  CONSTRAINT "content_unit_status_history_to_status_check" CHECK ("to_status" IN ('IDEA','APPROVED','SCRIPT_READY','TO_SHOOT','SHOT','EDITING','REVIEW','READY','SCHEDULED','PUBLISHED','MEASURING','ANALYZED','ARCHIVED','BLOCKED','REJECTED','PAUSED'))
);
--> statement-breakpoint
CREATE INDEX "content_unit_status_history_unit_idx" ON "content_unit_status_history" USING btree ("content_unit_id", "changed_at");