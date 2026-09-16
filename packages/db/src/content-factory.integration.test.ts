import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import {
  ApproveContentAngleService,
  ChangeContentUnitStatusService,
  CreateContentAngleService,
  CreateContentUnitFromAngleService,
  DeferContentAngleService,
  EditContentAngleService,
  RejectContentAngleService,
  type CommandContext,
  type CreateContentAngleCommand
} from "@artist-os/core";
import { createDatabase, type Stage0Database } from "./runtime";
import { PgContentFactoryWriter } from "./content-factory-writer";
import { contentExecutionRevisions } from "./content-execution-schema";
import { artistIdentities, artistIdentityVersions, artists, eraIdentities, songs } from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");

const runtime = createDatabase(databaseUrl);
let db: Stage0Database;
const artistId = crypto.randomUUID();
const identityId = crypto.randomUUID();
const identityVersionId = crypto.randomUUID();
const eraId = crypto.randomUUID();
const songId = crypto.randomUUID();
const userId = `content-factory-user-${crypto.randomUUID()}`;

const context = (overrides: Partial<CommandContext> = {}): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId,
  actor: { type: "USER", id: userId },
  requestedAt: new Date("2026-09-16T15:00:00.000Z"),
  traceId: `trace-${crypto.randomUUID()}`,
  ...overrides
});

const angleCommand = (title: string): CreateContentAngleCommand => ({
  songId,
  title,
  idea: "A direct performance opening with one personal line before the song enters.",
  pillar: "STORY",
  mode: "EVERGREEN",
  goal: "Make the song emotionally legible without over-explaining it.",
  audience: "Listeners discovering the artist through intimate performance content.",
  platformTargets: ["INSTAGRAM_REELS", "TIKTOK"],
  requiredAssets: ["performance take", "clean vocal audio"],
  learningValue: "Learn whether a brief personal setup improves qualified engagement around the song.",
  why: "The concept connects an authentic artist statement to the song before execution details are chosen.",
  identityFitRationale: "Direct, emotionally honest, non-hype communication fits the active identity.",
  productionEffort: "LOW — one room, one camera, one performance setup."
});

