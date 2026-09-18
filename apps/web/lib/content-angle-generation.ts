import {
  ContentAngleContextAssembler,
  type AgentContextManifest,
  type AgentRunWritePort,
  type ContentAngleContextSourceData
} from "@artist-os/core";
import {
  CONTENT_ANGLE_STRATEGY_PROMPT_VERSION,
  ContentAngleStrategyAgent,
  type AIProvider,
  type ContentAngleStrategyResult
} from "@artist-os/ai";

export interface ContentAngleSourceReader {
  readSources(
    artistId: string,
    songId?: string,
    context?: { platformTargets?: string[] }
  ): Promise<ContentAngleContextSourceData>;
}

export interface GenerateContentAnglesInput {
  artistId: string;
  traceId: string;
  explicitRequest: string;
  songId?: string;
  platformTargets?: string[];
  maxCandidates?: number;
}

export interface GenerateContentAnglesOutput {
  agentRunId?: string;
  result: ContentAngleStrategyResult;
  context: {
    readiness: "READY" | "PARTIAL" | "COLD_START" | "BUDGET_EXCEEDED";
    maturity: "COLD" | "WARM" | "MATURE";
    missingSources: string[];
    sourceCount: number;
    validatedLearningSourceCount: number;
    estimatedTokens: number;
    truncated: boolean;
    contextVersion: string;
  };
}

const DEFAULT_BUDGET = { maxChunks: 12, maxTokens: 2400, maxExamples: 4, maxLearnings: 6 } as const;

export class GenerateContentAnglesService {
  constructor(
    private readonly sourceReader: ContentAngleSourceReader,
    private readonly provider: AIProvider,
    private readonly runWriter: AgentRunWritePort,
    private readonly idFactory = () => globalThis.crypto.randomUUID(),
    private readonly now = () => new Date()
  ) {}

  async execute(input: GenerateContentAnglesInput): Promise<GenerateContentAnglesOutput> {
    const source = await this.sourceReader.readSources(input.artistId, input.songId, {
      ...(input.platformTargets ? { platformTargets: input.platformTargets } : {})
    });
    const pack = new ContentAngleContextAssembler().assemble({
      artistId: input.artistId,
      explicitRequest: input.explicitRequest,
      ...(input.songId ? { songId: input.songId } : {}),
      ...(input.platformTargets ? { platformTargets: input.platformTargets } : {}),
      budget: { ...DEFAULT_BUDGET }
    }, source);

    const contextSummary = {
      readiness: pack.readiness,
      maturity: pack.maturity,
      missingSources: pack.missingSources,
      sourceCount: pack.sourceReferences.length,
      validatedLearningSourceCount: pack.sourceReferences.filter((reference) => reference.entityType === "ValidatedLearning").length,
      estimatedTokens: pack.budget.estimatedTokens,
      truncated: pack.budget.truncated,
      contextVersion: pack.contextVersion
    };

    const agent = new ContentAngleStrategyAgent(this.provider);
    if (pack.readiness === "COLD_START" || pack.readiness === "BUDGET_EXCEEDED") {
      const result = await agent.run({
        context: pack,
        readiness: pack.readiness,
        missingSources: pack.missingSources,
        sourceReferences: pack.sourceReferences.map(({ entityType, entityId }) => ({ entityType, entityId })),
        traceId: input.traceId,
        maxCandidates: input.maxCandidates ?? 5
      });
      return { result, context: contextSummary };
    }

    const runId = this.idFactory();
    const manifest: AgentContextManifest = {
      sourceReferences: pack.sourceReferences.map(({ entityType, entityId }) => ({ entityType, entityId })),
      missingSources: pack.missingSources,
      ...(pack.identity?.activeVersionId ? { identityVersionId: pack.identity.activeVersionId } : {}),
      ...(pack.identity?.eraId ? { eraIdentityId: pack.identity.eraId } : {}),
      promptVersion: CONTENT_ANGLE_STRATEGY_PROMPT_VERSION,
      tokenEstimate: pack.budget.estimatedTokens,
      budget: {
        maxChunks: pack.budget.maxChunks,
        maxTokens: pack.budget.maxTokens,
        maxExamples: pack.budget.maxExamples,
        maxLearnings: pack.budget.maxLearnings
      }
    };

    await this.runWriter.start({
      id: runId,
      artistId: input.artistId,
      workflow: "strategy.generate-content-angles",
      agentType: "STRATEGY",
      configurationVersionId: CONTENT_ANGLE_STRATEGY_PROMPT_VERSION,
      contextManifest: manifest,
      traceId: input.traceId,
      startedAt: this.now()
    });

    const result = await agent.run({
      context: pack,
      readiness: pack.readiness,
      missingSources: pack.missingSources,
      sourceReferences: manifest.sourceReferences,
      traceId: input.traceId,
      maxCandidates: input.maxCandidates ?? 5
    });

    if (result.status === "PROPOSALS") {
      const artifactId = this.idFactory();
      await this.runWriter.complete({
        agentRunId: runId,
        artistId: input.artistId,
        status: "SUCCEEDED",
        finishedAt: this.now(),
        provider: result.provider,
        model: result.model,
        toolCallCount: 0,
        artifact: {
          id: artifactId,
          artifactType: "CONTENT_ANGLE_PROPOSALS",
          schemaVersion: 1,
          content: {
            promptVersion: result.promptVersion,
            contextVersion: pack.contextVersion,
            proposals: result.proposals,
            coverageNote: result.coverageNote
          }
        }
      });
    } else if (result.status === "REJECTED_OUTPUT") {
      await this.runWriter.complete({
        agentRunId: runId,
        artistId: input.artistId,
        status: "REJECTED_OUTPUT",
        failureCode: result.code,
        finishedAt: this.now()
      });
    } else if (result.status === "PROVIDER_UNAVAILABLE") {
      await this.runWriter.complete({
        agentRunId: runId,
        artistId: input.artistId,
        status: "FAILED",
        failureCode: result.code,
        finishedAt: this.now()
      });
    }

    return { agentRunId: runId, result, context: contextSummary };
  }
}
