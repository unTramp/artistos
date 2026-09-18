import { describe, expect, it } from "vitest";
import type {
  AgentRunCompletionInput,
  AgentRunRecord,
  AgentRunStartInput,
  AgentRunWritePort,
  ContentAngleContextSourceData
} from "@artist-os/core";
import { DisabledAIProvider, type AIProvider, type AIRequest, type AIResult } from "@artist-os/ai";
import { GenerateContentAnglesService, type ContentAngleSourceReader } from "./content-angle-generation";

const source = (withIdentity = true): ContentAngleContextSourceData => ({
  identity: withIdentity ? {
    identityId: "identity-root",
    activeVersionId: "identity-version",
    versionNumber: 2,
    label: "Current",
    eraId: "era-1",
    eraName: "Current era"
  } : null,
  song: null,
  approvedKnowledge: [{ id: "knowledge-1", content: "Keep performances emotionally direct.", sourceType: "ARTIST_APPROVED", sourceId: "source-1" }],
  toneExamples: [{ id: "tone-1", textContent: "I wanted to sing this without dressing it up.", label: "AUTHENTIC", sourceType: "CAPTION", language: "en", isPrivate: false }],
  validatedLearnings: [],
  campaign: null,
  platformConstraints: [],
  productionCapability: null,
  recentAngles: []
});

class FakeSourceReader implements ContentAngleSourceReader {
  constructor(private readonly data: ContentAngleContextSourceData) {}
  async readSources(): Promise<ContentAngleContextSourceData> { return this.data; }
}

class MemoryRunWriter implements AgentRunWritePort {
  starts: AgentRunStartInput[] = [];
  completions: AgentRunCompletionInput[] = [];
  async start(input: AgentRunStartInput): Promise<AgentRunRecord> {
    this.starts.push(input);
    return { ...input, status: "RUNNING" };
  }
  async complete(input: AgentRunCompletionInput): Promise<AgentRunRecord> {
    this.completions.push(input);
    const start = this.starts.find((item) => item.id === input.agentRunId);
    if (!start) throw new Error("missing start");
    return {
      id: start.id,
      artistId: start.artistId,
      workflow: start.workflow,
      agentType: start.agentType,
      configurationVersionId: start.configurationVersionId,
      contextManifest: start.contextManifest,
      status: input.status,
      ...(input.artifact ? { resultArtifactRef: input.artifact.id } : {}),
      ...(input.failureCode ? { failureCode: input.failureCode } : {})
    };
  }
}

class FakeProposalProvider implements AIProvider {
  calls = 0;
  async runStructured<T>(request: AIRequest<T>): Promise<AIResult<T>> {
    this.calls += 1;
    const allowed = (request.input as { allowedSourceReferences: Array<{ entityType: string; entityId: string }> }).allowedSourceReferences;
    const output = request.outputSchema.parse({
      proposals: [{
        title: "Grounded performance idea",
        idea: "Open with a short honest line, then move into the performance.",
        pillar: "PERFORMANCE",
        mode: "EVERGREEN",
        goal: "Music discovery",
        audience: "Existing listeners",
        platformTargets: ["INSTAGRAM_REELS"],
        requiredAssets: ["performance take"],
        productionEffort: "Low",
        learningValue: "Test whether honest context improves saves.",
        why: "Grounded in approved artist context.",
        identityFitRationale: "Keeps the current identity intact.",
        basedOn: [{ ...allowed[0], reason: "Active context" }],
        uncertainty: { level: "MEDIUM", note: "No validated platform learning yet." }
      }],
      coverageNote: "One grounded proposal."
    });
    return { output, provider: "fake", model: "fake-model", latencyMs: 10 };
  }
}

describe("GenerateContentAnglesService", () => {
  it("persists AgentRun and bounded proposal artifact for a successful grounded generation", async () => {
    const runWriter = new MemoryRunWriter();
    const provider = new FakeProposalProvider();
    let id = 0;
    const service = new GenerateContentAnglesService(
      new FakeSourceReader(source()),
      provider,
      runWriter,
      () => `00000000-0000-4000-8000-${String(++id).padStart(12, "0")}`,
      () => new Date("2026-09-16T19:00:00.000Z")
    );

    const result = await service.execute({ artistId: "artist-1", traceId: "trace-1", explicitRequest: "Give me one honest performance angle." });

    expect(result.result.status).toBe("PROPOSALS");
    expect(provider.calls).toBe(1);
    expect(runWriter.starts).toHaveLength(1);
    expect(runWriter.starts[0]).toMatchObject({ workflow: "strategy.generate-content-angles", agentType: "STRATEGY" });
    expect(runWriter.completions[0]).toMatchObject({ status: "SUCCEEDED", artifact: { artifactType: "CONTENT_ANGLE_PROPOSALS" } });
    expect(runWriter.starts[0]?.contextManifest).not.toHaveProperty("prompt");
    expect(runWriter.starts[0]?.contextManifest).not.toHaveProperty("chainOfThought");
    expect(result.context.validatedLearningSourceCount).toBe(0);
  });

  it("reports validated Learning memory only when it survives context assembly", async () => {
    const runWriter = new MemoryRunWriter();
    const provider = new FakeProposalProvider();
    const data = source();
    data.validatedLearnings = [{
      id: "learning-1",
      statement: "Performance-first clips create stronger downstream intent.",
      scope: "ARTIST_GLOBAL",
      confidence: "HIGH",
      confidenceRationale: "Repeated evidence.",
      version: 3,
      references: []
    }];
    const service = new GenerateContentAnglesService(new FakeSourceReader(data), provider, runWriter);

    const result = await service.execute({ artistId: "artist-1", traceId: "trace-memory", explicitRequest: "Generate angles." });

    expect(result.result.status).toBe("PROPOSALS");
    expect(result.context.validatedLearningSourceCount).toBe(1);
    expect(runWriter.starts[0]?.contextManifest.sourceReferences).toContainEqual(expect.objectContaining({
      entityType: "ValidatedLearning",
      entityId: "learning-1"
    }));
  });

  it("does not create an AgentRun when context preflight is cold-start", async () => {
    const runWriter = new MemoryRunWriter();
    const provider = new FakeProposalProvider();
    const service = new GenerateContentAnglesService(new FakeSourceReader(source(false)), provider, runWriter);

    const result = await service.execute({ artistId: "artist-1", traceId: "trace-cold", explicitRequest: "Generate angles." });

    expect(result.result.status).toBe("INSUFFICIENT_CONTEXT");
    expect(provider.calls).toBe(0);
    expect(runWriter.starts).toHaveLength(0);
  });

  it("records disabled provider as a controlled failed AgentRun", async () => {
    const runWriter = new MemoryRunWriter();
    const service = new GenerateContentAnglesService(new FakeSourceReader(source()), new DisabledAIProvider(), runWriter);

    const result = await service.execute({ artistId: "artist-1", traceId: "trace-disabled", explicitRequest: "Generate angles." });

    expect(result.result).toMatchObject({ status: "PROVIDER_UNAVAILABLE", code: "AI_PROVIDER_DISABLED" });
    expect(runWriter.starts).toHaveLength(1);
    expect(runWriter.completions[0]).toMatchObject({ status: "FAILED", failureCode: "AI_PROVIDER_DISABLED" });
  });
});
