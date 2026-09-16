import { and, eq } from "drizzle-orm";
import type {
  AgentRunRecord,
  AgentRunStatus,
  AgentRunWritePort
} from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { agentRunArtifacts, agentRuns } from "./ai-runtime-schema";

const TERMINAL = new Set<AgentRunStatus>(["SUCCEEDED", "REJECTED_OUTPUT", "FAILED", "CANCELLED"]);

const toRecord = (row: typeof agentRuns.$inferSelect): AgentRunRecord => ({
  id: row.id,
  artistId: row.artistId,
  workflow: row.workflow,
  agentType: row.agentType,
  configurationVersionId: row.configurationVersionId,
  contextManifest: row.contextManifest as AgentRunRecord["contextManifest"],
  status: row.status as AgentRunStatus,
  ...(row.resultArtifactRef ? { resultArtifactRef: row.resultArtifactRef } : {}),
  ...(row.failureCode ? { failureCode: row.failureCode } : {})
});

export class PgAgentRunWriter implements AgentRunWritePort {
  constructor(private readonly db: Stage0Database) {}

  async start(input: Parameters<AgentRunWritePort["start"]>[0]): Promise<AgentRunRecord> {
    const [row] = await this.db.insert(agentRuns).values({
      id: input.id,
      artistId: input.artistId,
      workflow: input.workflow,
      agentType: input.agentType,
      configurationVersionId: input.configurationVersionId,
      contextManifest: input.contextManifest,
      status: "RUNNING",
      startedAt: input.startedAt,
      traceId: input.traceId,
      createdAt: input.startedAt
    }).returning();
    if (!row) throw new Error("AGENT_RUN_NOT_CREATED");
    return toRecord(row);
  }

  async complete(input: Parameters<AgentRunWritePort["complete"]>[0]): Promise<AgentRunRecord> {
    if (!TERMINAL.has(input.status)) throw new Error("AGENT_RUN_TERMINAL_STATUS_REQUIRED");

    return this.db.transaction(async (tx) => {
      const [existing] = await tx.select().from(agentRuns)
        .where(and(eq(agentRuns.id, input.agentRunId), eq(agentRuns.artistId, input.artistId)))
        .limit(1);
      if (!existing) throw new Error("AGENT_RUN_NOT_FOUND");
      if (existing.status !== "RUNNING") throw new Error("AGENT_RUN_NOT_RUNNING");

      let resultArtifactRef: string | undefined;
      if (input.artifact) {
        await tx.insert(agentRunArtifacts).values({
          id: input.artifact.id,
          artistId: input.artistId,
          agentRunId: input.agentRunId,
          artifactType: input.artifact.artifactType,
          schemaVersion: input.artifact.schemaVersion,
          content: input.artifact.content,
          createdAt: input.finishedAt
        });
        resultArtifactRef = input.artifact.id;
      }

      const [completed] = await tx.update(agentRuns).set({
        status: input.status,
        finishedAt: input.finishedAt,
        ...(input.provider !== undefined ? { provider: input.provider } : {}),
        ...(input.model !== undefined ? { model: input.model } : {}),
        ...(input.inputTokenCount !== undefined ? { inputTokenCount: input.inputTokenCount } : {}),
        ...(input.outputTokenCount !== undefined ? { outputTokenCount: input.outputTokenCount } : {}),
        ...(input.cost !== undefined ? { cost: input.cost } : {}),
        ...(input.latencyMs !== undefined ? { latencyMs: input.latencyMs } : {}),
        ...(input.toolCallCount !== undefined ? { toolCallCount: input.toolCallCount } : {}),
        ...(resultArtifactRef ? { resultArtifactRef } : {}),
        ...(input.failureCode !== undefined ? { failureCode: input.failureCode } : {})
      }).where(and(eq(agentRuns.id, input.agentRunId), eq(agentRuns.artistId, input.artistId))).returning();
      if (!completed) throw new Error("AGENT_RUN_NOT_COMPLETED");
      return toRecord(completed);
    });
  }
}
