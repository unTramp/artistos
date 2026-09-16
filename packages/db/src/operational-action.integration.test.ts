import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import {
  BlockOperationalActionService,
  CompleteOperationalActionService,
  CreateOperationalActionService,
  ReopenOperationalActionService,
  SkipOperationalActionService,
  StartOperationalActionService,
  type CommandContext
} from "@artist-os/core";
import { createDatabase, type Stage0Database } from "./runtime";
import { artists } from "./schema";
import { PgOperationalActionReader } from "./operational-action-reader";
import { PgOperationalActionWriter } from "./operational-action-writer";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");

const runtime = createDatabase(databaseUrl);
let db: Stage0Database;
const artistId = crypto.randomUUID();
const otherArtistId = crypto.randomUUID();
const userId = `operational-action-user-${crypto.randomUUID()}`;

const context = (overrides: Partial<CommandContext> = {}): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId,
  actor: { type: "USER", id: userId },
  requestedAt: new Date("2026-09-17T00:10:00.000Z"),
  traceId: `trace-${crypto.randomUUID()}`,
  ...overrides
});

beforeAll(async () => {
  db = runtime.db;
  await db.execute(sql`
    truncate table
      operational_actions,
      consumer_inbox,
      outbox_events,
      audit_events,
      idempotency_records,
      jobs,
      artist_memberships,
      workspace_settings,
      artists
    restart identity cascade
  `);
  await db.insert(artists).values([
    { id: artistId, name: "Action Artist", artistName: "Action Artist" },
    { id: otherArtistId, name: "Other Artist", artistName: "Other Artist" }
  ]);
});

afterAll(async () => { await runtime.close(); });

