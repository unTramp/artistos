import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import { createDatabase, type Stage0Database } from "./runtime";
import { artists } from "./schema";
import { readProductTelemetrySummary } from "./product-telemetry-reader";
import { writeProductTelemetryEvent } from "./product-telemetry-writer";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");

const runtime = createDatabase(databaseUrl);
let db: Stage0Database;
const artistId = crypto.randomUUID();

beforeAll(async () => {
  db = runtime.db;
  await db.execute(sql`
    truncate table
      product_telemetry_events,
      artist_memberships,
      workspace_settings,
      artists
    restart identity cascade
  `);
  await db.insert(artists).values({ id: artistId, name: "Telemetry Artist", artistName: "Telemetry Artist" });
});

afterAll(async () => { await runtime.close(); });

describe("Product telemetry summary", () => {
  it("measures actual attention outcomes and separates Decision vs Content memory reuse", async () => {
    const occurredAt = new Date("2026-09-19T08:00:00.000Z");
    const write = (eventName: Parameters<typeof writeProductTelemetryEvent>[1]["eventName"], surface: string, metadata: Record<string, unknown> = {}) =>
      writeProductTelemetryEvent(db, { artistId, eventName, surface, metadata, occurredAt });

    await write("ATTENTION_EXPLANATION_OPENED", "Today");
    await write("ATTENTION_ACTION_OUTCOME_RECORDED", "Today", { outcome: "COMPLETED" });
    await write("DECISION_CREATED", "DecisionMemory");
    await write("MEMORY_REUSED", "DecisionMemory", { sourceTypes: ["Learning"] });
    await write("CONTENT_CONTEXT_CONSUMED", "ContentFactory", { validatedLearningSourceCount: 1 });
    await write("MEMORY_REUSED", "ContentFactory", { sourceType: "ValidatedLearning", sourceCount: 1 });
    await write("CONTEXTUAL_GUIDANCE_OPENED", "Today");
    await write("CONTEXTUAL_GUIDANCE_APPLIED", "Today");

    const summary = await readProductTelemetrySummary(db, artistId, new Date("2026-09-19T00:00:00.000Z"));

    expect(summary.attention).toMatchObject({
      explanationsOpened: 1,
      outcomesRecorded: 1,
      outcomes: { completed: 1 }
    });
    expect(summary.memory).toMatchObject({
      decisionsCreated: 1,
      decisionsWithMemoryReuse: 1,
      decisionReuseRate: 1,
      contentContextsConsumed: 1,
      contentContextsWithLearningMemory: 1,
      contentReuseRate: 1
    });
    expect(summary.guidance).toMatchObject({ opened: 1, applied: 1, applyRate: 1 });
  });
});
