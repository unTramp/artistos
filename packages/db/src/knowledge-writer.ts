import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import {
  KnowledgePersistenceError,
  type ArtistBrainSnapshotResult,
  type CandidateKnowledgeDestination,
  type CandidateKnowledgeResult,
  type FoundationEvidence,
  type KnowledgeWritePort,
  type ToneCorpusItemResult
} from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import {
  artistIdentities,
  artistIdentityVersions,
  auditEvents,
  eraIdentities,
  idempotencyRecords,
  outboxEvents
} from "./schema";
import {
  artistBrainKnowledgeItems,
  artistBrainSnapshots,
  candidateKnowledge,
  toneCorpusItems
} from "./knowledge-schema";

type KnowledgeTx = Parameters<Parameters<Stage0Database["transaction"]>[0]>[0];

const actorFields = (evidence: FoundationEvidence) => evidence.actorId ? { actorId: evidence.actorId } : {};

const runIdempotent = async <T>(
  tx: KnowledgeTx,
  artistId: string,
  evidence: FoundationEvidence,
  commandName: string,
  work: () => Promise<T>
): Promise<T> => {
  if (!evidence.idempotencyKey) return work();

  const actorScope = evidence.actorId ?? evidence.actorType;
  const scope = `Knowledge:${commandName}:${artistId}:${actorScope}`;
  const [claim] = await tx.insert(idempotencyRecords).values({
    scope,
    key: evidence.idempotencyKey,
    commandName,
    artistId,
    status: "IN_PROGRESS",
    createdAt: evidence.occurredAt,
    updatedAt: evidence.occurredAt
  }).onConflictDoNothing().returning({ id: idempotencyRecords.id });

  if (!claim) {
    const [existing] = await tx.select({ status: idempotencyRecords.status, result: idempotencyRecords.result })
      .from(idempotencyRecords)
      .where(and(eq(idempotencyRecords.scope, scope), eq(idempotencyRecords.key, evidence.idempotencyKey)))
      .limit(1);
    if (existing?.status === "SUCCESS" && existing.result) return existing.result as T;
    throw new KnowledgePersistenceError("IDEMPOTENCY_IN_PROGRESS");
  }

  const result = await work();
  await tx.update(idempotencyRecords).set({
    status: "SUCCESS",
    result: result as Record<string, unknown>,
    updatedAt: evidence.occurredAt
  }).where(eq(idempotencyRecords.id, claim.id));
  return result;
};

const writeEvidence = async (
  tx: KnowledgeTx,
  input: {
    artistId: string;
    aggregateType: string;
    aggregateId: string;
    aggregateVersion: number;
    eventType: string;
    payload: Record<string, unknown>;
    auditAction: string;
    evidence: FoundationEvidence;
  }
) => {
  await tx.insert(outboxEvents).values({
    id: crypto.randomUUID(),
    artistId: input.artistId,
    eventType: input.eventType,
    aggregateType: input.aggregateType,
    aggregateId: input.aggregateId,
    aggregateVersion: input.aggregateVersion,
    actorType: input.evidence.actorType,
    ...actorFields(input.evidence),
    correlationId: input.evidence.traceId,
    causationId: input.evidence.commandId,
    payloadVersion: 1,
    payload: input.payload,
    occurredAt: input.evidence.occurredAt,
    recordedAt: input.evidence.occurredAt
  });

  await tx.insert(auditEvents).values({
    id: crypto.randomUUID(),
    artistId: input.artistId,
    actorType: input.evidence.actorType,
    ...actorFields(input.evidence),
    action: input.auditAction,
    entityType: input.aggregateType,
    entityId: input.aggregateId,
    traceId: input.evidence.traceId,
    metadata: { commandId: input.evidence.commandId, ...input.payload },
    createdAt: input.evidence.occurredAt
  });
};

const candidateResult = (row: {
  id: string;
  status: string;
  destination: string;
  promotedEntityType: string | null;
  promotedEntityId: string | null;
  mergedIntoCandidateId: string | null;
}): CandidateKnowledgeResult => ({
  candidateId: row.id,
  status: row.status as CandidateKnowledgeResult["status"],
  destination: row.destination as CandidateKnowledgeDestination,
  promotedEntityType: row.promotedEntityType,
  promotedEntityId: row.promotedEntityId,
  mergedIntoCandidateId: row.mergedIntoCandidateId
});

export class PgKnowledgeWriter implements KnowledgeWritePort {
  constructor(private readonly db: Stage0Database) {}

