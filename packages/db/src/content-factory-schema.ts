import { index, integer, jsonb, text, timestamp, uniqueIndex, uuid, pgTable } from "drizzle-orm/pg-core";
import { artistIdentityVersions, artists, eraIdentities, songs } from "./schema";

export const contentAngles = pgTable("content_angles", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  songId: uuid("song_id").references(() => songs.id, { onDelete: "set null" }),
  campaignId: uuid("campaign_id"),
  identityVersionId: uuid("identity_version_id").references(() => artistIdentityVersions.id, { onDelete: "set null" }),
  eraIdentityId: uuid("era_identity_id").references(() => eraIdentities.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  idea: text("idea").notNull(),
  pillar: text("pillar").notNull(),
  mode: text("mode").notNull(),
  goal: text("goal").notNull(),
  audience: text("audience").notNull(),
  platformTargets: jsonb("platform_targets").$type<string[]>().notNull().default([]),
  requiredAssets: jsonb("required_assets").$type<string[]>().notNull().default([]),
  learningValue: text("learning_value").notNull(),
  why: text("why").notNull(),
  identityFitRationale: text("identity_fit_rationale").notNull(),
  productionEffort: text("production_effort").notNull(),
  sourceType: text("source_type").notNull().default("MANUAL"),
  sourceProvenance: jsonb("source_provenance").$type<Record<string, unknown>>().notNull().default({}),
  originalSnapshot: jsonb("original_snapshot").$type<Record<string, unknown>>().notNull(),
  status: text("status").notNull().default("DRAFT"),
  version: integer("version").notNull().default(1),
  rejectionReason: text("rejection_reason"),
  decisionNote: text("decision_note"),
  decidedByActorId: text("decided_by_actor_id"),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  createdByActorId: text("created_by_actor_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index("content_angles_artist_status_idx").on(table.artistId, table.status),
  index("content_angles_artist_song_idx").on(table.artistId, table.songId)
]);

export const contentAngleRevisions = pgTable("content_angle_revisions", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  angleId: uuid("angle_id").notNull().references(() => contentAngles.id, { onDelete: "cascade" }),
  revisionNumber: integer("revision_number").notNull(),
  revisionType: text("revision_type").notNull(),
  snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
  actorId: text("actor_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  uniqueIndex("content_angle_revisions_angle_revision_uidx").on(table.angleId, table.revisionNumber),
  index("content_angle_revisions_artist_idx").on(table.artistId)
]);

export const contentUnits = pgTable("content_units", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  unitCode: text("unit_code").notNull(),
  angleId: uuid("angle_id").references(() => contentAngles.id, { onDelete: "set null" }),
  songId: uuid("song_id").references(() => songs.id, { onDelete: "set null" }),
  campaignId: uuid("campaign_id"),
  identityVersionId: uuid("identity_version_id").notNull().references(() => artistIdentityVersions.id, { onDelete: "restrict" }),
  eraIdentityId: uuid("era_identity_id").references(() => eraIdentities.id, { onDelete: "set null" }),
  identityDeviationId: uuid("identity_deviation_id"),
  title: text("title").notNull(),
  idea: text("idea").notNull(),
  pillar: text("pillar").notNull(),
  format: text("format"),
  platformTargets: jsonb("platform_targets").$type<string[]>().notNull().default([]),
  hookType: text("hook_type"),
  hookText: text("hook_text"),
  durationTarget: text("duration_target"),
  cta: text("cta"),
  caption: text("caption"),
  keywords: jsonb("keywords").$type<string[]>().notNull().default([]),
  editBrief: text("edit_brief"),
  priority: text("priority"),
  status: text("status").notNull().default("APPROVED"),
  version: integer("version").notNull().default(1),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdByActorId: text("created_by_actor_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  uniqueIndex("content_units_artist_code_uidx").on(table.artistId, table.unitCode),
  uniqueIndex("content_units_angle_uidx").on(table.angleId),
  index("content_units_artist_status_idx").on(table.artistId, table.status)
]);

export const contentUnitStatusHistory = pgTable("content_unit_status_history", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  contentUnitId: uuid("content_unit_id").notNull().references(() => contentUnits.id, { onDelete: "cascade" }),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  reason: text("reason"),
  actorId: text("actor_id"),
  commandId: text("command_id").notNull(),
  changedAt: timestamp("changed_at", { withTimezone: true }).notNull()
}, (table) => [
  index("content_unit_status_history_unit_idx").on(table.contentUnitId, table.changedAt)
]);
