CREATE TABLE IF NOT EXISTS "decisions" (
  "id" uuid PRIMARY KEY,
  "artist_id" uuid NOT NULL REFERENCES "artists"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "decision" text NOT NULL,
  "reason" text NOT NULL,
  "evidence_ids" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "experiment_ids" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "references" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "scope" text NOT NULL,
  "decision_key" text,
  "supersedes_decision_id" uuid,
  "review_at" timestamptz,
  "status" text NOT NULL DEFAULT 'ACTIVE',
  "version" integer NOT NULL DEFAULT 1,
  "created_by_actor_id" text,
  "updated_by_actor_id" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "decisions_status_check" CHECK ("status" IN ('ACTIVE','UNDER_REVIEW','REVERSED','EXPIRED'))
);

CREATE INDEX IF NOT EXISTS "decisions_artist_status_idx"
  ON "decisions" ("artist_id", "status", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "decisions_artist_review_idx"
  ON "decisions" ("artist_id", "review_at")
  WHERE "status" IN ('ACTIVE','UNDER_REVIEW') AND "review_at" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "decisions_artist_key_scope_idx"
  ON "decisions" ("artist_id", "decision_key", "scope", "status")
  WHERE "decision_key" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "decisions_supersedes_idx"
  ON "decisions" ("supersedes_decision_id")
  WHERE "supersedes_decision_id" IS NOT NULL;

CREATE TABLE IF NOT EXISTS "decision_state_history" (
  "id" uuid PRIMARY KEY,
  "artist_id" uuid NOT NULL REFERENCES "artists"("id") ON DELETE CASCADE,
  "decision_id" uuid NOT NULL REFERENCES "decisions"("id") ON DELETE CASCADE,
  "from_status" text,
  "to_status" text NOT NULL,
  "rationale" text,
  "actor_type" text NOT NULL,
  "actor_id" text,
  "trace_id" text NOT NULL,
  "changed_at" timestamptz NOT NULL,
  CONSTRAINT "decision_state_history_from_status_check" CHECK ("from_status" IS NULL OR "from_status" IN ('ACTIVE','UNDER_REVIEW','REVERSED','EXPIRED')),
  CONSTRAINT "decision_state_history_to_status_check" CHECK ("to_status" IN ('ACTIVE','UNDER_REVIEW','REVERSED','EXPIRED'))
);

CREATE INDEX IF NOT EXISTS "decision_state_history_decision_idx"
  ON "decision_state_history" ("decision_id", "changed_at");
