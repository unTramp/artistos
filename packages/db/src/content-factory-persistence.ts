import { and, eq } from "drizzle-orm";
import { ContentFactoryPersistenceError, type FoundationEvidence } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { artistIdentities, auditEvents, eraIdentities, idempotencyRecords, outboxEvents, songs } from "./schema";
import { contentAngleRevisions, contentAngles } from "./content-factory-schema";

export type ContentFactoryTx = Parameters<Parameters<Stage0Database["transaction"]>[0]>[0];
export type ContentAngleRow = typeof contentAngles.$inferSelect;

const actorFields = (evidence: FoundationEvidence) => evidence.actorId ? { actorId: evidence.actorId } : {};

export const runContentFactoryIdempotent = async <T>(
  tx: ContentFactoryTx,
  artistId: string,
  evidence: FoundationEvidence,
  commandName: string,
  work: () => Promise<T>
): Promise<T> => {
  if (!evidence.idempotencyKey) return work();
  const actorScope = evidence.actorId ?? evidence.actorType;
  const scope = `ContentFactory:${commandName}:${artistId}:${actorScope}`;
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
    throw new ContentFactoryPersistenceError("IDEMPOTENCY_IN_PROGRESS");
  }

  const result = await work();
  await tx.update(idempotencyRecords).set({
    status: "SUCCESS",
    result: result as Record<string, unknown>,
    updatedAt: evidence.occurredAt
  }).where(eq(idempotencyRecords.id, claim.id));
  return result;
};

export const writeContentFactoryEvidence = async (
  tx: ContentFactoryTx,
  input: {
    artistId: string;
    aggregateType: string;
    aggregateId: string;
    aggregateVersion: number;
    eventType: string;
    payload: Record<string, unknown>;
    auditAction: string;
    entityType: string;
    entityId: string;
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
    entityType: input.entityType,
    entityId: input.entityId,
    traceId: input.evidence.traceId,
    metadata: { commandId: input.evidence.commandId },
    createdAt: input.evidence.occurredAt
  });
};

export const contentAngleSnapshot = (angle: ContentAngleRow): Record<string, unknown> => ({
  id: angle.id,
  songId: angle.songId,
  campaignId: angle.campaignId,
  identityVersionId: angle.identityVersionId,
  eraIdentityId: angle.eraIdentityId,
  title: angle.title,
  idea: angle.idea,
  pillar: angle.pillar,
  mode: angle.mode,
  goal: angle.goal,
  audience: angle.audience,
  platformTargets: angle.platformTargets,
  requiredAssets: angle.requiredAssets,
  learningValue: angle.learningValue,
  why: angle.why,
  identityFitRationale: angle.identityFitRationale,
  productionEffort: angle.productionEffort,
  sourceType: angle.sourceType,
  sourceProvenance: angle.sourceProvenance,
  status: angle.status,
  version: angle.version,
  rejectionReason: angle.rejectionReason,
  decisionNote: angle.decisionNote
});

export const appendContentAngleRevision = async (
  tx: ContentFactoryTx,
  angle: ContentAngleRow,
  revisionType: "CREATE" | "EDIT" | "APPROVE" | "REJECT" | "DEFER",
  evidence: FoundationEvidence
) => {
  await tx.insert(contentAngleRevisions).values({
    id: crypto.randomUUID(),
    artistId: angle.artistId,
    angleId: angle.id,
    revisionNumber: angle.version,
    revisionType,
    snapshot: contentAngleSnapshot(angle),
    ...(evidence.actorId ? { actorId: evidence.actorId } : {}),
    createdAt: evidence.occurredAt
  });
};

export const resolveCurrentIdentityContext = async (tx: ContentFactoryTx, artistId: string) => {
  const [identity] = await tx.select({ activeVersionId: artistIdentities.activeVersionId })
    .from(artistIdentities)
    .where(eq(artistIdentities.artistId, artistId))
    .limit(1);
  const identityVersionId = identity?.activeVersionId ?? null;
  if (!identityVersionId) return { identityVersionId: null, eraIdentityId: null };

  const [era] = await tx.select({ id: eraIdentities.id, identityVersionId: eraIdentities.identityVersionId })
    .from(eraIdentities)
    .where(and(eq(eraIdentities.artistId, artistId), eq(eraIdentities.status, "ACTIVE")))
    .limit(1);
  return { identityVersionId, eraIdentityId: era?.identityVersionId === identityVersionId ? era.id : null };
};

export const ensureContentFactorySong = async (tx: ContentFactoryTx, artistId: string, songId?: string) => {
  if (!songId) return;
  const [song] = await tx.select({ id: songs.id }).from(songs)
    .where(and(eq(songs.id, songId), eq(songs.artistId, artistId)))
    .limit(1);
  if (!song) throw new ContentFactoryPersistenceError("ANGLE_SONG_NOT_FOUND");
};
