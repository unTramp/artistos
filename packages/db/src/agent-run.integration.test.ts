import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import { createDatabase, type Stage0Database } from "./runtime";
import { PgAgentRunWriter } from "./agent-run-writer";
import { artists } from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for DB integration tests");

const runtime = createDatabase(databaseUrl);
let db: Stage0Database;
const artistId = crypto.randomUUID();

beforeAll(async () => {
  db = runtime.db;
  await db.execute(sql`
    truncate table
      agent_run_artifacts,
      agent_runs,
      artists
    restart identity cascade
  `);
  await db.insert(artists).values({ id: artistId, name: "Agent Artist", artistName: "Agent Artist" });
});

afterAll(async () => { await runtime.close(); });

describe("AgentRun persistence", () => {
  it("records compact provenance and a bounded result artifact without prompt or chain-of-thought fields", async () => {
    const writer = new PgAgentRunWriter(db);
    const runId = crypto.randomUUID();
    const artifactId = crypto.randomUUID();

    await expect(writer.start({
      id: runId,
      artistId,
      workflow: "strategy.generate-content-angles",
      agentType: "STRATEGY",
      configurationVersionId: "content-angle-strategy.v1",
      contextManifest: {
        sourceReferences: [{ entityType: "ArtistIdentityVersion", entityId: "identity-1" }],
        missingSources: ["CAMPAIGN"],
        identityVersionId: "identity-1",
        promptVersion: "content-angle-strategy.v1",
        tokenEstimate: 420,
        budget: { maxChunks: 12, maxTokens: 2400, maxExamples: 4, maxLearnings: 6 }
      },
      traceId: "trace-agent-run",
      startedAt: new Date("2026-09-16T18:00:00.000Z")
    })).resolves.toMatchObject({ id: runId, status: "RUNNING" });

    await expect(writer.complete({
      agentRunId: runId,
      artistId,
      status: "SUCCEEDED",
      finishedAt: new Date("2026-09-16T18:00:01.000Z"),
      provider: "fake",
      model: "fake-model",
      inputTokenCount: 300,
      outputTokenCount: 120,
      cost: 0.01,
      latencyMs: 900,
      toolCallCount: 0,
      artifact: {
        id: artifactId,
        artifactType: "CONTENT_ANGLE_PROPOSALS",
        schemaVersion: 1,
        content: { proposals: [{ title: "Grounded proposal" }], coverageNote: "bounded" }
      }
    })).resolves.toMatchObject({ status: "SUCCEEDED", resultArtifactRef: artifactId });

    const rows = await db.execute(sql`select context_manifest, result_artifact_ref from agent_runs where id = ${runId}::uuid`);
    const manifest = rows.rows[0]?.context_manifest as Record<string, unknown>;
    expect(manifest).not.toHaveProperty("prompt");
    expect(manifest).not.toHaveProperty("chainOfThought");
    expect(rows.rows[0]?.result_artifact_ref).toBe(artifactId);

    const artifacts = await db.execute(sql`select content from agent_run_artifacts where id = ${artifactId}::uuid`);
    expect(artifacts.rows).toHaveLength(1);
    expect(artifacts.rows[0]?.content).toMatchObject({ coverageNote: "bounded" });
  });

  it("does not allow a terminal run to be completed twice", async () => {
    const writer = new PgAgentRunWriter(db);
    const runId = crypto.randomUUID();
    await writer.start({
      id: runId,
      artistId,
      workflow: "strategy.generate-content-angles",
      agentType: "STRATEGY",
      configurationVersionId: "content-angle-strategy.v1",
      contextManifest: {
        sourceReferences: [],
        missingSources: [],
        promptVersion: "content-angle-strategy.v1",
        tokenEstimate: 0,
        budget: { maxChunks: 12, maxTokens: 2400, maxExamples: 4, maxLearnings: 6 }
      },
      traceId: "trace-agent-failure",
      startedAt: new Date("2026-09-16T18:10:00.000Z")
    });
    await writer.complete({
      agentRunId: runId,
      artistId,
      status: "FAILED",
      failureCode: "AI_PROVIDER_FAILED",
      finishedAt: new Date("2026-09-16T18:10:01.000Z")
    });

    await expect(writer.complete({
      agentRunId: runId,
      artistId,
      status: "CANCELLED",
      finishedAt: new Date("2026-09-16T18:10:02.000Z")
    })).rejects.toThrow("AGENT_RUN_NOT_RUNNING");
  });
});
