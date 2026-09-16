import { boolean, integer, jsonb, text, timestamp, uniqueIndex, uuid, pgTable } from "drizzle-orm/pg-core";

export const artists = pgTable("artists", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  artistName: text("artist_name").notNull(),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const workspaceSettings = pgTable("workspace_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  timezone: text("timezone").notNull(),
  locale: text("locale").notNull().default("en"),
  reportingCurrency: text("reporting_currency").notNull().default("USD"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [uniqueIndex("workspace_settings_artist_uidx").on(table.artistId)]);

export const artistMemberships = pgTable("artist_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  authUserId: text("auth_user_id").notNull(),
  role: text("role").notNull().default("OWNER"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [
  uniqueIndex("artist_memberships_auth_user_uidx").on(table.authUserId),
  uniqueIndex("artist_memberships_artist_user_uidx").on(table.artistId, table.authUserId)
]);

export const outboxEvents = pgTable("outbox_events", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  aggregateType: text("aggregate_type").notNull(),
  aggregateId: uuid("aggregate_id").notNull(),
  aggregateVersion: integer("aggregate_version").notNull(),
  actorType: text("actor_type").notNull(),
  actorId: text("actor_id"),
  correlationId: text("correlation_id").notNull(),
  causationId: text("causation_id"),
  payloadVersion: integer("payload_version").notNull().default(1),
  payload: jsonb("payload").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
  recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true })
});

export const auditEvents = pgTable("audit_events", {
  id: uuid("id").primaryKey(),
  artistId: uuid("artist_id").references(() => artists.id, { onDelete: "set null" }),
  actorType: text("actor_type").notNull(),
  actorId: text("actor_id"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  traceId: text("trace_id").notNull(),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const idempotencyRecords = pgTable("idempotency_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  scope: text("scope").notNull(),
  key: text("key").notNull(),
  commandName: text("command_name").notNull(),
  artistId: uuid("artist_id"),
  status: text("status").notNull(),
  result: jsonb("result"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [uniqueIndex("idempotency_scope_key_uidx").on(table.scope, table.key)]);

export const consumerInbox = pgTable("consumer_inbox", {
  id: uuid("id").primaryKey().defaultRandom(),
  consumer: text("consumer").notNull(),
  eventId: uuid("event_id").notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }).notNull().defaultNow()
}, (table) => [uniqueIndex("consumer_inbox_consumer_event_uidx").on(table.consumer, table.eventId)]);

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  artistId: uuid("artist_id"),
  type: text("type").notNull(),
  status: text("status").notNull().default("QUEUED"),
  payloadVersion: integer("payload_version").notNull().default(1),
  payload: jsonb("payload").notNull().default({}),
  idempotencyKey: text("idempotency_key"),
  attemptCount: integer("attempt_count").notNull().default(0),
  maxAttempts: integer("max_attempts").notNull().default(5),
  nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }),
  lockedAt: timestamp("locked_at", { withTimezone: true }),
  lockedBy: text("locked_by"),
  cancelRequested: boolean("cancel_requested").notNull().default(false),
  correlationId: text("correlation_id").notNull(),
  causationId: text("causation_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  finishedAt: timestamp("finished_at", { withTimezone: true })
}, (table) => [uniqueIndex("jobs_type_idempotency_uidx").on(table.type, table.idempotencyKey)]);
