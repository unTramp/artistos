import { index, integer, jsonb, text, timestamp, uniqueIndex, uuid, pgTable } from "drizzle-orm/pg-core";
import type { ContentExecutionSnapshot } from "@artist-os/core";
import { artistIdentityVersions, artists, eraIdentities } from "./schema";
import { contentUnits } from "./content-factory-schema";

export const contentExecutionRevisions = pgTable("content_execution_revisions", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  contentUnitId: uuid("content_unit_id").notNull().references(() => contentUnits.id, { onDelete: "cascade" }),
  revisionNumber: integer("revision_number").notNull(),
  status: text("status").notNull().default("DRAFT"),
  sourceType: text("source_type").notNull().default("MANUAL"),
  format: text("format").notNull(),
  productionIntent: text("production_intent").notNull(),
  identityVersionId: uuid("identity_version_id").notNull().references(() => artistIdentityVersions.id, { onDelete: "restrict" }),
  eraIdentityId: uuid("era_identity_id").references(() => eraIdentities.id, { onDelete: "set null" }),
  snapshot: jsonb("snapshot").$type<ContentExecutionSnapshot>().notNull(),
  sourceProvenance: jsonb("source_provenance").$type<Record<string, unknown>>().notNull().default({}),
  decisionReason: text("decision_reason"),
  decidedByActorId: text("decided_by_actor_id"),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  createdByActorId: text("created_by_actor_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  uniqueIndex("content_execution_revisions_unit_revision_uidx").on(table.contentUnitId, table.revisionNumber),
  index("content_execution_revisions_artist_status_idx").on(table.artistId, table.status),
  index("content_execution_revisions_unit_status_idx").on(table.contentUnitId, table.status)
]);
