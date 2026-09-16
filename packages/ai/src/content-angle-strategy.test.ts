import { describe, expect, it, vi } from "vitest";
import type { AIProvider, AIRequest, AIResult } from "./index";
import { DisabledAIProvider } from "./index";
import {
  CONTENT_ANGLE_STRATEGY_PROMPT_VERSION,
  ContentAngleStrategyAgent,
  type ContentAngleProposalBatch
} from "./content-angle-strategy";

function validBatch(entityId = "identity-1"): ContentAngleProposalBatch {
  return {
    proposals: [{
      title: "One honest room, one take",
      idea: "Perform the chorus in the current era room and let the camera stay imperfectly close.",
      pillar: "PERFORMANCE",
      mode: "EVERGREEN",
      goal: "Strengthen artist recognition around the song.",
      audience: "Existing listeners and profile visitors.",
      platformTargets: ["Instagram"],
      requiredAssets: ["phone", "microphone"],
      productionEffort: "Low: one room, one performance take.",
      learningValue: "Tests whether intimate performance framing improves saves and profile visits.",
      why: "The current identity and song context support an intimate performance instead of a generic promo post.",
      identityFitRationale: "Uses the active identity without inventing a new visual language.",
      basedOn: [{ entityType: "ArtistIdentityVersion", entityId, reason: "Active identity context" }],
      uncertainty: { level: "MEDIUM", note: "No validated platform-specific learning is available yet." }
    }],
    coverageNote: "One grounded proposal was stronger than filler alternatives."
  };
}

class FakeProvider implements AIProvider {
  constructor(private readonly result: AIResult<unknown>) {}
  requests: AIRequest<unknown>[] = [];

  async runStructured<T>(request: AIRequest<T>): Promise<AIResult<T>> {
    this.requests.push(request as AIRequest<unknown>);
    return this.result as AIResult<T>;
  }
}

describe("ContentAngleStrategyAgent", () => {
  it("returns grounded structured proposals through the stable provider contract", async () => {
    const provider = new FakeProvider({
      output: validBatch(),
      provider: "fake",
      model: "fake-model",
      latencyMs: 12
    });
    const agent = new ContentAngleStrategyAgent(provider);

    const result = await agent.run({
      context: { identity: "active" },
      readiness: "READY",
      missingSources: [],
      sourceReferences: [{ entityType: "ArtistIdentityVersion", entityId: "identity-1" }],
      traceId: "trace-1",
      maxCandidates: 3
    });

    expect(result.status).toBe("PROPOSALS");
    if (result.status !== "PROPOSALS") throw new Error("expected proposals");
    expect(result.proposals).toHaveLength(1);
    expect(result.promptVersion).toBe(CONTENT_ANGLE_STRATEGY_PROMPT_VERSION);
    expect(provider.requests[0]?.workflow).toBe("strategy.generate-content-angles");
  });

  it("does not call the provider for cold-start context", async () => {
    const runStructured = vi.fn();
    const agent = new ContentAngleStrategyAgent({ runStructured });

    const result = await agent.run({
      context: {},
      readiness: "COLD_START",
      missingSources: ["IDENTITY"],
      sourceReferences: [],
      traceId: "trace-cold",
      maxCandidates: 5
    });

    expect(result.status).toBe("INSUFFICIENT_CONTEXT");
    expect(runStructured).not.toHaveBeenCalled();
  });

  it("degrades explicitly when AI is disabled", async () => {
    const result = await new ContentAngleStrategyAgent(new DisabledAIProvider()).run({
      context: { identity: "active" },
      readiness: "READY",
      missingSources: [],
      sourceReferences: [{ entityType: "ArtistIdentityVersion", entityId: "identity-1" }],
      traceId: "trace-disabled",
      maxCandidates: 2
    });

    expect(result).toMatchObject({ status: "PROVIDER_UNAVAILABLE", code: "AI_PROVIDER_DISABLED" });
  });

  it("rejects proposals that cite sources outside the context manifest", async () => {
    const provider = new FakeProvider({
      output: validBatch("unknown-identity"),
      provider: "fake",
      model: "fake-model",
      latencyMs: 9
    });

    const result = await new ContentAngleStrategyAgent(provider).run({
      context: { identity: "active" },
      readiness: "READY",
      missingSources: [],
      sourceReferences: [{ entityType: "ArtistIdentityVersion", entityId: "identity-1" }],
      traceId: "trace-grounding",
      maxCandidates: 5
    });

    expect(result).toMatchObject({ status: "REJECTED_OUTPUT", code: "ANGLE_PROPOSAL_SOURCE_UNGROUNDED" });
  });
});
