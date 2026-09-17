import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import {
  CreateLearningService,
  ValidateLearningService,
  type CommandContext,
  type LearningScope
} from "@artist-os/core";
import { PgContentAngleContextReader } from "./content-angle-context-reader";
import { PgLearningWriter } from "./learning-writer";
import { createDatabase, type Stage0Database } from "./runtime";
import { artists } from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");

const runtime = createDatabase(databaseUrl);
let db: Stage0Database;
const artistId = crypto.randomUUID();
const userId = `scope-user-${crypto.randomUUID()}`;

const context = (overrides: Partial<CommandContext> = {}): CommandContext => ({
  commandId: crypto.randomUUID(),
  artistId,
  actor: { type: "USER", id: userId },
  requestedAt: new Date("2026-09-18T08:00:00.000Z"),
  traceId: `scope-trace-${crypto.randomUUID()}`,
  ...overrides
});

beforeAll(async () => {
  db = runtime.db;
  await db.execute(sql`
    truncate table
      learning_state_history,
      learnings,
      content_angle_revisions,
      content_angles,
      artist_brain_snapshots,
      artist_brain_knowledge_items,
      candidate_knowledge,
      tone_corpus_items,
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
  await db.insert(artists).values({ id: artistId, name: "Scope Artist", artistName: "Scope Artist" });
});

afterAll(async () => { await runtime.close(); });

const createValidated = async (scope: LearningScope, statement: string, subject?: string) => {
  const writer = new PgLearningWriter(db);
  const references = [
    { refType: "Evidence", refId: `evidence-${crypto.randomUUID()}`, relation: "SUPPORTS" as const },
    ...(subject ? [{ refType: scope === "PLATFORM" ? "Platform" : "ScopeTarget", refId: subject, relation: "SUBJECT" as const }] : [])
  ];
  const created = await new CreateLearningService(writer).execute({
    statement,
    scope,
    confidence: "MEDIUM",
    confidenceRationale: "Explicit integration-test evidence.",
    references
  }, context());
  if (created.status !== "SUCCESS") throw new Error(`failed to create ${scope} learning`);
  const validated = await new ValidateLearningService(writer).execute(
    { learningId: created.data.learningId, rationale: "Explicit human validation for test." },
    context({ expectedVersion: created.data.version })
  );
  if (validated.status !== "SUCCESS") throw new Error(`failed to validate ${scope} learning`);
  return created.data.learningId;
};

describe("Content Angle Learning scope applicability", () => {
  it("includes artist-global and matching platform memory but withholds unrelated scoped memory", async () => {
    const globalId = await createValidated("ARTIST_GLOBAL", "Global artist preference can inform any content angle.");
    const spotifyId = await createValidated("PLATFORM", "Spotify-specific tactic.", "spotify");
    const marketId = await createValidated("MARKET", "Brazil-specific market observation.", "brazil");
    const formatId = await createValidated("FORMAT", "Acoustic-live format observation.", "acoustic-live");

    const spotifyContext = await new PgContentAngleContextReader(db).readSources(artistId, undefined, { platformTargets: ["Spotify"] });
    expect(spotifyContext.validatedLearnings.map((learning) => learning.id)).toEqual(expect.arrayContaining([globalId, spotifyId]));
    expect(spotifyContext.validatedLearnings.map((learning) => learning.id)).not.toEqual(expect.arrayContaining([marketId, formatId]));

    const youtubeContext = await new PgContentAngleContextReader(db).readSources(artistId, undefined, { platformTargets: ["YouTube"] });
    expect(youtubeContext.validatedLearnings.map((learning) => learning.id)).toContain(globalId);
    expect(youtubeContext.validatedLearnings.map((learning) => learning.id)).not.toContain(spotifyId);
    expect(youtubeContext.validatedLearnings.map((learning) => learning.id)).not.toContain(marketId);
    expect(youtubeContext.validatedLearnings.map((learning) => learning.id)).not.toContain(formatId);
  });
});
