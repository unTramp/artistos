import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import {
  CreateLearningService,
  DeprecateLearningService,
  MarkLearningStaleService,
  StartLearningTestService,
  ValidateLearningService,
  type CommandContext
} from "@artist-os/core";
import { createDatabase, type Stage0Database } from "./runtime";
import { artists } from "./schema";
import { getLearning, listLearningHistory, listLearnings } from "./learning-reader";
import { PgLearningWriter } from "./learning-writer";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");
const runtime = createDatabase(databaseUrl);
let db: Stage0Database;
const artistId = crypto.randomUUID();
const userId = `learning-user-${crypto.randomUUID()}`;
const context = (overrides: Partial<CommandContext> = {}): CommandContext => ({
  commandId: crypto.randomUUID(), artistId, actor: { type: "USER", id: userId }, requestedAt: new Date("2026-09-17T08:00:00.000Z"), traceId: `trace-${crypto.randomUUID()}`, ...overrides
});

beforeAll(async () => {
  db = runtime.db;
  await db.execute(sql`truncate table learning_state_history, learnings, decision_state_history, decisions, planning_objectives, operational_actions, consumer_inbox, outbox_events, audit_events, idempotency_records, jobs, artist_memberships, workspace_settings, artists restart identity cascade`);
  await db.insert(artists).values({ id: artistId, name: "Learning Artist", artistName: "Learning Artist" });
});
afterAll(async () => { await runtime.close(); });

describe("Learning persistence", () => {
  it("preserves scope, confidence, provenance and contradictions", async () => {
    const result = await new CreateLearningService(new PgLearningWriter(db)).execute({
      statement: "Performance-first short videos generate stronger downstream music intent.",
      scope: "FORMAT",
      confidence: "MEDIUM",
      confidenceRationale: "Two contexts point in the same direction but there is contradictory evidence.",
      references: [
        { refType: "Publication", refId: "pub-support", relation: "SUPPORTS", note: "Higher downstream intent." },
        { refType: "Publication", refId: "pub-contradict", relation: "CONTRADICTS", note: "One static creative outperformed it." }
      ]
    }, context({ idempotencyKey: `learning-${crypto.randomUUID()}` }));
    expect(result.status).toBe("SUCCESS");
    if (result.status !== "SUCCESS") throw new Error("learning missing");
    const stored = await getLearning(db, artistId, result.data.learningId);
    expect(stored).toMatchObject({ status: "CANDIDATE", scope: "FORMAT", confidence: "MEDIUM" });
    expect(stored?.references).toHaveLength(2);
  });

  it("moves through testing, human validation and stale without deleting evidence", async () => {
    const [learning] = await listLearnings(db, artistId, { statuses: ["CANDIDATE"] });
    if (!learning) throw new Error("candidate missing");
    const writer = new PgLearningWriter(db);
    expect((await new StartLearningTestService(writer).execute({ learningId: learning.id }, context({ expectedVersion: learning.version }))).status).toBe("SUCCESS");
    const testing = await getLearning(db, artistId, learning.id);
    if (!testing) throw new Error("testing missing");
    expect((await new ValidateLearningService(writer).execute({ learningId: learning.id, rationale: "Human reviewed repeated evidence and accepts the scoped conclusion." }, context({ expectedVersion: testing.version }))).status).toBe("SUCCESS");
    const validated = await getLearning(db, artistId, learning.id);
    if (!validated) throw new Error("validated missing");
    expect((await new MarkLearningStaleService(writer).execute({ learningId: learning.id, rationale: "Platform context changed; revalidation is needed." }, context({ expectedVersion: validated.version }))).status).toBe("SUCCESS");
    const stale = await getLearning(db, artistId, learning.id);
    expect(stale?.status).toBe("STALE");
    expect(stale?.references).toHaveLength(2);
    const history = await listLearningHistory(db, artistId, learning.id);
    expect(history.map((item) => item.toStatus)).toEqual(["CANDIDATE", "TESTING", "VALIDATED", "STALE"]);
  });

  it("requires explicit rationale before historical deprecation and keeps history", async () => {
    const [learning] = await listLearnings(db, artistId, { statuses: ["STALE"] });
    if (!learning) throw new Error("stale missing");
    const result = await new DeprecateLearningService(new PgLearningWriter(db)).execute({ learningId: learning.id, rationale: "Newer evidence supersedes this rule." }, context({ expectedVersion: learning.version }));
    expect(result.status).toBe("SUCCESS");
    expect((await getLearning(db, artistId, learning.id))?.status).toBe("DEPRECATED");
    const history = await listLearningHistory(db, artistId, learning.id);
    expect(history.at(-1)).toMatchObject({ toStatus: "DEPRECATED", rationale: "Newer evidence supersedes this rule." });
  });
});
