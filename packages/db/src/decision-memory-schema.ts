import { index, integer, jsonb, text, timestamp, uuid, pgTable } from "drizzle-orm/pg-core";
import { artists } from "./schema";
import type { DecisionReferenceInput } from "@artist-os/core";

export const decisions = pgTable("decisions", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  decision: text("decision").notNull(),
  reason: text("reason").notNull(),
  evidenceIds: jsonb("evidence_ids").$type<string[]>().notNull().default([]),
  experimentIds: jsonb("experiment_ids").$type<string[]>().notNull().default([]),
  references: jsonb("references").$type<DecisionReferenceInput[]>().notNull().default([]),
  scope: text("scope").notNull(),
  decisionKey: text("decision_key"),
  supersedesDecisionId: uuid("supersedes_decision_id"),
  reviewAt: timestamp("review_at", { withTimezone: true }),
  status: text("status").notNull().default("ACTIVE"),
  version: integer("version").notNull().default(1),
  createdByActorId: text("created_by_actor_id"),
  updatedByActorId: text("updated_by_actor_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index("decisions_artist_status_idx").on(table.artistId, table.status, table.createdAt),
  index("decisions_artist_review_idx").on(table.artistId, table.reviewAt),
  index("decisions_artist_key_scope_idx").on(table.artistId, table.decisionKey, table.scope, table.status),
  index("decisions_supersedes_idx").on(table.supersedesDecisionId)
]);

export const decisionStateHistory = pgTable("decision_state_history", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  decisionId: uuid("decision_id").notNull().references(() => decisions.id, { onDelete: "cascade" }),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  rationale: text("rationale"),
  actorType: text("actor_type").notNull(),
  actorId: text("actor_id"),
  traceId: text("trace_id").notNull(),
  changedAt: timestamp("changed_at", { withTimezone: true }).notNull()
}, (table) => [index("decision_state_history_decision_idx").on(table.decisionId, table.changedAt)]);
