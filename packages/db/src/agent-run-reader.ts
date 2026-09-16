import { and, eq } from "drizzle-orm";
import type { Stage0Database } from "./runtime";
import { agentRunArtifacts, agentRuns } from "./ai-runtime-schema";

export interface AgentRunArtifactView {
  run: {
    id: string;
    artistId: string;
    workflow: string;
    status: string;
    configurationVersionId: string;
    contextManifest: Record<string, unknown>;
    resultArtifactRef: string | null;
    failureCode: string | null;
  };
  artifact: {
    id: string;
    artifactType: string;
    schemaVersion: number;
    content: unknown;
  } | null;
}

export class PgAgentRunReader {
  constructor(private readonly db: Stage0Database) {}

  async getWithArtifact(artistId: string, agentRunId: string): Promise<AgentRunArtifactView | null> {
    const [run] = await this.db.select().from(agentRuns)
      .where(and(eq(agentRuns.id, agentRunId), eq(agentRuns.artistId, artistId)))
      .limit(1);
    if (!run) return null;

    const artifact = run.resultArtifactRef
      ? (await this.db.select().from(agentRunArtifacts)
          .where(and(eq(agentRunArtifacts.id, run.resultArtifactRef), eq(agentRunArtifacts.artistId, artistId)))
          .limit(1))[0] ?? null
      : null;

    return {
      run: {
        id: run.id,
        artistId: run.artistId,
        workflow: run.workflow,
        status: run.status,
        configurationVersionId: run.configurationVersionId,
        contextManifest: run.contextManifest as Record<string, unknown>,
        resultArtifactRef: run.resultArtifactRef,
        failureCode: run.failureCode
      },
      artifact: artifact ? {
        id: artifact.id,
        artifactType: artifact.artifactType,
        schemaVersion: artifact.schemaVersion,
        content: artifact.content
      } : null
    };
  }
}
