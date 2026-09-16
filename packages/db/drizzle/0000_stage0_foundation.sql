CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "artists" (
  "id" uuid PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "artist_name" text NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE "workspace_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "artist_id" uuid NOT NULL REFERENCES "artists"("id") ON DELETE CASCADE,
  "timezone" text NOT NULL,
  "locale" text DEFAULT 'en' NOT NULL,
  "reporting_currency" text DEFAULT 'USD' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "workspace_settings_artist_uidx" ON "workspace_settings" ("artist_id");

CREATE TABLE "outbox_events" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL REFERENCES "artists"("id") ON DELETE CASCADE,
  "event_type" text NOT NULL,
  "aggregate_type" text NOT NULL,
  "aggregate_id" uuid NOT NULL,
  "aggregate_version" integer NOT NULL,
  "actor_type" text NOT NULL,
  "actor_id" text,
  "correlation_id" text NOT NULL,
  "causation_id" text,
  "payload_version" integer DEFAULT 1 NOT NULL,
  "payload" jsonb NOT NULL,
  "occurred_at" timestamptz NOT NULL,
  "recorded_at" timestamptz DEFAULT now() NOT NULL,
  "published_at" timestamptz
);

CREATE TABLE "audit_events" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid REFERENCES "artists"("id") ON DELETE SET NULL,
  "actor_type" text NOT NULL,
  "actor_id" text,
  "action" text NOT NULL,
  "entity_type" text NOT NULL,
  "entity_id" text NOT NULL,
  "trace_id" text NOT NULL,
  "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE "idempotency_records" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "scope" text NOT NULL,
  "key" text NOT NULL,
  "command_name" text NOT NULL,
  "artist_id" uuid,
  "status" text NOT NULL,
  "result" jsonb,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "idempotency_scope_key_uidx" ON "idempotency_records" ("scope", "key");

CREATE TABLE "consumer_inbox" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "consumer" text NOT NULL,
  "event_id" uuid NOT NULL,
  "processed_at" timestamptz DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "consumer_inbox_consumer_event_uidx" ON "consumer_inbox" ("consumer", "event_id");

CREATE TABLE "jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "artist_id" uuid,
  "type" text NOT NULL,
  "status" text DEFAULT 'QUEUED' NOT NULL,
  "payload_version" integer DEFAULT 1 NOT NULL,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "idempotency_key" text,
  "attempt_count" integer DEFAULT 0 NOT NULL,
  "max_attempts" integer DEFAULT 5 NOT NULL,
  "next_attempt_at" timestamptz,
  "locked_at" timestamptz,
  "locked_by" text,
  "cancel_requested" boolean DEFAULT false NOT NULL,
  "correlation_id" text NOT NULL,
  "causation_id" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "started_at" timestamptz,
  "finished_at" timestamptz
);
