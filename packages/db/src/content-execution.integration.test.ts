import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import {
  ApproveContentExecutionRevisionService,
  CreateContentExecutionRevisionService,
  RejectContentExecutionRevisionService,
  type CommandContext,
  type CreateContentExecutionRevisionCommand
} from "@artist-os/core";
import { createDatabase, type Stage0Database } from "./runtime";
import { PgContentExecutionWriter } from "./content-execution-writer";
import { PgContentExecutionReader } from "./content-execution-reader";
import { artistIdentities, artistIdentityVersions, artists, eraIdentities, songs } from "./schema";
import { contentAngles, contentUnits } from "./content-factory-schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");

const runtime = createDatabase(databaseUrl);
let db: Stage0Database;
const artistId = crypto.randomUUID();
const identityId = crypto.randomUUID();
const identityVersionId = crypto.randomUUID();
const eraId = crypto.randomUUID();
const songId = crypto.randomUUID();
const angleId = crypto.randomUUID();
const contentUnitId = crypto.randomUUID();
const userId = `execution-user-${crypto.randomUUID()}`;

const context = (overrides: Partial<CommandContext> = {}): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId,
  actor: { type: "USER", id: userId },
  requestedAt: new Date("2026-09-16T16:00:00.000Z"),
  traceId: `trace-${crypto.randomUUID()}`,
  ...overrides
});

const revisionCommand = (structure: string): CreateContentExecutionRevisionCommand => ({
  contentUnitId,
  format: "VERTICAL_PERFORMANCE_STORY",
  productionIntent: "AUTHENTIC",
  hookType: "PERSONAL_LINE",
  hookText: "I wrote this from a place I did not know how to explain at the time.",
  structure,
  scriptOrPerformanceConcept: "One personal sentence, then move immediately into the live performance without hype language.",
  shotList: [
    { sequence: 1, instruction: "Locked waist-up opening while speaking the personal line." },
    { sequence: 2, instruction: "Stay in the same setup as the first vocal phrase begins." }
  ],
  editBrief: "Keep pauses and breath. No speed ramps, fake reactions or excessive cuts.",
  caption: "A small part of the story behind the song.",
  cta: "Listen if the story feels familiar.",
  platformNotes: [
    { platform: "INSTAGRAM_REELS", note: "Keep the opening line inside the safe title area." },
    { platform: "TIKTOK", note: "Use the same master concept; do not rewrite the premise for trend-chasing." }
  ],
  feasibilityNotes: "Can be executed in one room with the existing camera and audio setup.",
  fallbackPlan: "If the performance take is weak, keep the spoken intro and capture a simpler acoustic take."
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
  await db.insert(artists).values({ id: artistId, name: "Execution Artist", artistName: "Execution Artist" });
  await db.insert(artistIdentities).values({ id: identityId, artistId, activeVersionId: null });
  await db.insert(artistIdentityVersions).values({ id: identityVersionId, identityId, artistId, versionNumber: 1, status: "ACTIVE" });
  await db.update(artistIdentities).set({ activeVersionId: identityVersionId }).where(sql`${artistIdentities.id} = ${identityId}`);
  await db.insert(eraIdentities).values({ id: eraId, artistId, identityVersionId, name: "Execution Era", status: "ACTIVE" });
  await db.insert(songs).values({ id: songId, artistId, title: "Execution Song", isOriginal: true });
  await db.insert(contentAngles).values({
    id: angleId,
    artistId,
    songId,
    identityVersionId,
    eraIdentityId: eraId,
    title: "Execution angle",
    idea: "Reveal one true emotional turn before the performance.",
    pillar: "STORY",
    mode: "EVERGREEN",
    goal: "Clarify the song story.",
    audience: "Story-led listeners.",
    platformTargets: ["INSTAGRAM_REELS"],
    requiredAssets: ["performance take"],
    learningValue: "Test whether context improves qualified attention.",
    why: "The content reveals existing truth rather than manufacturing a hook.",
    identityFitRationale: "Direct and emotionally open.",
    productionEffort: "LOW",
    originalSnapshot: { title: "Execution angle", idea: "Reveal one true emotional turn before the performance." },
    status: "APPROVED",
    version: 2
  });
  await db.insert(contentUnits).values({
    id: contentUnitId,
    artistId,
    unitCode: "EXECUTION-SONG-STORY-001",
    angleId,
    songId,
    identityVersionId,
    eraIdentityId: eraId,
    title: "Execution angle",
    idea: "Reveal one true emotional turn before the performance.",
    pillar: "STORY",
    platformTargets: ["INSTAGRAM_REELS"],
    status: "APPROVED",
    version: 1
  });
});

afterAll(async () => { await runtime.close(); });

