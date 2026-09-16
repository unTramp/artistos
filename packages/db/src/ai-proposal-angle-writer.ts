import type { ContentAngleResult, CreateContentAngleCommand, FoundationEvidence } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { contentAngles } from "./content-factory-schema";
import {
  appendContentAngleRevision,
  ensureContentFactorySong,
  resolveCurrentIdentityContext,
  runContentFactoryIdempotent,
  writeContentFactoryEvidence
} from "./content-factory-persistence";

export interface AIProposalProvenance {
  agentRunId: string;
  artifactRef: string;
  proposalIndex: number;
  promptVersion: string;
}

export class PgAIProposalAngleWriter {
  constructor(private readonly db: Stage0Database) {}

  async createDraft(input: {
    artistId: string;
    angleId: string;
    command: CreateContentAngleCommand;
    provenance: AIProposalProvenance;
    evidence: FoundationEvidence;
  }): Promise<ContentAngleResult> {
    return this.db.transaction(async (tx) => runContentFactoryIdempotent(tx, input.artistId, input.evidence, "AcceptAIContentAngleProposal", async () => {
      await ensureContentFactorySong(tx, input.artistId, input.command.songId);
      const identity = await resolveCurrentIdentityContext(tx, input.artistId);
      const sourceProvenance = {
        commandId: input.evidence.commandId,
        agentRunId: input.provenance.agentRunId,
        artifactRef: input.provenance.artifactRef,
        proposalIndex: input.provenance.proposalIndex,
        promptVersion: input.provenance.promptVersion
      };
      const [angle] = await tx.insert(contentAngles).values({
        id: input.angleId,
        artistId: input.artistId,
        ...(input.command.songId ? { songId: input.command.songId } : {}),
        ...(input.command.campaignId ? { campaignId: input.command.campaignId } : {}),
        ...(identity.identityVersionId ? { identityVersionId: identity.identityVersionId } : {}),
        ...(identity.eraIdentityId ? { eraIdentityId: identity.eraIdentityId } : {}),
        title: input.command.title,
        idea: input.command.idea,
        pillar: input.command.pillar,
        mode: input.command.mode,
        goal: input.command.goal,
        audience: input.command.audience,
        platformTargets: input.command.platformTargets,
        requiredAssets: input.command.requiredAssets,
        learningValue: input.command.learningValue,
        why: input.command.why,
        identityFitRationale: input.command.identityFitRationale,
        productionEffort: input.command.productionEffort,
        sourceType: "AI_PROPOSAL",
        sourceProvenance,
        originalSnapshot: { ...input.command, ...identity, sourceType: "AI_PROPOSAL", sourceProvenance, status: "DRAFT", version: 1 },
        status: "DRAFT",
        version: 1,
        ...(input.evidence.actorId ? { createdByActorId: input.evidence.actorId } : {}),
        createdAt: input.evidence.occurredAt,
        updatedAt: input.evidence.occurredAt
      }).returning();
      if (!angle) throw new Error("AI_CONTENT_ANGLE_NOT_CREATED");

      await appendContentAngleRevision(tx, angle, "CREATE", input.evidence);
      await writeContentFactoryEvidence(tx, {
        artistId: input.artistId,
        aggregateType: "ContentAngle",
        aggregateId: angle.id,
        aggregateVersion: angle.version,
        eventType: "AIContentAngleProposalAcceptedAsDraft",
        payload: { agentRunId: input.provenance.agentRunId, artifactRef: input.provenance.artifactRef, proposalIndex: input.provenance.proposalIndex },
        auditAction: "AI_CONTENT_ANGLE_PROPOSAL_ACCEPTED_AS_DRAFT",
        entityType: "ContentAngle",
        entityId: angle.id,
        evidence: input.evidence
      });

      return {
        angleId: angle.id,
        status: angle.status as ContentAngleResult["status"],
        version: angle.version,
        identityVersionId: angle.identityVersionId,
        eraIdentityId: angle.eraIdentityId
      };
    }));
  }
}
