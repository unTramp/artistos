import { index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { WeeklyReviewSectionInput } from "@artist-os/core";
import { artists } from "./schema";

export const weeklyReviews = pgTable("weekly_reviews", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
  periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
  generatedAt: timestamp("generated_at", { withTimezone: true }).notNull(),
  configurationVersion: text("configuration_version").notNull(),
  sourceSnapshotIds: jsonb("source_snapshot_ids").$type<string[]>().notNull().default([]),
  insightIds: jsonb("insight_ids").$type<string[]>().notNull().default([]),
  sections: jsonb("sections").$type<WeeklyReviewSectionInput[]>().notNull().default([]),
  version: integer("version").notNull().default(1),
  createdByActorId: text("created_by_actor_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index("weekly_reviews_artist_period_idx").on(table.artistId, table.periodEnd, table.generatedAt),
  index("weekly_reviews_artist_generated_idx").on(table.artistId, table.generatedAt)
]);
