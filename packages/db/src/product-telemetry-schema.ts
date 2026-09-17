import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { artists } from "./schema";

export const productTelemetryEvents = pgTable("product_telemetry_events", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  eventName: text("event_name").notNull(),
  surface: text("surface").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  actorId: text("actor_id"),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  index("product_telemetry_artist_event_idx").on(table.artistId, table.eventName, table.occurredAt),
  index("product_telemetry_artist_surface_idx").on(table.artistId, table.surface, table.occurredAt)
]);
