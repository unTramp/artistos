import { doublePrecision, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { artists } from "./schema";

export const agentRuns = pgTable("agent_runs", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  workflow: text("workflow").notNull(),
  agentType: text("agent_type").notNull(),
  configurationVersionId: text("configuration_version_id").notNull(),
  contextManifest: jsonb("context_manifest").notNull().default({}),
  status: text("status").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  provider: text("provider"),
  model: text("model"),
  inputTokenCount: integer("input_token_count"),
  outputTokenCount: integer("output_token_count"),
  cost: doublePrecision("cost"),
  latencyMs: integer("latency_ms"),
  toolCallCount: integer("tool_call_count").notNull().default(0),
  resultArtifactRef: uuid("result_artifact_ref"),
  failureCode: text("failure_code"),
  traceId: text("trace_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const agentRunArtifacts = pgTable("agent_run_artifacts", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  agentRunId: uuid("agent_run_id").notNull().references(() => agentRuns.id, { onDelete: "cascade" }),
  artifactType: text("artifact_type").notNull(),
  schemaVersion: integer("schema_version").notNull().default(1),
  content: jsonb("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});
