import { and, eq } from "drizzle-orm";
import { LearningPersistenceError, type FoundationEvidence } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { auditEvents, idempotencyRecords, outboxEvents } from "./schema";

export type LearningTx = Parameters<Parameters<Stage0Database["transaction"]>[0]>[0];

const actorFields = (evidence: FoundationEvidence) => evidence.actorId ? { actorId: evidence.actorId } : {};

export const runLearningIdempotent = async <T>(tx: LearningTx, artistId: string, evidence: FoundationEvidence, commandName: string, work: () => Promise<T>): Promise<T> => {
  if (!evidence.idempotencyKey) return work();
  const actorScope = evidence.actorId ?? evidence.actorType;
  const scope = `Learning:${commandName}:${artistId}:${actorScope}`;
  const [claim] = await tx.insert(idempotencyRecords).values({ scope, key: evidence.idempotencyKey, commandName, artistId, status: "IN_PROGRESS", createdAt: evidence.occurredAt, updatedAt: evidence.occurredAt }).onConflictDoNothing().returning({ id: idempotencyRecords.id });
  if (!claim) {
    const [existing] = await tx.select({ status: idempotencyRecords.status, result: idempotencyRecords.result }).from(idempotencyRecords).where(and(eq(idempotencyRecords.scope, scope), eq(idempotencyRecords.key, evidence.idempotencyKey))).limit(1);
    if (existing?.status === "SUCCESS" && existing.result) return existing.result as T;
    throw new LearningPersistenceError("IDEMPOTENCY_IN_PROGRESS");
  }
  const result = await work();
  await tx.update(idempotencyRecords).set({ status: "SUCCESS", result: result as Record<string, unknown>, updatedAt: evidence.occurredAt }).where(eq(idempotencyRecords.id, claim.id));
  return result;
};

export const writeLearningEvidence = async (tx: LearningTx, input: { artistId: string; learningId: string; aggregateVersion: number; eventType: string; payload: Record<string, unknown>; auditAction: string; evidence: FoundationEvidence }) => {
  await tx.insert(outboxEvents).values({
    id: crypto.randomUUID(), artistId: input.artistId, eventType: input.eventType, aggregateType: "Learning", aggregateId: input.learningId,
    aggregateVersion: input.aggregateVersion, actorType: input.evidence.actorType, ...actorFields(input.evidence), correlationId: input.evidence.traceId,
    causationId: input.evidence.commandId, payloadVersion: 1, payload: input.payload, occurredAt: input.evidence.occurredAt, recordedAt: input.evidence.occurredAt
  });
  await tx.insert(auditEvents).values({
    id: crypto.randomUUID(), artistId: input.artistId, actorType: input.evidence.actorType, ...actorFields(input.evidence), action: input.auditAction,
    entityType: "Learning", entityId: input.learningId, traceId: input.evidence.traceId, metadata: { commandId: input.evidence.commandId, ...input.payload }, createdAt: input.evidence.occurredAt
  });
};
