import { date, integer, jsonb, text, timestamp, uuid, pgTable, index } from "drizzle-orm/pg-core";
import { artists } from "./schema";

export const planningObjectives = pgTable("planning_objectives", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  statement: text("statement").notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  scope: text("scope").notNull(),
  campaignId: uuid("campaign_id"),
  releaseId: uuid("release_id"),
  priority: text("priority").notNull(),
  status: text("status").notNull().default("ACTIVE"),
  successCriteria: jsonb("success_criteria").$type<string[]>().notNull().default([]),
  version: integer("version").notNull().default(1),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdByActorId: text("created_by_actor_id"),
  updatedByActorId: text("updated_by_actor_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index("planning_objectives_artist_period_idx").on(table.artistId, table.periodStart, table.periodEnd),
  index("planning_objectives_artist_priority_idx").on(table.artistId, table.priority, table.status),
  index("planning_objectives_artist_status_idx").on(table.artistId, table.status, table.updatedAt)
]);