  async addToneCorpusItem(request: Parameters<KnowledgeWritePort["addToneCorpusItem"]>[0]): Promise<ToneCorpusItemResult> {
    return this.db.transaction((tx) => runIdempotent(tx, request.artistId, request.evidence, "AddToneCorpusItem", async () => {
      await tx.insert(toneCorpusItems).values({
        id: request.itemId,
        artistId: request.artistId,
        textContent: request.command.textContent,
        label: request.command.label,
        sourceType: request.command.sourceType,
        ...(request.command.sourceReference ? { sourceReference: request.command.sourceReference } : {}),
        ...(request.command.language ? { language: request.command.language } : {}),
        isPrivate: request.command.isPrivate ?? false,
        ...(request.evidence.actorId ? { createdByActorId: request.evidence.actorId } : {}),
        createdAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      });

      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "ToneCorpusItem",
        aggregateId: request.itemId,
        aggregateVersion: 1,
        eventType: "ToneCorpusItemAdded",
        payload: { label: request.command.label, sourceType: request.command.sourceType, isPrivate: request.command.isPrivate ?? false },
        auditAction: "TONE_CORPUS_ITEM_ADDED",
        evidence: request.evidence
      });

      return { itemId: request.itemId, label: request.command.label, textContent: request.command.textContent };
    }));
  }

  async relabelToneCorpusItem(request: Parameters<KnowledgeWritePort["relabelToneCorpusItem"]>[0]): Promise<ToneCorpusItemResult> {
    return this.db.transaction((tx) => runIdempotent(tx, request.artistId, request.evidence, "RelabelToneCorpusItem", async () => {
      const [item] = await tx.select({ id: toneCorpusItems.id, label: toneCorpusItems.label, textContent: toneCorpusItems.textContent })
        .from(toneCorpusItems)
        .where(and(eq(toneCorpusItems.id, request.command.itemId), eq(toneCorpusItems.artistId, request.artistId)))
        .limit(1);
      if (!item) throw new KnowledgePersistenceError("TONE_ITEM_NOT_FOUND");

      await tx.update(toneCorpusItems).set({ label: request.command.label, updatedAt: request.evidence.occurredAt })
        .where(eq(toneCorpusItems.id, item.id));
      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "ToneCorpusItem",
        aggregateId: item.id,
        aggregateVersion: 1,
        eventType: "ToneCorpusItemRelabeled",
        payload: { previousLabel: item.label, label: request.command.label },
        auditAction: "TONE_CORPUS_ITEM_RELABELED",
        evidence: request.evidence
      });
      return { itemId: item.id, label: request.command.label, textContent: item.textContent };
    }));
  }

  async createCandidate(request: Parameters<KnowledgeWritePort["createCandidate"]>[0]): Promise<CandidateKnowledgeResult> {
    return this.db.transaction((tx) => runIdempotent(tx, request.artistId, request.evidence, "CreateCandidateKnowledge", async () => {
      await tx.insert(candidateKnowledge).values({
        id: request.candidateId,
        artistId: request.artistId,
        sourceType: request.command.sourceType,
        sourceId: request.command.sourceId,
        content: request.command.content,
        destination: request.command.destination,
        ...(request.command.destinationTargetId ? { destinationTargetId: request.command.destinationTargetId } : {}),
        confidenceMetadata: request.command.confidenceMetadata ?? {},
        status: "PENDING",
        createdAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      });
      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "CandidateKnowledge",
        aggregateId: request.candidateId,
        aggregateVersion: 1,
        eventType: "CandidateKnowledgeCreated",
        payload: { destination: request.command.destination, sourceType: request.command.sourceType, sourceId: request.command.sourceId },
        auditAction: "CANDIDATE_KNOWLEDGE_CREATED",
        evidence: request.evidence
      });
      return {
        candidateId: request.candidateId,
        status: "PENDING",
        destination: request.command.destination,
        promotedEntityType: null,
        promotedEntityId: null,
        mergedIntoCandidateId: null
      };
    }));
  }

  async acceptCandidate(request: Parameters<KnowledgeWritePort["acceptCandidate"]>[0]): Promise<CandidateKnowledgeResult> {
    return this.db.transaction((tx) => runIdempotent(tx, request.artistId, request.evidence, "AcceptCandidateKnowledge", async () => {
      const [candidate] = await tx.select().from(candidateKnowledge)
        .where(and(eq(candidateKnowledge.id, request.command.candidateId), eq(candidateKnowledge.artistId, request.artistId)))
        .limit(1);
      if (!candidate) throw new KnowledgePersistenceError("CANDIDATE_NOT_FOUND");
      if (candidate.status !== "PENDING") throw new KnowledgePersistenceError("CANDIDATE_NOT_PENDING");
      if (candidate.destination !== "ARTIST_BRAIN") throw new KnowledgePersistenceError("CANDIDATE_DESTINATION_BLOCKED");

      await tx.insert(artistBrainKnowledgeItems).values({
        id: request.knowledgeItemId,
        artistId: request.artistId,
        content: candidate.content,
        sourceCandidateId: candidate.id,
        sourceType: candidate.sourceType,
        sourceId: candidate.sourceId,
        ...(request.evidence.actorId ? { createdByActorId: request.evidence.actorId } : {}),
        createdAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      });

      const [updated] = await tx.update(candidateKnowledge).set({
        status: "ACCEPTED",
        promotedEntityType: "ArtistBrainKnowledgeItem",
        promotedEntityId: request.knowledgeItemId,
        resolvedByActorId: request.evidence.actorId ?? null,
        resolvedAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      }).where(eq(candidateKnowledge.id, candidate.id)).returning();

      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "CandidateKnowledge",
        aggregateId: candidate.id,
        aggregateVersion: 1,
        eventType: "CandidateKnowledgeAccepted",
        payload: { destination: candidate.destination, promotedEntityType: "ArtistBrainKnowledgeItem", promotedEntityId: request.knowledgeItemId },
        auditAction: "CANDIDATE_KNOWLEDGE_ACCEPTED",
        evidence: request.evidence
      });
      return candidateResult(updated!);
    }));
  }

  async rejectCandidate(request: Parameters<KnowledgeWritePort["rejectCandidate"]>[0]): Promise<CandidateKnowledgeResult> {
    return this.db.transaction((tx) => runIdempotent(tx, request.artistId, request.evidence, "RejectCandidateKnowledge", async () => {
      const [candidate] = await tx.select().from(candidateKnowledge)
        .where(and(eq(candidateKnowledge.id, request.command.candidateId), eq(candidateKnowledge.artistId, request.artistId)))
        .limit(1);
      if (!candidate) throw new KnowledgePersistenceError("CANDIDATE_NOT_FOUND");
      if (candidate.status !== "PENDING") throw new KnowledgePersistenceError("CANDIDATE_NOT_PENDING");

      const [updated] = await tx.update(candidateKnowledge).set({
        status: "REJECTED",
        resolutionReason: request.command.reason ?? null,
        resolvedByActorId: request.evidence.actorId ?? null,
        resolvedAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      }).where(eq(candidateKnowledge.id, candidate.id)).returning();
      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "CandidateKnowledge",
        aggregateId: candidate.id,
        aggregateVersion: 1,
        eventType: "CandidateKnowledgeRejected",
        payload: { destination: candidate.destination, reason: request.command.reason ?? null },
        auditAction: "CANDIDATE_KNOWLEDGE_REJECTED",
        evidence: request.evidence
      });
      return candidateResult(updated!);
    }));
  }

  async mergeCandidate(request: Parameters<KnowledgeWritePort["mergeCandidate"]>[0]): Promise<CandidateKnowledgeResult> {
    return this.db.transaction((tx) => runIdempotent(tx, request.artistId, request.evidence, "MergeCandidateKnowledge", async () => {
      if (request.command.candidateId === request.command.targetCandidateId) throw new KnowledgePersistenceError("CANDIDATE_MERGE_SELF");
      const [candidate] = await tx.select().from(candidateKnowledge)
        .where(and(eq(candidateKnowledge.id, request.command.candidateId), eq(candidateKnowledge.artistId, request.artistId)))
        .limit(1);
      if (!candidate) throw new KnowledgePersistenceError("CANDIDATE_NOT_FOUND");
      if (candidate.status !== "PENDING") throw new KnowledgePersistenceError("CANDIDATE_NOT_PENDING");
      const [target] = await tx.select({ id: candidateKnowledge.id }).from(candidateKnowledge)
        .where(and(eq(candidateKnowledge.id, request.command.targetCandidateId), eq(candidateKnowledge.artistId, request.artistId)))
        .limit(1);
      if (!target) throw new KnowledgePersistenceError("CANDIDATE_MERGE_TARGET_NOT_FOUND");

      const [updated] = await tx.update(candidateKnowledge).set({
        status: "MERGED",
        mergedIntoCandidateId: target.id,
        resolvedByActorId: request.evidence.actorId ?? null,
        resolvedAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      }).where(eq(candidateKnowledge.id, candidate.id)).returning();
      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "CandidateKnowledge",
        aggregateId: candidate.id,
        aggregateVersion: 1,
        eventType: "CandidateKnowledgeMerged",
        payload: { destination: candidate.destination, mergedIntoCandidateId: target.id },
        auditAction: "CANDIDATE_KNOWLEDGE_MERGED",
        evidence: request.evidence
      });
      return candidateResult(updated!);
    }));
  }

  async rebuildArtistBrain(request: Parameters<KnowledgeWritePort["rebuildArtistBrain"]>[0]): Promise<ArtistBrainSnapshotResult> {
    return this.db.transaction((tx) => runIdempotent(tx, request.artistId, request.evidence, "RebuildArtistBrain", async () => {
      const [identityRoot] = await tx.select({ activeVersionId: artistIdentities.activeVersionId })
        .from(artistIdentities).where(eq(artistIdentities.artistId, request.artistId)).limit(1);

      let identity: { identityVersionId: string; versionNumber: number; label: string | null } | null = null;
      if (identityRoot?.activeVersionId) {
        const [version] = await tx.select({
          id: artistIdentityVersions.id,
          versionNumber: artistIdentityVersions.versionNumber,
          label: artistIdentityVersions.label
        }).from(artistIdentityVersions)
          .where(and(eq(artistIdentityVersions.id, identityRoot.activeVersionId), eq(artistIdentityVersions.artistId, request.artistId)))
          .limit(1);
        if (version) identity = { identityVersionId: version.id, versionNumber: version.versionNumber, label: version.label };
      }

      const [activeEra] = await tx.select({ id: eraIdentities.id, name: eraIdentities.name, identityVersionId: eraIdentities.identityVersionId })
        .from(eraIdentities)
        .where(and(eq(eraIdentities.artistId, request.artistId), eq(eraIdentities.status, "ACTIVE")))
        .limit(1);

      const positiveTone = await tx.select({
        id: toneCorpusItems.id,
        textContent: toneCorpusItems.textContent,
        label: toneCorpusItems.label,
        sourceType: toneCorpusItems.sourceType,
        sourceReference: toneCorpusItems.sourceReference,
        language: toneCorpusItems.language,
        isPrivate: toneCorpusItems.isPrivate
      }).from(toneCorpusItems).where(and(
        eq(toneCorpusItems.artistId, request.artistId),
        inArray(toneCorpusItems.label, ["AUTHENTIC", "GOOD"]),
        isNull(toneCorpusItems.archivedAt)
      ));

      const approvedKnowledge = await tx.select({
        id: artistBrainKnowledgeItems.id,
        content: artistBrainKnowledgeItems.content,
        sourceCandidateId: artistBrainKnowledgeItems.sourceCandidateId,
        sourceType: artistBrainKnowledgeItems.sourceType,
        sourceId: artistBrainKnowledgeItems.sourceId
      }).from(artistBrainKnowledgeItems).where(and(
        eq(artistBrainKnowledgeItems.artistId, request.artistId),
        isNull(artistBrainKnowledgeItems.archivedAt)
      ));

      const [latest] = await tx.select({ versionNumber: artistBrainSnapshots.versionNumber })
        .from(artistBrainSnapshots)
        .where(eq(artistBrainSnapshots.artistId, request.artistId))
        .orderBy(desc(artistBrainSnapshots.versionNumber))
        .limit(1);
      const versionNumber = (latest?.versionNumber ?? 0) + 1;

      const payload = {
        identity,
        era: activeEra ? { eraId: activeEra.id, name: activeEra.name, identityVersionId: activeEra.identityVersionId } : null,
        approvedKnowledge,
        toneExamples: positiveTone,
        hardRules: [],
        validatedLearnings: []
      };
      const sourceRefs = [
        ...(identity ? [{ type: "ArtistIdentityVersion", id: identity.identityVersionId }] : []),
        ...(activeEra ? [{ type: "EraIdentity", id: activeEra.id }] : []),
        ...approvedKnowledge.map((item) => ({ type: "ArtistBrainKnowledgeItem", id: item.id })),
        ...positiveTone.map((item) => ({ type: "ToneCorpusItem", id: item.id }))
      ];

      await tx.insert(artistBrainSnapshots).values({
        id: request.snapshotId,
        artistId: request.artistId,
        versionNumber,
        payload,
        sourceRefs,
        ...(request.evidence.actorId ? { builtByActorId: request.evidence.actorId } : {}),
        builtAt: request.evidence.occurredAt,
        createdAt: request.evidence.occurredAt
      });
      await writeEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "ArtistBrainSnapshot",
        aggregateId: request.snapshotId,
        aggregateVersion: versionNumber,
        eventType: "ArtistBrainSnapshotRebuilt",
        payload: { versionNumber, sourceCount: sourceRefs.length },
        auditAction: "ARTIST_BRAIN_SNAPSHOT_REBUILT",
        evidence: request.evidence
      });
      return { snapshotId: request.snapshotId, versionNumber };
    }));
  }
}
