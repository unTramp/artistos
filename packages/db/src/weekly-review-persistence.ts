import { and, eq } from "drizzle-orm";
import { WeeklyReviewPersistenceError, type FoundationEvidence } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { auditEvents, idempotencyRecords, outboxEvents } from "./schema";

export type WeeklyReviewTx = Parameters<Parameters<Stage0Database["transaction"]>[0]>[0];

const actorFields = (evidence: FoundationEvidence) => evidence.actorId ? { actorId: evidence.actorId } : {};

export const runWeeklyReviewIdempotent = async <T>(
  tx: WeeklyReviewTx,
  artistId: string,
  evidence: FoundationEvidence,
  work: () => Promise<T>
): Promise<T> => {
  if (!evidence.idempotencyKey) return work();
  const actorScope = evidence.actorId ?? evidence.actorType;
  const scope = `WeeklyReview:CreateWeeklyReview:${artistId}:${actorScope}`;
  const [claim] = await tx.insert(idempotencyRecords).values({
    scope,
    key: evidence.idempotencyKey,
    commandName: "CreateWeeklyReview",
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
    throw new WeeklyReviewPersistenceError("IDEMPOTENCY_IN_PROGRESS");
  }

  const result = await work();
  await tx.update(idempotencyRecords).set({
    status: "SUCCESS",
    result: result as Record<string, unknown>,
    updatedAt: evidence.occurredAt
  }).where(eq(idempotencyRecords.id, claim.id));
  return result;
};

export const writeWeeklyReviewEvidence = async (tx: WeeklyReviewTx, input: {
  artistId: string;
  weeklyReviewId: string;
  aggregateVersion: number;
  payload: Record<string, unknown>;
  evidence: FoundationEvidence;
}) => {
  await tx.insert(outboxEvents).values({
    id: crypto.randomUUID(),
    artistId: input.artistId,
    eventType: "WeeklyReviewGenerated",
    aggregateType: "WeeklyReview",
    aggregateId: input.weeklyReviewId,
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
    action: "WEEKLY_REVIEW_GENERATED",
    entityType: "WeeklyReview",
    entityId: input.weeklyReviewId,
    traceId: input.evidence.traceId,
    metadata: { commandId: input.evidence.commandId, ...input.payload },
    createdAt: input.evidence.occurredAt
  });
};
