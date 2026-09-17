import { and, eq } from "drizzle-orm";
import {
  LearningPersistenceError,
  type LearningResult,
  type LearningStatus,
  type LearningWritePort
} from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { learnings, learningStateHistory } from "./learning-schema";
import { runLearningIdempotent, writeLearningEvidence } from "./learning-persistence";

const resultFrom = (row: typeof learnings.$inferSelect): LearningResult => ({ learningId: row.id, status: row.status as LearningStatus, version: row.version });

const allowedTransitions: Record<LearningStatus, LearningStatus[]> = {
  CANDIDATE: ["TESTING", "DEPRECATED"],
  TESTING: ["VALIDATED", "DEPRECATED"],
  VALIDATED: ["STALE", "DEPRECATED"],
  STALE: ["TESTING", "DEPRECATED"],
  DEPRECATED: []
};

const commandForStatus: Record<LearningStatus, string> = {
  CANDIDATE: "CreateLearning",
  TESTING: "StartLearningTest",
  VALIDATED: "PromoteLearning",
  STALE: "MarkLearningStale",
  DEPRECATED: "DeprecateLearning"
};

const eventForStatus: Record<LearningStatus, string> = {
  CANDIDATE: "LearningCreated",
  TESTING: "LearningTestingStarted",
  VALIDATED: "LearningValidated",
  STALE: "LearningMarkedStale",
  DEPRECATED: "LearningDeprecated"
};

export class PgLearningWriter implements LearningWritePort {
  constructor(private readonly db: Stage0Database) {}

  async createLearning(request: Parameters<LearningWritePort["createLearning"]>[0]): Promise<LearningResult> {
    return this.db.transaction(async (tx) => runLearningIdempotent(tx, request.artistId, request.evidence, "CreateLearning", async () => {
      const [created] = await tx.insert(learnings).values({
        id: request.learningId,
        artistId: request.artistId,
        statement: request.command.statement,
        scope: request.command.scope,
        confidence: request.command.confidence,
        confidenceRationale: request.command.confidenceRationale,
        references: request.command.references ?? [],
        ...(request.command.freshUntil ? { freshUntil: new Date(request.command.freshUntil) } : {}),
        status: "CANDIDATE",
        version: 1,
        ...(request.evidence.actorId ? { createdByActorId: request.evidence.actorId, updatedByActorId: request.evidence.actorId } : {}),
        createdAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      }).returning();
      if (!created) throw new Error("LEARNING_NOT_CREATED");
      await tx.insert(learningStateHistory).values({
        id: crypto.randomUUID(), artistId: request.artistId, learningId: created.id, fromStatus: null, toStatus: "CANDIDATE",
        actorType: request.evidence.actorType, ...(request.evidence.actorId ? { actorId: request.evidence.actorId } : {}), traceId: request.evidence.traceId, changedAt: request.evidence.occurredAt
      });
      await writeLearningEvidence(tx, {
        artistId: request.artistId, learningId: created.id, aggregateVersion: 1, eventType: "LearningCreated",
        payload: { scope: created.scope, confidence: created.confidence, references: created.references, freshUntil: created.freshUntil?.toISOString() ?? null },
        auditAction: "LEARNING_CREATED", evidence: request.evidence
      });
      return resultFrom(created);
    }));
  }

  async transitionLearning(request: Parameters<LearningWritePort["transitionLearning"]>[0]): Promise<LearningResult> {
    const commandName = commandForStatus[request.toStatus];
    return this.db.transaction(async (tx) => runLearningIdempotent(tx, request.artistId, request.evidence, commandName, async () => {
      const [current] = await tx.select().from(learnings).where(and(eq(learnings.id, request.learningId), eq(learnings.artistId, request.artistId))).limit(1);
      if (!current) throw new LearningPersistenceError("LEARNING_NOT_FOUND");
      if (request.expectedVersion !== undefined && current.version !== request.expectedVersion) throw new LearningPersistenceError("LEARNING_VERSION_CONFLICT");
      const currentStatus = current.status as LearningStatus;
      if (!allowedTransitions[currentStatus].includes(request.toStatus)) throw new LearningPersistenceError("LEARNING_INVALID_TRANSITION");

      const nextVersion = current.version + 1;
      const [updated] = await tx.update(learnings).set({
        status: request.toStatus,
        version: nextVersion,
        ...(request.evidence.actorId ? { updatedByActorId: request.evidence.actorId } : {}),
        updatedAt: request.evidence.occurredAt
      }).where(and(eq(learnings.id, request.learningId), eq(learnings.artistId, request.artistId), eq(learnings.version, current.version))).returning();
      if (!updated) throw new LearningPersistenceError("LEARNING_VERSION_CONFLICT");

      await tx.insert(learningStateHistory).values({
        id: crypto.randomUUID(), artistId: request.artistId, learningId: updated.id, fromStatus: currentStatus, toStatus: request.toStatus,
        ...(request.rationale ? { rationale: request.rationale } : {}), actorType: request.evidence.actorType,
        ...(request.evidence.actorId ? { actorId: request.evidence.actorId } : {}), traceId: request.evidence.traceId, changedAt: request.evidence.occurredAt
      });
      await writeLearningEvidence(tx, {
        artistId: request.artistId, learningId: updated.id, aggregateVersion: updated.version, eventType: eventForStatus[request.toStatus],
        payload: { fromStatus: currentStatus, toStatus: request.toStatus, rationale: request.rationale ?? null },
        auditAction: eventForStatus[request.toStatus].replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase(), evidence: request.evidence
      });
      return resultFrom(updated);
    }));
  }
}
