import { index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { LearningReferenceInput } from "@artist-os/core";
import { artists } from "./schema";

export const learnings = pgTable("learnings", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  statement: text("statement").notNull(),
  scope: text("scope").notNull(),
  confidence: text("confidence").notNull(),
  confidenceRationale: text("confidence_rationale").notNull(),
  references: jsonb("references").$type<LearningReferenceInput[]>().notNull().default([]),
  freshUntil: timestamp("fresh_until", { withTimezone: true }),
  status: text("status").notNull().default("CANDIDATE"),
  version: integer("version").notNull().default(1),
  createdByActorId: text("created_by_actor_id"),
  updatedByActorId: text("updated_by_actor_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index("learnings_artist_status_idx").on(table.artistId, table.status, table.updatedAt),
  index("learnings_artist_scope_idx").on(table.artistId, table.scope),
  index("learnings_artist_fresh_idx").on(table.artistId, table.freshUntil)
]);

export const learningStateHistory = pgTable("learning_state_history", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  learningId: uuid("learning_id").notNull().references(() => learnings.id, { onDelete: "cascade" }),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  rationale: text("rationale"),
  actorType: text("actor_type").notNull(),
  actorId: text("actor_id"),
  traceId: text("trace_id").notNull(),
  changedAt: timestamp("changed_at", { withTimezone: true }).notNull()
}, (table) => [index("learning_state_history_learning_idx").on(table.learningId, table.changedAt)]);