describe("ContentExecutionRevision", () => {
  it("creates immutable numbered snapshots and replays idempotently", async () => {
    const writer = new PgContentExecutionWriter(db);
    const create = new CreateContentExecutionRevisionService(writer);
    const key = `execution-create-${crypto.randomUUID()}`;

    const first = await create.execute(revisionCommand("OPEN → STORY LINE → PERFORMANCE"), context({ idempotencyKey: key }));
    const replay = await create.execute(revisionCommand("THIS DIFFERENT BODY MUST NOT REPLACE THE FIRST RESULT"), context({ idempotencyKey: key }));
    expect(first.status).toBe("SUCCESS");
    expect(replay).toEqual(first);
    if (first.status !== "SUCCESS") throw new Error("first revision missing");
    expect(first.data).toMatchObject({ contentUnitId, revisionNumber: 1, status: "DRAFT" });

    const second = await create.execute(revisionCommand("OPEN → SHORTER STORY LINE → PERFORMANCE → QUIET CTA"), context());
    expect(second).toMatchObject({ status: "SUCCESS", data: { revisionNumber: 2, status: "DRAFT" } });

    const reader = new PgContentExecutionReader(db);
    const revisions = await reader.listRevisions(artistId, contentUnitId);
    expect(revisions).toHaveLength(2);
    expect(revisions.find((revision) => revision.revisionNumber === 1)?.snapshot.structure).toBe("OPEN → STORY LINE → PERFORMANCE");
    expect(revisions.find((revision) => revision.revisionNumber === 2)?.snapshot.structure).toBe("OPEN → SHORTER STORY LINE → PERFORMANCE → QUIET CTA");
    expect(revisions[0]).toMatchObject({ identityVersionId, eraIdentityId: eraId });
    expect(revisions[0]?.snapshot.rightsStatus).toBe("UNKNOWN");
  });

  it("keeps one approved execution source and supersedes the previous approved revision", async () => {
    const writer = new PgContentExecutionWriter(db);
    const create = new CreateContentExecutionRevisionService(writer);
    const approve = new ApproveContentExecutionRevisionService(writer);
    const reader = new PgContentExecutionReader(db);

    const revision3 = await create.execute(revisionCommand("REVISION THREE STRUCTURE"), context());
    expect(revision3.status).toBe("SUCCESS");
    if (revision3.status !== "SUCCESS") throw new Error("revision three missing");
    await expect(approve.execute({ revisionId: revision3.data.revisionId }, context()))
      .resolves.toMatchObject({ status: "SUCCESS", data: { status: "APPROVED", revisionNumber: 3 } });

    const revision4 = await create.execute(revisionCommand("REVISION FOUR STRUCTURE"), context());
    expect(revision4.status).toBe("SUCCESS");
    if (revision4.status !== "SUCCESS") throw new Error("revision four missing");
    await expect(approve.execute({ revisionId: revision4.data.revisionId }, context()))
      .resolves.toMatchObject({ status: "SUCCESS", data: { status: "APPROVED", revisionNumber: 4 } });

    const revisions = await reader.listRevisions(artistId, contentUnitId);
    expect(revisions.find((revision) => revision.revisionNumber === 3)?.status).toBe("SUPERSEDED");
    expect(revisions.find((revision) => revision.revisionNumber === 4)?.status).toBe("APPROVED");
    await expect(reader.getApprovedRevision(artistId, contentUnitId)).resolves.toMatchObject({ revisionNumber: 4, status: "APPROVED" });
  });

  it("rejects a draft without replacing the approved execution source or rewriting Angle rationale", async () => {
    const writer = new PgContentExecutionWriter(db);
    const create = new CreateContentExecutionRevisionService(writer);
    const reject = new RejectContentExecutionRevisionService(writer);
    const reader = new PgContentExecutionReader(db);

    const draft = await create.execute(revisionCommand("REJECTED REVISION STRUCTURE"), context());
    expect(draft.status).toBe("SUCCESS");
    if (draft.status !== "SUCCESS") throw new Error("rejectable revision missing");
    await expect(reject.execute({ revisionId: draft.data.revisionId, reason: "Too polished for this performance concept." }, context()))
      .resolves.toMatchObject({ status: "SUCCESS", data: { status: "REJECTED" } });

    await expect(reader.getApprovedRevision(artistId, contentUnitId)).resolves.toMatchObject({ revisionNumber: 4, status: "APPROVED" });
    const angle = await db.execute(sql`select idea, why from content_angles where id = ${angleId}::uuid`);
    expect(angle.rows[0]).toMatchObject({
      idea: "Reveal one true emotional turn before the performance.",
      why: "The content reveals existing truth rather than manufacturing a hook."
    });
  });
});
