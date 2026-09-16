import { and, eq } from "drizzle-orm";
import {
  DecisionPersistenceError,
  type DecisionResult,
  type DecisionStatus,
  type DecisionWritePort
} from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { decisions, decisionStateHistory } from "./decision-memory-schema";
import { runDecisionIdempotent, writeDecisionEvidence } from "./decision-memory-persistence";

const resultFrom = (row: typeof decisions.$inferSelect): DecisionResult => ({
  decisionId: row.id,
  status: row.status as DecisionStatus,
  version: row.version
});

const allowedTransitions: Record<DecisionStatus, DecisionStatus[]> = {
  ACTIVE: ["UNDER_REVIEW", "REVERSED", "EXPIRED"],
  UNDER_REVIEW: ["ACTIVE", "REVERSED", "EXPIRED"],
  REVERSED: [],
  EXPIRED: []
};

const commandForStatus: Record<DecisionStatus, string> = {
  ACTIVE: "ReactivateDecision",
  UNDER_REVIEW: "MarkDecisionUnderReview",
  REVERSED: "ReverseDecision",
  EXPIRED: "ExpireDecision"
};

const eventForStatus: Record<DecisionStatus, string> = {
  ACTIVE: "DecisionReactivated",
  UNDER_REVIEW: "DecisionMarkedUnderReview",
  REVERSED: "DecisionReversed",
  EXPIRED: "DecisionExpired"
};

export class PgDecisionWriter implements DecisionWritePort {
  constructor(private readonly db: Stage0Database) {}

  async createDecision(request: Parameters<DecisionWritePort["createDecision"]>[0]): Promise<DecisionResult> {
    return this.db.transaction(async (tx) => runDecisionIdempotent(tx, request.artistId, request.evidence, "CreateDecision", async () => {
      const [created] = await tx.insert(decisions).values({
        id: request.decisionId,
        artistId: request.artistId,
        title: request.command.title,
        decision: request.command.decision,
        reason: request.command.reason,
        evidenceIds: request.command.evidenceIds ?? [],
        experimentIds: request.command.experimentIds ?? [],
        scope: request.command.scope,
        ...(request.command.reviewAt ? { reviewAt: new Date(request.command.reviewAt) } : {}),
        status: "ACTIVE",
        version: 1,
        ...(request.evidence.actorId ? { createdByActorId: request.evidence.actorId, updatedByActorId: request.evidence.actorId } : {}),
        createdAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      }).returning();
      if (!created) throw new Error("DECISION_NOT_CREATED");

      await tx.insert(decisionStateHistory).values({
        id: crypto.randomUUID(),
        artistId: request.artistId,
        decisionId: created.id,
        fromStatus: null,
        toStatus: "ACTIVE",
        actorType: request.evidence.actorType,
        ...(request.evidence.actorId ? { actorId: request.evidence.actorId } : {}),
        traceId: request.evidence.traceId,
        changedAt: request.evidence.occurredAt
      });

      await writeDecisionEvidence(tx, {
        artistId: request.artistId,
        decisionId: created.id,
        aggregateVersion: created.version,
        eventType: "DecisionCreated",
        payload: {
          scope: created.scope,
          reviewAt: created.reviewAt?.toISOString() ?? null,
          evidenceIds: created.evidenceIds,
          experimentIds: created.experimentIds
        },
        auditAction: "DECISION_CREATED",
        evidence: request.evidence
      });
      return resultFrom(created);
    }));
  }

  async transitionDecision(request: Parameters<DecisionWritePort["transitionDecision"]>[0]): Promise<DecisionResult> {
    const commandName = commandForStatus[request.toStatus];
    return this.db.transaction(async (tx) => runDecisionIdempotent(tx, request.artistId, request.evidence, commandName, async () => {
      const [current] = await tx.select().from(decisions)
        .where(and(eq(decisions.id, request.decisionId), eq(decisions.artistId, request.artistId)))
        .limit(1);
      if (!current) throw new DecisionPersistenceError("DECISION_NOT_FOUND");
      if (request.expectedVersion !== undefined && current.version !== request.expectedVersion) {
        throw new DecisionPersistenceError("DECISION_VERSION_CONFLICT");
      }
      const currentStatus = current.status as DecisionStatus;
      if (!allowedTransitions[currentStatus].includes(request.toStatus)) {
        throw new DecisionPersistenceError("DECISION_INVALID_TRANSITION");
      }

      const nextVersion = current.version + 1;
      const [updated] = await tx.update(decisions).set({
        status: request.toStatus,
        version: nextVersion,
        ...(request.evidence.actorId ? { updatedByActorId: request.evidence.actorId } : {}),
        updatedAt: request.evidence.occurredAt
      }).where(and(
        eq(decisions.id, request.decisionId),
        eq(decisions.artistId, request.artistId),
        eq(decisions.version, current.version)
      )).returning();
      if (!updated) throw new DecisionPersistenceError("DECISION_VERSION_CONFLICT");

      await tx.insert(decisionStateHistory).values({
        id: crypto.randomUUID(),
        artistId: request.artistId,
        decisionId: updated.id,
        fromStatus: currentStatus,
        toStatus: request.toStatus,
        ...(request.rationale ? { rationale: request.rationale } : {}),
        actorType: request.evidence.actorType,
        ...(request.evidence.actorId ? { actorId: request.evidence.actorId } : {}),
        traceId: request.evidence.traceId,
        changedAt: request.evidence.occurredAt
      });

      await writeDecisionEvidence(tx, {
        artistId: request.artistId,
        decisionId: updated.id,
        aggregateVersion: updated.version,
        eventType: eventForStatus[request.toStatus],
        payload: {
          fromStatus: currentStatus,
          toStatus: request.toStatus,
          rationale: request.rationale ?? null
        },
        auditAction: eventForStatus[request.toStatus].replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase(),
        evidence: request.evidence
      });
      return resultFrom(updated);
    }));
  }
}
