import type { CommandContext, ContentAngleResult, CreateContentAngleCommand, FoundationEvidence } from "@artist-os/core";
import { contentAngleProposalBatchSchema } from "@artist-os/ai";
import type { AgentRunArtifactView, PgAIProposalAngleWriter } from "@artist-os/db";

export interface AgentRunArtifactReader {
  getWithArtifact(artistId: string, agentRunId: string): Promise<AgentRunArtifactView | null>;
}

export type AcceptContentAngleProposalResult =
  | { status: "SUCCESS"; data: ContentAngleResult }
  | { status: "NOT_FOUND" | "CONFLICT" | "VALIDATION_ERROR"; code: string; message: string };

const evidenceFrom = (context: CommandContext): FoundationEvidence => ({
  actorType: context.actor.type,
  ...(context.actor.id ? { actorId: context.actor.id } : {}),
  commandId: context.commandId,
  traceId: context.traceId,
  occurredAt: context.requestedAt,
  ...(context.idempotencyKey ? { idempotencyKey: context.idempotencyKey } : {})
});

export class AcceptContentAngleProposalService {
  constructor(
    private readonly runReader: AgentRunArtifactReader,
    private readonly writer: PgAIProposalAngleWriter,
    private readonly idFactory = () => globalThis.crypto.randomUUID()
  ) {}

  async execute(input: { agentRunId: string; proposalIndex: number }, context: CommandContext): Promise<AcceptContentAngleProposalResult> {
    if (context.actor.type !== "USER" || !context.actor.id) return { status: "CONFLICT", code: "USER_REQUIRED", message: "An authenticated user is required." };
    const view = await this.runReader.getWithArtifact(context.artistId, input.agentRunId);
    if (!view) return { status: "NOT_FOUND", code: "AGENT_RUN_NOT_FOUND", message: "Agent run was not found." };
    if (view.run.status !== "SUCCEEDED" || !view.artifact || view.artifact.artifactType !== "CONTENT_ANGLE_PROPOSALS") {
      return { status: "CONFLICT", code: "AGENT_RUN_HAS_NO_ACCEPTABLE_PROPOSALS", message: "This AgentRun has no successful Content Angle proposal artifact." };
    }

    const parsed = contentAngleProposalBatchSchema.safeParse(view.artifact.content);
    if (!parsed.success) return { status: "CONFLICT", code: "AGENT_ARTIFACT_SCHEMA_INVALID", message: "Stored proposal artifact no longer matches the expected schema." };
    const proposal = parsed.data.proposals[input.proposalIndex];
    if (!proposal) return { status: "VALIDATION_ERROR", code: "PROPOSAL_INDEX_INVALID", message: "Proposal index is outside the stored proposal batch." };

    const refs = Array.isArray(view.run.contextManifest.sourceReferences)
      ? view.run.contextManifest.sourceReferences as Array<{ entityType?: unknown; entityId?: unknown }>
      : [];
    const songRef = refs.find((ref) => ref.entityType === "Song" && typeof ref.entityId === "string");
    const command: CreateContentAngleCommand = {
      ...(songRef && typeof songRef.entityId === "string" ? { songId: songRef.entityId } : {}),
      title: proposal.title,
      idea: proposal.idea,
      pillar: proposal.pillar,
      mode: proposal.mode,
      goal: proposal.goal,
      audience: proposal.audience,
      platformTargets: proposal.platformTargets,
      requiredAssets: proposal.requiredAssets,
      learningValue: proposal.learningValue,
      why: proposal.why,
      identityFitRationale: proposal.identityFitRationale,
      productionEffort: proposal.productionEffort
    };

    const data = await this.writer.createDraft({
      artistId: context.artistId,
      angleId: this.idFactory(),
      command,
      provenance: {
        agentRunId: view.run.id,
        artifactRef: view.artifact.id,
        proposalIndex: input.proposalIndex,
        promptVersion: view.run.configurationVersionId
      },
      evidence: evidenceFrom(context)
    });
    return { status: "SUCCESS", data };
  }
}
