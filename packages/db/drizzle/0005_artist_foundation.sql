CREATE TABLE "artist_identities" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "active_version_id" uuid,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "artist_identities_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "artist_identities_artist_uidx" UNIQUE("artist_id")
);
--> statement-breakpoint
CREATE TABLE "artist_identity_versions" (
  "id" uuid PRIMARY KEY NOT NULL,
  "identity_id" uuid NOT NULL,
  "artist_id" uuid NOT NULL,
  "version_number" integer NOT NULL,
  "label" text,
  "status" text DEFAULT 'DRAFT' NOT NULL,
  "activated_at" timestamp with time zone,
  "archived_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "artist_identity_versions_identity_id_artist_identities_id_fk" FOREIGN KEY ("identity_id") REFERENCES "public"."artist_identities"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "artist_identity_versions_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "artist_identity_versions_identity_version_uidx" UNIQUE("identity_id", "version_number"),
  CONSTRAINT "artist_identity_versions_status_check" CHECK ("status" IN ('DRAFT','REVIEW','ACTIVE','ARCHIVED'))
);
--> statement-breakpoint
ALTER TABLE "artist_identities" ADD CONSTRAINT "artist_identities_active_version_fk" FOREIGN KEY ("active_version_id") REFERENCES "public"."artist_identity_versions"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "artist_identity_versions_one_active_uidx" ON "artist_identity_versions" USING btree ("identity_id") WHERE "status" = 'ACTIVE';
--> statement-breakpoint
CREATE TABLE "era_identities" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "identity_version_id" uuid NOT NULL,
  "name" text NOT NULL,
  "start_date" date,
  "end_date" date,
  "narrative_chapter" text,
  "visual_overrides" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "new_anchors" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "retired_anchors" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "color_overrides" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "status" text DEFAULT 'DRAFT' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "era_identities_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "era_identities_identity_version_id_fk" FOREIGN KEY ("identity_version_id") REFERENCES "public"."artist_identity_versions"("id") ON DELETE restrict ON UPDATE no action,
  CONSTRAINT "era_identities_status_check" CHECK ("status" IN ('DRAFT','ACTIVE','ENDED','ARCHIVED')),
  CONSTRAINT "era_identities_dates_check" CHECK ("end_date" IS NULL OR "start_date" IS NULL OR "end_date" >= "start_date")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "era_identities_one_active_artist_uidx" ON "era_identities" USING btree ("artist_id") WHERE "status" = 'ACTIVE';
--> statement-breakpoint
CREATE TABLE "songs" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL,
  "title" text NOT NULL,
  "type" text,
  "original_artist" text,
  "is_original" boolean NOT NULL,
  "genre" text,
  "mood" text,
  "language" text,
  "story" text,
  "meaning" text,
  "lyrics_reference" text,
  "isrc" text,
  "platform_links" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "archived_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "songs_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX "songs_artist_title_idx" ON "songs" USING btree ("artist_id", "title");
--> statement-breakpoint
CREATE INDEX "songs_artist_isrc_idx" ON "songs" USING btree ("artist_id", "isrc") WHERE "isrc" IS NOT NULL;
