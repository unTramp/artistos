import {
  DisabledAIProvider,
  type AIProvider,
  type AIRequest,
  type AIResult
} from "@artist-os/ai";
import { getRuntimeEnv } from "@artist-os/infrastructure";

class ContentAngleMockAIProvider implements AIProvider {
  async runStructured<T>(request: AIRequest<T>): Promise<AIResult<T>> {
    if (request.workflow !== "strategy.generate-content-angles") throw new Error("MOCK_WORKFLOW_UNSUPPORTED");
    const input = request.input as {
      allowedSourceReferences?: Array<{ entityType: string; entityId: string }>;
      context?: { song?: { title?: string | null } | null };
    };
    const reference = input.allowedSourceReferences?.[0];
    if (!reference) throw new Error("MOCK_CONTEXT_REFERENCE_REQUIRED");
    const songTitle = input.context?.song?.title ?? "the current song";
    const output = request.outputSchema.parse({
      proposals: [{
        title: "One honest performance frame",
        idea: `Open with one specific line of context, then perform a meaningful section of ${songTitle} in one restrained setup.`,
        pillar: "PERFORMANCE",
        mode: "EVERGREEN",
        goal: "Strengthen song discovery through artist-specific performance context.",
        audience: "Listeners who respond to intimate performance and story context.",
        platformTargets: ["INSTAGRAM_REELS"],
        requiredAssets: ["performance setup", "recorded song or live audio"],
        productionEffort: "Low-to-medium; one controlled setup and a small number of takes.",
        learningValue: "Tests whether a grounded personal setup improves qualified attention before the performance begins.",
        why: "The proposal uses current artist context and keeps the performance as the primary creative substance.",
        identityFitRationale: "It preserves the active identity instead of introducing a trend-led visual language.",
        basedOn: [{ ...reference, reason: "Selected from the bounded Context Manifest." }],
        uncertainty: { level: "HIGH", note: "Mock provider output is deterministic and is not evidence of real model quality." }
      }],
      coverageNote: "Mock mode returns one deterministic proposal so the workflow can be tested without external AI credentials."
    });
    return { output, provider: "mock", model: "deterministic-content-angle-mock", latencyMs: 0 };
  }
}

export function createConfiguredAIProvider(): AIProvider {
  return getRuntimeEnv().AI_PROVIDER === "mock" ? new ContentAngleMockAIProvider() : new DisabledAIProvider();
}
