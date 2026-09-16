import { index, integer, text, timestamp, uuid, pgTable } from "drizzle-orm/pg-core";
import { artists } from "./schema";

export const operationalActions = pgTable("operational_actions", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  sourceDomain: text("source_domain").notNull(),
  sourceEntityType: text("source_entity_type").notNull(),
  sourceEntityId: text("source_entity_id").notNull(),
  platform: text("platform"),
  title: text("title").notNull(),
  description: text("description"),
  actionType: text("action_type").notNull(),
  status: text("status").notNull().default("OPEN"),
  priority: text("priority").notNull().default("NORMAL"),
  dueAt: timestamp("due_at", { withTimezone: true }),
  notBefore: timestamp("not_before", { withTimezone: true }),
  executionMode: text("execution_mode").notNull(),
  externalUrl: text("external_url"),
  evidenceRef: text("evidence_ref"),
  stateReason: text("state_reason"),
  version: integer("version").notNull().default(1),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdByActorId: text("created_by_actor_id"),
  updatedByActorId: text("updated_by_actor_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index("operational_actions_artist_status_idx").on(table.artistId, table.status),
  index("operational_actions_artist_due_idx").on(table.artistId, table.dueAt),
  index("operational_actions_source_idx").on(table.artistId, table.sourceDomain, table.sourceEntityType, table.sourceEntityId)
]);
