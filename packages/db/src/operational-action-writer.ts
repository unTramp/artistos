import { and, eq } from "drizzle-orm";
import {
  OperationalActionPersistenceError,
  type OperationalActionResult,
  type OperationalActionStatus,
  type OperationalActionWritePort
} from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { operationalActions } from "./operational-action-schema";
import { runOperationalActionIdempotent, writeOperationalActionEvidence } from "./operational-action-persistence";

const resultFrom = (row: typeof operationalActions.$inferSelect): OperationalActionResult => ({
  actionId: row.id,
  status: row.status as OperationalActionStatus,
  version: row.version,
  completedAt: row.completedAt
});

const allowedTransitions: Record<OperationalActionStatus, OperationalActionStatus[]> = {
  OPEN: ["IN_PROGRESS", "BLOCKED", "DONE", "SKIPPED", "EXPIRED"],
  IN_PROGRESS: ["BLOCKED", "DONE", "SKIPPED", "EXPIRED"],
  BLOCKED: ["OPEN", "DONE", "SKIPPED", "EXPIRED"],
  DONE: ["OPEN"],
  SKIPPED: ["OPEN"],
  EXPIRED: ["OPEN"]
};

const commandForStatus: Record<OperationalActionStatus, string> = {
  OPEN: "ReopenOperationalAction",
  IN_PROGRESS: "StartOperationalAction",
  BLOCKED: "BlockOperationalAction",
  DONE: "CompleteOperationalAction",
  SKIPPED: "SkipOperationalAction",
  EXPIRED: "ExpireOperationalAction"
};

const eventForStatus: Record<OperationalActionStatus, string> = {
  OPEN: "OperationalActionReopened",
  IN_PROGRESS: "OperationalActionStarted",
  BLOCKED: "OperationalActionBlocked",
  DONE: "OperationalActionCompleted",
  SKIPPED: "OperationalActionSkipped",
  EXPIRED: "OperationalActionExpired"
};

export class PgOperationalActionWriter implements OperationalActionWritePort {
  constructor(private readonly db: Stage0Database) {}

  async createAction(request: Parameters<OperationalActionWritePort["createAction"]>[0]): Promise<OperationalActionResult> {
    return this.db.transaction(async (tx) => runOperationalActionIdempotent(tx, request.artistId, request.evidence, "CreateOperationalAction", async () => {
      const [created] = await tx.insert(operationalActions).values({
        id: request.actionId,
        artistId: request.artistId,
        sourceDomain: request.command.sourceDomain,
        sourceEntityType: request.command.sourceEntityType,
        sourceEntityId: request.command.sourceEntityId,
        ...(request.command.platform ? { platform: request.command.platform } : {}),
        title: request.command.title,
        ...(request.command.description ? { description: request.command.description } : {}),
        actionType: request.command.actionType,
        status: "OPEN",
        priority: request.command.priority ?? "NORMAL",
        ...(request.command.dueAt ? { dueAt: new Date(request.command.dueAt) } : {}),
        ...(request.command.notBefore ? { notBefore: new Date(request.command.notBefore) } : {}),
        executionMode: request.command.executionMode,
        ...(request.command.externalUrl ? { externalUrl: request.command.externalUrl } : {}),
        ...(request.command.evidenceRef ? { evidenceRef: request.command.evidenceRef } : {}),
        version: 1,
        ...(request.evidence.actorId ? { createdByActorId: request.evidence.actorId, updatedByActorId: request.evidence.actorId } : {}),
        createdAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      }).returning();
      if (!created) throw new Error("OPERATIONAL_ACTION_NOT_CREATED");
      await writeOperationalActionEvidence(tx, {
        artistId: request.artistId,
        actionId: created.id,
        aggregateVersion: created.version,
        eventType: "OperationalActionCreated",
        payload: {
          sourceDomain: created.sourceDomain,
          sourceEntityType: created.sourceEntityType,
          sourceEntityId: created.sourceEntityId,
          actionType: created.actionType,
          priority: created.priority,
          executionMode: created.executionMode
        },
        auditAction: "OPERATIONAL_ACTION_CREATED",
        evidence: request.evidence
      });
      return resultFrom(created);
    }));
  }

  async transitionAction(request: Parameters<OperationalActionWritePort["transitionAction"]>[0]): Promise<OperationalActionResult> {
    const commandName = commandForStatus[request.toStatus];
    return this.db.transaction(async (tx) => runOperationalActionIdempotent(tx, request.artistId, request.evidence, commandName, async () => {
      const [current] = await tx.select().from(operationalActions)
        .where(and(eq(operationalActions.id, request.actionId), eq(operationalActions.artistId, request.artistId)))
        .limit(1);
      if (!current) throw new OperationalActionPersistenceError("OPERATIONAL_ACTION_NOT_FOUND");
      if (request.expectedVersion !== undefined && current.version !== request.expectedVersion) throw new OperationalActionPersistenceError("OPERATIONAL_ACTION_VERSION_CONFLICT");
      const currentStatus = current.status as OperationalActionStatus;
      if (!allowedTransitions[currentStatus].includes(request.toStatus)) throw new OperationalActionPersistenceError("OPERATIONAL_ACTION_INVALID_TRANSITION");
      if (request.toStatus === "DONE" && request.evidence.actorType !== "USER" && !request.completionEvidenceRef) {
        throw new OperationalActionPersistenceError("OPERATIONAL_ACTION_COMPLETION_EVIDENCE_REQUIRED");
      }
      if (request.toStatus === "DONE" && request.evidence.actorType === "USER" && !request.evidence.actorId) {
        throw new OperationalActionPersistenceError("OPERATIONAL_ACTION_COMPLETION_EVIDENCE_REQUIRED");
      }

      const nextVersion = current.version + 1;
      const [updated] = await tx.update(operationalActions).set({
        status: request.toStatus,
        version: nextVersion,
        stateReason: request.reason ?? null,
        completedAt: request.toStatus === "DONE" ? request.evidence.occurredAt : null,
        ...(request.completionEvidenceRef ? { evidenceRef: request.completionEvidenceRef } : {}),
        ...(request.evidence.actorId ? { updatedByActorId: request.evidence.actorId } : {}),
        updatedAt: request.evidence.occurredAt
      }).where(and(eq(operationalActions.id, request.actionId), eq(operationalActions.artistId, request.artistId), eq(operationalActions.version, current.version))).returning();
      if (!updated) throw new OperationalActionPersistenceError("OPERATIONAL_ACTION_VERSION_CONFLICT");

      await writeOperationalActionEvidence(tx, {
        artistId: request.artistId,
        actionId: updated.id,
        aggregateVersion: updated.version,
        eventType: eventForStatus[request.toStatus],
        payload: {
          fromStatus: currentStatus,
          toStatus: request.toStatus,
          reason: request.reason ?? null,
          completionEvidenceRef: request.completionEvidenceRef ?? null
        },
        auditAction: eventForStatus[request.toStatus].replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase(),
        evidence: request.evidence
      });
      return resultFrom(updated);
    }));
  }
}
