import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import {
  CompletePlanningObjectiveService,
  CreatePlanningObjectiveService,
  type CommandContext
} from "@artist-os/core";
import { createDatabase, type Stage0Database } from "./runtime";
import { artists } from "./schema";
import { PgPlanningObjectiveReader } from "./planning-objective-reader";
import { PgPlanningObjectiveWriter } from "./planning-objective-writer";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");

const runtime = createDatabase(databaseUrl);
let db: Stage0Database;
const artistId = crypto.randomUUID();
const userId = `planning-objective-user-${crypto.randomUUID()}`;

const context = (overrides: Partial<CommandContext> = {}): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId,
  actor: { type: "USER", id: userId },
  requestedAt: new Date("2026-09-17T08:00:00.000Z"),
  traceId: `trace-${crypto.randomUUID()}`,
  ...overrides
});

beforeAll(async () => {
  db = runtime.db;
  await db.execute(sql`
    truncate table
      planning_objectives,
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
  await db.insert(artists).values({ id: artistId, name: "Planning Artist", artistName: "Planning Artist" });
});

afterAll(async () => { await runtime.close(); });

describe("PlanningObjective foundation", () => {
  it("persists and reads the current primary objective with evidence", async () => {
    const create = new CreatePlanningObjectiveService(new PgPlanningObjectiveWriter(db));
    const result = await create.execute({
      title: "Prepare Trastevere release",
      statement: "Finish launch-critical work before release week.",
      periodStart: "2026-09-17",
      periodEnd: "2026-09-30",
      scope: "ARTIST",
      priority: "PRIMARY"
    }, context({ idempotencyKey: `objective-${crypto.randomUUID()}` }));
    expect(result.status).toBe("SUCCESS");
    if (result.status !== "SUCCESS") throw new Error("objective missing");

    const current = await new PgPlanningObjectiveReader(db).getCurrentPrimary(artistId, "2026-09-17");
    expect(current).toMatchObject({
      id: result.data.objectiveId,
      title: "Prepare Trastevere release",
      priority: "PRIMARY",
      scope: "ARTIST",
      completedAt: null
    });

    const evidence = await db.execute(sql`
      select
        (select count(*)::int from outbox_events where aggregate_id = ${result.data.objectiveId}::uuid and event_type = 'PlanningObjectiveCreated') as "outboxCount",
        (select count(*)::int from audit_events where entity_id = ${result.data.objectiveId} and action = 'PLANNING_OBJECTIVE_CREATED') as "auditCount"
    `);
    expect(evidence.rows[0]).toMatchObject({ outboxCount: 1, auditCount: 1 });
  });

  it("rejects an overlapping active PRIMARY objective but allows SECONDARY", async () => {
    const create = new CreatePlanningObjectiveService(new PgPlanningObjectiveWriter(db));
    const overlapping = await create.execute({
      title: "Competing primary",
      statement: "Should conflict with current primary.",
      periodStart: "2026-09-20",
      periodEnd: "2026-09-25",
      scope: "ARTIST",
      priority: "PRIMARY"
    }, context());
    expect(overlapping).toMatchObject({ status: "CONFLICT", code: "PLANNING_OBJECTIVE_PRIMARY_OVERLAP" });

    const secondary = await create.execute({
      title: "Evergreen maintenance",
      statement: "Keep one evergreen thread alive while release work remains primary.",
      periodStart: "2026-09-20",
      periodEnd: "2026-09-25",
      scope: "EVERGREEN",
      priority: "SECONDARY"
    }, context());
    expect(secondary.status).toBe("SUCCESS");
  });

  it("keeps completion human-controlled and removes completed objective from current focus", async () => {
    const reader = new PgPlanningObjectiveReader(db);
    const current = await reader.getCurrentPrimary(artistId, "2026-09-17");
    if (!current) throw new Error("current objective missing");

    const result = await new CompletePlanningObjectiveService(new PgPlanningObjectiveWriter(db)).execute(
      { objectiveId: current.id },
      context({ expectedVersion: current.version, requestedAt: new Date("2026-09-18T10:00:00.000Z") })
    );
    expect(result).toMatchObject({ status: "SUCCESS", data: { version: current.version + 1 } });
    expect(await reader.getCurrentPrimary(artistId, "2026-09-18")).toBeNull();
  });
});
