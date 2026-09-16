import { z } from "zod";
import { AIDisabledError, type AIProvider } from "./provider";

export const CONTENT_ANGLE_STRATEGY_PROMPT_VERSION = "content-angle-strategy.v1";

const pillarSchema = z.enum([
  "PERFORMANCE", "ACOUSTIC", "STORY", "PERSONALITY", "BTS", "LYRICS",
  "REACTION", "COMMUNITY", "PHOTO", "PROMO", "RELEASE", "EXPERIMENTAL"
]);
const modeSchema = z.enum(["CAMPAIGN", "EVERGREEN", "OPPORTUNISTIC", "EXPERIMENTAL"]);

export const contentAngleProposalSchema = z.object({
  title: z.string().trim().min(1).max(240),
  idea: z.string().trim().min(1).max(12000),
  pillar: pillarSchema,
  mode: modeSchema,
  goal: z.string().trim().min(1).max(2000),
  audience: z.string().trim().min(1).max(2000),
  platformTargets: z.array(z.string().trim().min(1).max(300)).max(12),
  requiredAssets: z.array(z.string().trim().min(1).max(300)).max(20),
  productionEffort: z.string().trim().min(1).max(1000),
  learningValue: z.string().trim().min(1).max(2000),
  why: z.string().trim().min(1).max(2000),
  identityFitRationale: z.string().trim().min(1).max(2000),
  basedOn: z.array(z.object({
    entityType: z.string().trim().min(1).max(160),
    entityId: z.string().trim().min(1).max(500),
    reason: z.string().trim().min(1).max(800)
  })).min(1).max(12),
  uncertainty: z.object({
    level: z.enum(["LOW", "MEDIUM", "HIGH"]),
    note: z.string().trim().min(1).max(1000)
  })
});

export const contentAngleProposalBatchSchema = z.object({
  proposals: z.array(contentAngleProposalSchema).min(1).max(5),
  coverageNote: z.string().trim().min(1).max(1200)
});

export type ContentAngleProposal = z.infer<typeof contentAngleProposalSchema>;
export type ContentAngleProposalBatch = z.infer<typeof contentAngleProposalBatchSchema>;

export interface ContentAngleStrategyRequest<TContext> {
  context: TContext;
  readiness: "READY" | "PARTIAL" | "COLD_START" | "BUDGET_EXCEEDED";
  missingSources: string[];
  sourceReferences: Array<{ entityType: string; entityId: string }>;
  traceId: string;
  maxCandidates: number;
}

export type ContentAngleStrategyResult =
  | {
      status: "PROPOSALS";
      proposals: ContentAngleProposal[];
      coverageNote: string;
      provider: string;
      model: string;
      promptVersion: string;
    }
  | {
      status: "INSUFFICIENT_CONTEXT";
      code: "COLD_START" | "BUDGET_EXCEEDED";
      message: string;
      missingSources: string[];
    }
  | {
      status: "PROVIDER_UNAVAILABLE";
      code: string;
      message: string;
    }
  | {
      status: "REJECTED_OUTPUT";
      code: string;
      message: string;
    };

export class ContentAngleStrategyAgent {
  constructor(private readonly provider: AIProvider) {}

  async run<TContext>(request: ContentAngleStrategyRequest<TContext>): Promise<ContentAngleStrategyResult> {
    const maxCandidates = Math.max(1, Math.min(5, Math.trunc(request.maxCandidates)));
    if (request.readiness === "COLD_START" || request.readiness === "BUDGET_EXCEEDED") {
      return {
        status: "INSUFFICIENT_CONTEXT",
        code: request.readiness,
        message: request.readiness === "COLD_START"
          ? "Artist context is too sparse to claim personalized strategy. Add Identity/Song/approved evidence or use the manual Factory path."
          : "The mandatory context does not fit the configured budget. Increase the budget or narrow the request before calling a provider.",
        missingSources: request.missingSources
      };
    }

    try {
      const response = await this.provider.runStructured({
        workflow: "strategy.generate-content-angles",
        outputSchema: contentAngleProposalBatchSchema,
        input: {
          task: "Generate distinct Content Angle Cards, not captions or finished posts.",
          promptVersion: CONTENT_ANGLE_STRATEGY_PROMPT_VERSION,
          maxCandidates,
          rules: [
            "Return fewer candidates rather than generic filler.",
            "Respect Identity and Song meaning; audience interpretation must not overwrite artist interpretation.",
            "Every proposal must explain why, learning value, production effort, uncertainty and source references.",
            "Do not imply publishability, rights clearance or campaign facts that are absent from context.",
            "Do not include hidden reasoning or chain-of-thought; only concise review rationale in bounded fields."
          ],
          allowedSourceReferences: request.sourceReferences,
          context: request.context
        },
        traceId: request.traceId
      });

      const parsed = contentAngleProposalBatchSchema.safeParse(response.output);
      if (!parsed.success) {
        return { status: "REJECTED_OUTPUT", code: "ANGLE_PROPOSAL_SCHEMA_INVALID", message: "AI output did not match the Content Angle proposal schema." };
      }

      const allowed = new Set(request.sourceReferences.map((reference) => `${reference.entityType}:${reference.entityId}`));
      const proposals = parsed.data.proposals.slice(0, maxCandidates);
      const hasUnknownSource = proposals.some((proposal) => proposal.basedOn.some((reference) => !allowed.has(`${reference.entityType}:${reference.entityId}`)));
      if (hasUnknownSource) {
        return { status: "REJECTED_OUTPUT", code: "ANGLE_PROPOSAL_SOURCE_UNGROUNDED", message: "AI output referenced a source that was not present in the assembled context manifest." };
      }

      return {
        status: "PROPOSALS",
        proposals,
        coverageNote: parsed.data.coverageNote,
        provider: response.provider,
        model: response.model,
        promptVersion: CONTENT_ANGLE_STRATEGY_PROMPT_VERSION
      };
    } catch (error) {
      if (error instanceof AIDisabledError) {
        return { status: "PROVIDER_UNAVAILABLE", code: "AI_PROVIDER_DISABLED", message: "AI generation is disabled. Manual Content Factory remains fully available." };
      }
      return { status: "PROVIDER_UNAVAILABLE", code: "AI_PROVIDER_FAILED", message: "AI provider is unavailable. Manual Content Factory remains fully available." };
    }
  }
}