describe("OperationalAction foundation", () => {
  it("creates an idempotent source-linked action and emits evidence", async () => {
    const writer = new PgOperationalActionWriter(db);
    const create = new CreateOperationalActionService(writer);
    const key = `action-${crypto.randomUUID()}`;
    const command = {
      sourceDomain: "DSP",
      sourceEntityType: "EditorialPitch",
      sourceEntityId: "pitch-123",
      platform: "SPOTIFY",
      title: "Submit Spotify editorial pitch",
      description: "Complete the provider-native pitch before the deadline.",
      actionType: "SUBMIT_EDITORIAL_PITCH",
      priority: "HIGH" as const,
      dueAt: "2026-09-18T12:00:00.000Z",
      executionMode: "EXTERNAL" as const,
      externalUrl: "https://artists.spotify.com/"
    };

    const first = await create.execute(command, context({ idempotencyKey: key }));
    const replay = await create.execute(command, context({ idempotencyKey: key }));
    expect(first.status).toBe("SUCCESS");
    expect(replay).toEqual(first);
    if (first.status !== "SUCCESS") throw new Error("action missing");

    const persisted = await db.execute(sql`
      select
        oa.status,
        oa.priority,
        oa.source_domain as "sourceDomain",
        oa.source_entity_type as "sourceEntityType",
        oa.source_entity_id as "sourceEntityId",
        (select count(*)::int from outbox_events oe where oe.aggregate_id = oa.id and oe.event_type = 'OperationalActionCreated') as "createdEvents",
        (select count(*)::int from audit_events ae where ae.entity_id = oa.id and ae.action = 'OPERATIONAL_ACTION_CREATED') as "auditEvents"
      from operational_actions oa where oa.id = ${first.data.actionId}::uuid
    `);
    expect(persisted.rows[0]).toMatchObject({
      status: "OPEN",
      priority: "HIGH",
      sourceDomain: "DSP",
      sourceEntityType: "EditorialPitch",
      sourceEntityId: "pitch-123",
      createdEvents: 1,
      auditEvents: 1
    });
  });

  it("preserves lifecycle history through versioned events without mutating source-domain truth", async () => {
    const writer = new PgOperationalActionWriter(db);
    const create = new CreateOperationalActionService(writer);
    const started = new StartOperationalActionService(writer);
    const blocked = new BlockOperationalActionService(writer);
    const reopened = new ReopenOperationalActionService(writer);
    const completed = new CompleteOperationalActionService(writer);

    const action = await create.execute({
      sourceDomain: "CONTENT",
      sourceEntityType: "ContentUnit",
      sourceEntityId: "content-unit-42",
      title: "Shoot approved performance",
      actionType: "SHOOT_CONTENT_UNIT",
      executionMode: "MANUAL_NATIVE"
    }, context());
    expect(action.status).toBe("SUCCESS");
    if (action.status !== "SUCCESS") throw new Error("action missing");

    await expect(started.execute({ actionId: action.data.actionId }, context({ expectedVersion: 1 })))
      .resolves.toMatchObject({ status: "SUCCESS", data: { status: "IN_PROGRESS", version: 2 } });
    await expect(blocked.execute({ actionId: action.data.actionId, reason: "Camera battery unavailable." }, context({ expectedVersion: 2 })))
      .resolves.toMatchObject({ status: "SUCCESS", data: { status: "BLOCKED", version: 3 } });
    await expect(reopened.execute({ actionId: action.data.actionId, reason: "Battery charged." }, context({ expectedVersion: 3 })))
      .resolves.toMatchObject({ status: "SUCCESS", data: { status: "OPEN", version: 4 } });
    await expect(completed.execute({ actionId: action.data.actionId }, context({ expectedVersion: 4 })))
      .resolves.toMatchObject({ status: "SUCCESS", data: { status: "DONE", version: 5 } });

    const row = await db.execute(sql`
      select status, version, completed_at as "completedAt", source_entity_id as "sourceEntityId"
      from operational_actions where id = ${action.data.actionId}::uuid
    `);
    expect(row.rows[0]).toMatchObject({ status: "DONE", version: 5, sourceEntityId: "content-unit-42" });
    expect(row.rows[0]?.completedAt).not.toBeNull();

    const events = await db.execute(sql`
      select event_type as "eventType" from outbox_events
      where aggregate_id = ${action.data.actionId}
      order by aggregate_version
    `);
    expect(events.rows.map((event) => event.eventType)).toEqual([
      "OperationalActionCreated",
      "OperationalActionStarted",
      "OperationalActionBlocked",
      "OperationalActionReopened",
      "OperationalActionCompleted"
    ]);
  });

  it("enforces optimistic concurrency and artist scope", async () => {
    const writer = new PgOperationalActionWriter(db);
    const create = new CreateOperationalActionService(writer);
    const start = new StartOperationalActionService(writer);
    const action = await create.execute({
      sourceDomain: "KNOWLEDGE",
      sourceEntityType: "CandidateKnowledge",
      sourceEntityId: "candidate-1",
      title: "Review knowledge candidate",
      actionType: "REVIEW_KNOWLEDGE",
      executionMode: "MANUAL_NATIVE"
    }, context());
    expect(action.status).toBe("SUCCESS");
    if (action.status !== "SUCCESS") throw new Error("action missing");

    await expect(start.execute({ actionId: action.data.actionId }, context({ expectedVersion: 9 })))
      .resolves.toMatchObject({ status: "CONFLICT", code: "OPERATIONAL_ACTION_VERSION_CONFLICT" });
    await expect(start.execute({ actionId: action.data.actionId }, context({ artistId: otherArtistId })))
      .resolves.toMatchObject({ status: "NOT_FOUND", code: "OPERATIONAL_ACTION_NOT_FOUND" });
  });

  it("keeps skip distinct from done and reader prioritizes active actions", async () => {
    const writer = new PgOperationalActionWriter(db);
    const create = new CreateOperationalActionService(writer);
    const skip = new SkipOperationalActionService(writer);
    const reader = new PgOperationalActionReader(db);

    const low = await create.execute({
      sourceDomain: "IDENTITY", sourceEntityType: "ArtistIdentity", sourceEntityId: "identity-1",
      title: "Review identity note", actionType: "REVIEW_IDENTITY", priority: "LOW", executionMode: "MANUAL_NATIVE"
    }, context());
    const urgent = await create.execute({
      sourceDomain: "DSP", sourceEntityType: "EditorialPitch", sourceEntityId: "pitch-urgent",
      title: "Pitch due today", actionType: "SUBMIT_EDITORIAL_PITCH", priority: "URGENT", executionMode: "EXTERNAL"
    }, context());
    expect(low.status).toBe("SUCCESS");
    expect(urgent.status).toBe("SUCCESS");
    if (low.status !== "SUCCESS" || urgent.status !== "SUCCESS") throw new Error("actions missing");

    await skip.execute({ actionId: low.data.actionId, reason: "Not relevant to the active objective." }, context());
    const active = await reader.listActions(artistId, { statuses: ["OPEN", "IN_PROGRESS", "BLOCKED"] });
    expect(active[0]?.id).toBe(urgent.data.actionId);
    expect(active.some((item) => item.id === low.data.actionId)).toBe(false);
  });
});
