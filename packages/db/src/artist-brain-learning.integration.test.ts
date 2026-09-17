import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import {
  ActivateIdentityVersionService,
  CreateIdentityDraftService,
  CreateLearningService,
  RebuildArtistBrainService,
  StartLearningTestService,
  ValidateLearningService,
  type CommandContext
} from "@artist-os/core";
import { PgArtistFoundationWriter } from "./artist-foundation-writer";
import { PgKnowledgeReader } from "./knowledge-reader";
import { PgKnowledgeWriter } from "./knowledge-writer";
import { PgLearningWriter } from "./learning-writer";
import { createDatabase, type Stage0Database } from "./runtime";
import { artists } from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");

const runtime = createDatabase(databaseUrl);
let db: Stage0Database;
const artistId = crypto.randomUUID();
const userId = `brain-learning-user-${crypto.randomUUID()}`;

const context = (requestedAt: Date, overrides: Partial<CommandContext> = {}): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId,
  actor: { type: "USER", id: userId },
  requestedAt,
  traceId: `brain-learning-${crypto.randomUUID()}`,
  ...overrides
});

beforeAll(async () => {
  db = runtime.db;
  await db.execute(sql`
    truncate table
      artist_brain_snapshots,
      artist_brain_knowledge_items,
      candidate_knowledge,
      tone_corpus_items,
      learning_state_history,
      learnings,
      era_identities,
      artist_identity_versions,
      artist_identities,
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
  await db.insert(artists).values({ id: artistId, name: "Brain Learning Artist", artistName: "Brain Learning Artist" });

  const foundation = new PgArtistFoundationWriter(db);
  const draft = await new CreateIdentityDraftService(foundation).execute(
    { label: "Active Brain Identity" },
    context(new Date("2026-09-17T08:00:00.000Z"))
  );
  if (draft.status !== "SUCCESS") throw new Error("identity setup failed");
  const active = await new ActivateIdentityVersionService(foundation).execute(
    draft.data.versionId,
    context(new Date("2026-09-17T08:05:00.000Z"))
  );
  if (active.status !== "SUCCESS") throw new Error("identity activation failed");
});

afterAll(async () => { await runtime.close(); });

describe("Artist Brain Learning projection", () => {
  it("includes fresh VALIDATED Learnings with scope/provenance and excludes expired ones", async () => {
    const learningWriter = new PgLearningWriter(db);
    const create = new CreateLearningService(learningWriter);
    const startTest = new StartLearningTestService(learningWriter);
    const validate = new ValidateLearningService(learningWriter);

    const durable = await create.execute({
      statement: "Emotionally direct hooks fit this artist better than generic launch hype.",
      scope: "ARTIST_GLOBAL",
      confidence: "MEDIUM",
      confidenceRationale: "Repeated review evidence supports the pattern.",
      references: [{ refType: "ContentAngle", refId: crypto.randomUUID(), relation: "SUPPORTS" }],
      freshUntil: "2026-12-31T00:00:00.000Z"
    }, context(new Date("2026-09-17T09:00:00.000Z")));
    if (durable.status !== "SUCCESS") throw new Error("learning setup failed");
    const durableTesting = await startTest.execute(
      { learningId: durable.data.learningId },
      context(new Date("2026-09-17T09:02:00.000Z"), { expectedVersion: durable.data.version })
    );
    if (durableTesting.status !== "SUCCESS") throw new Error("learning testing transition failed");
    const durableValidated = await validate.execute(
      { learningId: durable.data.learningId, rationale: "Reviewed by artist after repeated evidence." },
      context(new Date("2026-09-17T09:05:00.000Z"), { expectedVersion: durableTesting.data.version })
    );
    expect(durableValidated.status).toBe("SUCCESS");

    const expired = await create.execute({
      statement: "A temporary launch-week tactic that has already expired.",
      scope: "ARTIST_GLOBAL",
      confidence: "LOW",
      confidenceRationale: "Time-bound observation only.",
      references: [{ refType: "Observation", refId: "launch-week-2026", relation: "SUPPORTS" }],
      freshUntil: "2026-09-17T10:00:00.000Z"
    }, context(new Date("2026-09-17T09:10:00.000Z")));
    if (expired.status !== "SUCCESS") throw new Error("expired learning setup failed");
    const expiredTesting = await startTest.execute(
      { learningId: expired.data.learningId },
      context(new Date("2026-09-17T09:12:00.000Z"), { expectedVersion: expired.data.version })
    );
    if (expiredTesting.status !== "SUCCESS") throw new Error("expired testing transition failed");
    const expiredValidated = await validate.execute(
      { learningId: expired.data.learningId, rationale: "Valid only inside the stated freshness window." },
      context(new Date("2026-09-17T09:15:00.000Z"), { expectedVersion: expiredTesting.data.version })
    );
    expect(expiredValidated.status).toBe("SUCCESS");

    const rebuilt = await new RebuildArtistBrainService(new PgKnowledgeWriter(db)).execute(
      context(new Date("2026-09-18T08:00:00.000Z"))
    );
    expect(rebuilt.status).toBe("SUCCESS");

    const home = await new PgKnowledgeReader(db).getHome(artistId);
    const payload = home.latestSnapshot?.payload as {
      validatedLearnings?: Array<{ id: string; statement: string; scope: string; confidence: string; references: unknown[] }>;
    };
    expect(payload.validatedLearnings).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: durable.data.learningId,
        scope: "ARTIST_GLOBAL",
        confidence: "MEDIUM",
        statement: "Emotionally direct hooks fit this artist better than generic launch hype."
      })
    ]));
    expect(payload.validatedLearnings?.some((learning) => learning.id === expired.data.learningId)).toBe(false);

    const sourceRefs = home.latestSnapshot?.sourceRefs as Array<{ type: string; id: string }>;
    expect(sourceRefs).toContainEqual({ type: "Learning", id: durable.data.learningId });
    expect(sourceRefs).not.toContainEqual({ type: "Learning", id: expired.data.learningId });
  });
});