beforeAll(async () => {
  db = runtime.db;
  await db.execute(sql`
    truncate table
      content_execution_revisions,
      content_unit_status_history,
      content_units,
      content_angle_revisions,
      content_angles,
      era_identities,
      artist_identity_versions,
      artist_identities,
      songs,
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
  await db.insert(artists).values({ id: artistId, name: "Content Factory Artist", artistName: "Content Factory Artist" });
  await db.insert(artistIdentities).values({ id: identityId, artistId, activeVersionId: null });
  await db.insert(artistIdentityVersions).values({ id: identityVersionId, identityId, artistId, versionNumber: 1, status: "ACTIVE" });
  await db.update(artistIdentities).set({ activeVersionId: identityVersionId }).where(sql`${artistIdentities.id} = ${identityId}`);
  await db.insert(eraIdentities).values({ id: eraId, artistId, identityVersionId, name: "Factory Era", status: "ACTIVE" });
  await db.insert(songs).values({ id: songId, artistId, title: "Factory Song", isOriginal: true });
});

afterAll(async () => { await runtime.close(); });

describe("Content Factory manual-first vertical", () => {
  it("captures Identity/Era context and preserves Angle revision history", async () => {
    const writer = new PgContentFactoryWriter(db);
    const create = new CreateContentAngleService(writer);
    const edit = new EditContentAngleService(writer);

    const created = await create.execute(angleCommand("Performance confession"), context());
    expect(created.status).toBe("SUCCESS");
    if (created.status !== "SUCCESS") throw new Error("content angle missing");
    expect(created.data).toMatchObject({ status: "DRAFT", version: 1, identityVersionId, eraIdentityId: eraId });

    const edited = await edit.execute({ angleId: created.data.angleId, title: "Performance confession — refined", productionEffort: "MEDIUM — add one lighting variation." }, context());
    expect(edited).toMatchObject({ status: "SUCCESS", data: { status: "DRAFT", version: 2 } });

    const rows = await db.execute(sql`
      select
        ca.title,
        ca.original_snapshot ->> 'title' as "originalTitle",
        count(car.id)::int as revisions
      from content_angles ca
      join content_angle_revisions car on car.angle_id = ca.id
      where ca.id = ${created.data.angleId}::uuid
      group by ca.id
    `);
    expect(rows.rows[0]).toMatchObject({
      title: "Performance confession — refined",
      originalTitle: "Performance confession",
      revisions: 2
    });
  });

  it("requires explicit approval before a separate Angle to ContentUnit conversion", async () => {
    const writer = new PgContentFactoryWriter(db);
    const create = new CreateContentAngleService(writer);
    const approve = new ApproveContentAngleService(writer);
    const createUnit = new CreateContentUnitFromAngleService(writer);
    const idempotencyKey = `unit-${crypto.randomUUID()}`;

    const draft = await create.execute(angleCommand("Approved story angle"), context());
    expect(draft.status).toBe("SUCCESS");
    if (draft.status !== "SUCCESS") throw new Error("draft missing");

    const blocked = await createUnit.execute({ angleId: draft.data.angleId }, context());
    expect(blocked).toMatchObject({ status: "CONFLICT", code: "ANGLE_NOT_APPROVED" });

    const approved = await approve.execute({ angleId: draft.data.angleId }, context());
    expect(approved).toMatchObject({ status: "SUCCESS", data: { status: "APPROVED" } });

    const beforeConversion = await db.execute(sql`select count(*)::int as count from content_units where angle_id = ${draft.data.angleId}::uuid`);
    expect(beforeConversion.rows[0]).toMatchObject({ count: 0 });

    const first = await createUnit.execute({ angleId: draft.data.angleId, priority: "HIGH" }, context({ idempotencyKey }));
    const replay = await createUnit.execute({ angleId: draft.data.angleId, priority: "LOW" }, context({ idempotencyKey }));
    expect(first.status).toBe("SUCCESS");
    expect(replay.status).toBe("SUCCESS");
    if (first.status !== "SUCCESS" || replay.status !== "SUCCESS") throw new Error("unit missing");
    expect(replay.data).toEqual(first.data);

    const persisted = await db.execute(sql`
      select
        cu.unit_code as "unitCode",
        cu.status,
        cu.identity_version_id as "identityVersionId",
        cu.era_identity_id as "eraIdentityId",
        (select count(*)::int from content_unit_status_history h where h.content_unit_id = cu.id) as "historyCount",
        (select count(*)::int from outbox_events oe where oe.aggregate_id = cu.id and oe.event_type = 'ContentUnitCreated') as "createdEvents"
      from content_units cu where cu.id = ${first.data.contentUnitId}::uuid
    `);
    expect(persisted.rows[0]).toMatchObject({
      unitCode: "FACTORY-SONG-STORY-001",
      status: "APPROVED",
      identityVersionId,
      eraIdentityId: eraId,
      historyCount: 1,
      createdEvents: 1
    });
  });

  it("keeps defer and reject as distinct review decisions with rejection taxonomy", async () => {
    const writer = new PgContentFactoryWriter(db);
    const create = new CreateContentAngleService(writer);
    const defer = new DeferContentAngleService(writer);
    const reject = new RejectContentAngleService(writer);

    const deferredDraft = await create.execute(angleCommand("Maybe later"), context());
    expect(deferredDraft.status).toBe("SUCCESS");
    if (deferredDraft.status !== "SUCCESS") throw new Error("deferred draft missing");
    await expect(defer.execute({ angleId: deferredDraft.data.angleId, note: "Keep for a quieter evergreen week." }, context()))
      .resolves.toMatchObject({ status: "SUCCESS", data: { status: "DEFERRED" } });

    const rejectedDraft = await create.execute(angleCommand("Wrong visual concept"), context());
    expect(rejectedDraft.status).toBe("SUCCESS");
    if (rejectedDraft.status !== "SUCCESS") throw new Error("rejected draft missing");
    await expect(reject.execute({ angleId: rejectedDraft.data.angleId, reason: "WRONG_VISUAL", note: "Too polished for the active era." }, context()))
      .resolves.toMatchObject({ status: "SUCCESS", data: { status: "REJECTED" } });

    const decisions = await db.execute(sql`
      select status, rejection_reason as "rejectionReason", decision_note as "decisionNote"
      from content_angles where id in (${deferredDraft.data.angleId}::uuid, ${rejectedDraft.data.angleId}::uuid)
      order by title
    `);
    expect(decisions.rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ status: "DEFERRED", rejectionReason: null, decisionNote: "Keep for a quieter evergreen week." }),
      expect.objectContaining({ status: "REJECTED", rejectionReason: "WRONG_VISUAL", decisionNote: "Too polished for the active era." })
    ]));
  });

  it("enforces execution readiness before SCRIPT_READY and still blocks publication jumps", async () => {
    const writer = new PgContentFactoryWriter(db);
    const create = new CreateContentAngleService(writer);
    const approve = new ApproveContentAngleService(writer);
    const createUnit = new CreateContentUnitFromAngleService(writer);
    const changeStatus = new ChangeContentUnitStatusService(writer);

    const angle = await create.execute(angleCommand("State machine angle"), context());
    expect(angle.status).toBe("SUCCESS");
    if (angle.status !== "SUCCESS") throw new Error("state angle missing");
    await approve.execute({ angleId: angle.data.angleId }, context());
    const unit = await createUnit.execute({ angleId: angle.data.angleId }, context());
    expect(unit.status).toBe("SUCCESS");
    if (unit.status !== "SUCCESS") throw new Error("state unit missing");

    await expect(changeStatus.execute({ contentUnitId: unit.data.contentUnitId, status: "PUBLISHED" }, context()))
      .resolves.toMatchObject({ status: "CONFLICT", code: "CONTENT_UNIT_INVALID_TRANSITION" });

    await expect(db.execute(sql`update content_units set status = 'SCRIPT_READY' where id = ${unit.data.contentUnitId}::uuid`))
      .rejects.toThrow(/CONTENT_UNIT_EXECUTION_REQUIRED/);

    await db.insert(contentExecutionRevisions).values({
      id: crypto.randomUUID(),
      artistId,
      contentUnitId: unit.data.contentUnitId,
      revisionNumber: 1,
      status: "APPROVED",
      sourceType: "MANUAL",
      format: "VERTICAL_PERFORMANCE",
      productionIntent: "AUTHENTIC",
      identityVersionId,
      eraIdentityId: eraId,
      snapshot: {
        schemaVersion: 1,
        format: "VERTICAL_PERFORMANCE",
        productionIntent: "AUTHENTIC",
        structure: "OPEN → PERFORMANCE",
        scriptOrPerformanceConcept: "One direct line, then performance.",
        shotList: [],
        editBrief: "Keep the take natural.",
        platformNotes: [],
        feasibilityNotes: "Existing setup is sufficient.",
        rightsStatus: "UNKNOWN"
      },
      sourceProvenance: { test: true }
    });

    await expect(changeStatus.execute({ contentUnitId: unit.data.contentUnitId, status: "SCRIPT_READY" }, context()))
      .resolves.toMatchObject({ status: "SUCCESS", data: { status: "SCRIPT_READY" } });
  });
});
