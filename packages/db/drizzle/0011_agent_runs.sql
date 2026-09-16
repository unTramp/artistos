CREATE TABLE IF NOT EXISTS "agent_runs" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL REFERENCES "artists"("id") ON DELETE CASCADE,
  "workflow" text NOT NULL,
  "agent_type" text NOT NULL,
  "configuration_version_id" text NOT NULL,
  "context_manifest" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "status" text NOT NULL,
  "started_at" timestamptz,
  "finished_at" timestamptz,
  "provider" text,
  "model" text,
  "input_token_count" integer,
  "output_token_count" integer,
  "cost" double precision,
  "latency_ms" integer,
  "tool_call_count" integer NOT NULL DEFAULT 0,
  "result_artifact_ref" uuid,
  "failure_code" text,
  "trace_id" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "agent_runs_status_check" CHECK ("status" IN ('QUEUED','RUNNING','SUCCEEDED','FAILED','CANCELLED','REJECTED_OUTPUT'))
);

CREATE TABLE IF NOT EXISTS "agent_run_artifacts" (
  "id" uuid PRIMARY KEY NOT NULL,
  "artist_id" uuid NOT NULL REFERENCES "artists"("id") ON DELETE CASCADE,
  "agent_run_id" uuid NOT NULL UNIQUE REFERENCES "agent_runs"("id") ON DELETE CASCADE,
  "artifact_type" text NOT NULL,
  "schema_version" integer NOT NULL DEFAULT 1,
  "content" jsonb NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE "agent_runs"
  ADD CONSTRAINT "agent_runs_result_artifact_ref_fk"
  FOREIGN KEY ("result_artifact_ref") REFERENCES "agent_run_artifacts"("id") ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS "agent_runs_artist_created_idx" ON "agent_runs" ("artist_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "agent_runs_workflow_status_idx" ON "agent_runs" ("workflow", "status");
