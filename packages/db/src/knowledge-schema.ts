import { boolean, index, integer, jsonb, text, timestamp, uniqueIndex, uuid, pgTable } from "drizzle-orm/pg-core";
import { artists } from "./schema";

export const toneCorpusItems = pgTable("tone_corpus_items", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  textContent: text("text_content").notNull(),
  label: text("label").notNull(),
  sourceType: text("source_type").notNull(),
  sourceReference: text("source_reference"),
  language: text("language"),
  isPrivate: boolean("is_private").notNull().default(false),
  createdByActorId: text("created_by_actor_id"),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index("tone_corpus_items_artist_label_idx").on(table.artistId, table.label)
]);

export const candidateKnowledge = pgTable("candidate_knowledge", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  sourceType: text("source_type").notNull(),
  sourceId: text("source_id").notNull(),
  content: text("content").notNull(),
  destination: text("destination").notNull(),
  destinationTargetId: text("destination_target_id"),
  status: text("status").notNull().default("PENDING"),
  confidenceMetadata: jsonb("confidence_metadata").notNull().default({}),
  promotedEntityType: text("promoted_entity_type"),
  promotedEntityId: text("promoted_entity_id"),
  mergedIntoCandidateId: uuid("merged_into_candidate_id"),
  resolutionReason: text("resolution_reason"),
  resolvedByActorId: text("resolved_by_actor_id"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index("candidate_knowledge_artist_status_idx").on(table.artistId, table.status),
  index("candidate_knowledge_artist_destination_idx").on(table.artistId, table.destination)
]);

export const artistBrainKnowledgeItems = pgTable("artist_brain_knowledge_items", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  sourceCandidateId: uuid("source_candidate_id").notNull(),
  sourceType: text("source_type").notNull(),
  sourceId: text("source_id").notNull(),
  createdByActorId: text("created_by_actor_id"),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  uniqueIndex("artist_brain_knowledge_source_candidate_uidx").on(table.sourceCandidateId),
  index("artist_brain_knowledge_artist_idx").on(table.artistId)
]);

export const artistBrainSnapshots = pgTable("artist_brain_snapshots", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  payload: jsonb("payload").notNull(),
  sourceRefs: jsonb("source_refs").notNull().default([]),
  builtByActorId: text("built_by_actor_id"),
  builtAt: timestamp("built_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  uniqueIndex("artist_brain_snapshots_artist_version_uidx").on(table.artistId, table.versionNumber)
]);
