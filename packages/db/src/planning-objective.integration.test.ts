import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import {
  ActivatePlanningObjectiveService,
  ArchivePlanningObjectiveService,
  CancelPlanningObjectiveService,
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

describe("PlanningObjective canonical contract", () => {
  it("persists ACTIVE status and success criteria for the current primary objective", async () => {
    const create = new CreatePlanningObjectiveService(new PgPlanningObjectiveWriter(db));
    const result = await create.execute({
      title: "Prepare Trastevere release",
      statement: "Finish launch-critical work before release week.",
      periodStart: "2026-09-17",
      periodEnd: "2026-09-30",
      scope: "ARTIST",
      priority: "PRIMARY",
      successCriteria: ["Execution package approved", "Release blockers resolved"]
    }, context({ idempotencyKey: `objective-${crypto.randomUUID()}` }));
    expect(result.status).toBe("SUCCESS");
    if (result.status !== "SUCCESS") throw new Error("objective missing");

    const current = await new PgPlanningObjectiveReader(db).getCurrentPrimary(artistId, "2026-09-17");
    expect(current).toMatchObject({
      id: result.data.objectiveId,
      title: "Prepare Trastevere release",
      priority: "PRIMARY",
      scope: "ARTIST",
      status: "ACTIVE",
      successCriteria: ["Execution package approved", "Release blockers resolved"],
      completedAt: null
    });

    const evidence = await db.execute(sql`
      select
        (select count(*)::int from outbox_events where aggregate_id = ${result.data.objectiveId}::uuid and event_type = 'PlanningObjectiveCreated') as "outboxCount",
        (select count(*)::int from audit_events where entity_id = ${result.data.objectiveId} and action = 'PLANNING_OBJECTIVE_CREATED') as "auditCount"
    `);
    expect(evidence.rows[0]).toMatchObject({ outboxCount: 1, auditCount: 1 });
  });

  it("rejects an overlapping ACTIVE PRIMARY objective but allows SECONDARY", async () => {
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

  it("allows DRAFT without stealing current focus and enforces lifecycle on activation", async () => {
    const writer = new PgPlanningObjectiveWriter(db);
    const create = new CreatePlanningObjectiveService(writer);
    const draft = await create.execute({
      title: "Draft future primary",
      statement: "A candidate focus that is not active yet.",
      periodStart: "2026-09-20",
      periodEnd: "2026-09-25",
      scope: "ARTIST",
      priority: "PRIMARY",
      status: "DRAFT"
    }, context());
    expect(draft).toMatchObject({ status: "SUCCESS", data: { status: "DRAFT" } });
    if (draft.status !== "SUCCESS") throw new Error("draft missing");

    const activateBlocked = await new ActivatePlanningObjectiveService(writer).execute(
      { objectiveId: draft.data.objectiveId },
      context({ expectedVersion: draft.data.version })
    );
    expect(activateBlocked).toMatchObject({ status: "CONFLICT", code: "PLANNING_OBJECTIVE_PRIMARY_OVERLAP" });

    const cancelled = await new CancelPlanningObjectiveService(writer).execute(
      { objectiveId: draft.data.objectiveId },
      context({ expectedVersion: draft.data.version })
    );
    expect(cancelled).toMatchObject({ status: "SUCCESS", data: { status: "CANCELLED" } });
    if (cancelled.status !== "SUCCESS") throw new Error("cancel failed");

    const archived = await new ArchivePlanningObjectiveService(writer).execute(
      { objectiveId: draft.data.objectiveId },
      context({ expectedVersion: cancelled.data.version })
    );
    expect(archived).toMatchObject({ status: "SUCCESS", data: { status: "ARCHIVED" } });
  });

  it("fails closed for target scopes whose canonical owner cannot yet be verified", async () => {
    const create = new CreatePlanningObjectiveService(new PgPlanningObjectiveWriter(db));
    const release = await create.execute({
      title: "Release target",
      statement: "Must not persist a dangling release reference.",
      periodStart: "2026-10-01",
      periodEnd: "2026-10-15",
      scope: "RELEASE",
      releaseId: crypto.randomUUID(),
      priority: "PRIMARY"
    }, context());
    expect(release).toMatchObject({ status: "BLOCKED", code: "PLANNING_OBJECTIVE_TARGET_UNAVAILABLE" });
  });

  it("keeps completion human-controlled and removes COMPLETED objective from current focus", async () => {
    const reader = new PgPlanningObjectiveReader(db);
    const current = await reader.getCurrentPrimary(artistId, "2026-09-17");
    if (!current) throw new Error("current objective missing");

    const result = await new CompletePlanningObjectiveService(new PgPlanningObjectiveWriter(db)).execute(
      { objectiveId: current.id },
      context({ expectedVersion: current.version, requestedAt: new Date("2026-09-18T10:00:00.000Z") })
    );
    expect(result).toMatchObject({ status: "SUCCESS", data: { status: "COMPLETED", version: current.version + 1 } });
    expect(await reader.getCurrentPrimary(artistId, "2026-09-18")).toBeNull();
  });
});
