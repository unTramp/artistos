import { and, desc, eq, sql } from "drizzle-orm";
import {
  ContentExecutionPersistenceError,
  type ContentExecutionRevisionResult,
  type ContentExecutionSnapshot,
  type ContentExecutionWritePort
} from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { contentUnits } from "./content-factory-schema";
import { contentExecutionRevisions } from "./content-execution-schema";
import { runContentFactoryIdempotent, writeContentFactoryEvidence } from "./content-factory-persistence";

const resultFrom = (row: typeof contentExecutionRevisions.$inferSelect): ContentExecutionRevisionResult => ({
  revisionId: row.id,
  contentUnitId: row.contentUnitId,
  revisionNumber: row.revisionNumber,
  status: row.status as ContentExecutionRevisionResult["status"]
});

export class PgContentExecutionWriter implements ContentExecutionWritePort {
  constructor(private readonly db: Stage0Database) {}

  async createRevision(request: Parameters<ContentExecutionWritePort["createRevision"]>[0]): Promise<ContentExecutionRevisionResult> {
    return this.db.transaction(async (tx) => runContentFactoryIdempotent(tx, request.artistId, request.evidence, "CreateContentExecutionRevision", async () => {
      await tx.execute(sql`select id from ${contentUnits} where ${contentUnits.id} = ${request.command.contentUnitId} and ${contentUnits.artistId} = ${request.artistId} for update`);
      const [unit] = await tx.select({
        id: contentUnits.id,
        identityVersionId: contentUnits.identityVersionId,
        eraIdentityId: contentUnits.eraIdentityId
      }).from(contentUnits).where(and(eq(contentUnits.id, request.command.contentUnitId), eq(contentUnits.artistId, request.artistId))).limit(1);
      if (!unit) throw new ContentExecutionPersistenceError("CONTENT_UNIT_NOT_FOUND");

      const [latest] = await tx.select({ revisionNumber: contentExecutionRevisions.revisionNumber })
        .from(contentExecutionRevisions)
        .where(eq(contentExecutionRevisions.contentUnitId, unit.id))
        .orderBy(desc(contentExecutionRevisions.revisionNumber))
        .limit(1);
      const revisionNumber = (latest?.revisionNumber ?? 0) + 1;
      const snapshot: ContentExecutionSnapshot = {
        schemaVersion: 1,
        format: request.command.format,
        productionIntent: request.command.productionIntent,
        ...(request.command.hookType ? { hookType: request.command.hookType } : {}),
        ...(request.command.hookText ? { hookText: request.command.hookText } : {}),
        structure: request.command.structure,
        scriptOrPerformanceConcept: request.command.scriptOrPerformanceConcept,
        shotList: request.command.shotList,
        editBrief: request.command.editBrief,
        ...(request.command.caption ? { caption: request.command.caption } : {}),
        ...(request.command.cta ? { cta: request.command.cta } : {}),
        platformNotes: request.command.platformNotes,
        feasibilityNotes: request.command.feasibilityNotes,
        ...(request.command.fallbackPlan ? { fallbackPlan: request.command.fallbackPlan } : {}),
        rightsStatus: "UNKNOWN"
      };

      const [revision] = await tx.insert(contentExecutionRevisions).values({
        id: request.revisionId,
        artistId: request.artistId,
        contentUnitId: unit.id,
        revisionNumber,
        status: "DRAFT",
        sourceType: request.sourceType,
        format: request.command.format,
        productionIntent: request.command.productionIntent,
        identityVersionId: unit.identityVersionId,
        ...(unit.eraIdentityId ? { eraIdentityId: unit.eraIdentityId } : {}),
        snapshot,
        sourceProvenance: { commandId: request.evidence.commandId },
        ...(request.evidence.actorId ? { createdByActorId: request.evidence.actorId } : {}),
        createdAt: request.evidence.occurredAt
      }).returning();
      if (!revision) throw new Error("CONTENT_EXECUTION_REVISION_NOT_CREATED");

      await writeContentFactoryEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "ContentExecutionRevision",
        aggregateId: revision.id,
        aggregateVersion: revision.revisionNumber,
        eventType: "ContentExecutionRevisionCreated",
        payload: { contentUnitId: unit.id, revisionNumber, sourceType: revision.sourceType, identityVersionId: revision.identityVersionId, eraIdentityId: revision.eraIdentityId },
        auditAction: "CONTENT_EXECUTION_REVISION_CREATED",
        entityType: "ContentExecutionRevision",
        entityId: revision.id,
        evidence: request.evidence
      });
      return resultFrom(revision);
    }));
  }

  async approveRevision(request: Parameters<ContentExecutionWritePort["approveRevision"]>[0]): Promise<ContentExecutionRevisionResult> {
    return this.db.transaction(async (tx) => runContentFactoryIdempotent(tx, request.artistId, request.evidence, "ApproveContentExecutionRevision", async () => {
      const [revision] = await tx.select().from(contentExecutionRevisions)
        .where(and(eq(contentExecutionRevisions.id, request.command.revisionId), eq(contentExecutionRevisions.artistId, request.artistId)))
        .limit(1);
      if (!revision) throw new ContentExecutionPersistenceError("EXECUTION_REVISION_NOT_FOUND");
      if (revision.status !== "DRAFT") throw new ContentExecutionPersistenceError("EXECUTION_REVISION_NOT_REVIEWABLE");

      await tx.update(contentExecutionRevisions).set({
        status: "SUPERSEDED",
        decisionReason: `Superseded by revision ${revision.revisionNumber}`,
        ...(request.evidence.actorId ? { decidedByActorId: request.evidence.actorId } : {}),
        decidedAt: request.evidence.occurredAt
      }).where(and(
        eq(contentExecutionRevisions.contentUnitId, revision.contentUnitId),
        eq(contentExecutionRevisions.status, "APPROVED")
      ));

      const [approved] = await tx.update(contentExecutionRevisions).set({
        status: "APPROVED",
        decisionReason: null,
        ...(request.evidence.actorId ? { decidedByActorId: request.evidence.actorId } : {}),
        decidedAt: request.evidence.occurredAt
      }).where(eq(contentExecutionRevisions.id, revision.id)).returning();
      if (!approved) throw new Error("CONTENT_EXECUTION_REVISION_NOT_APPROVED");

      await writeContentFactoryEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "ContentExecutionRevision",
        aggregateId: approved.id,
        aggregateVersion: approved.revisionNumber,
        eventType: "ContentExecutionRevisionApproved",
        payload: { contentUnitId: approved.contentUnitId, revisionNumber: approved.revisionNumber },
        auditAction: "CONTENT_EXECUTION_REVISION_APPROVED",
        entityType: "ContentExecutionRevision",
        entityId: approved.id,
        evidence: request.evidence
      });
      return resultFrom(approved);
    }));
  }

  async rejectRevision(request: Parameters<ContentExecutionWritePort["rejectRevision"]>[0]): Promise<ContentExecutionRevisionResult> {
    return this.db.transaction(async (tx) => runContentFactoryIdempotent(tx, request.artistId, request.evidence, "RejectContentExecutionRevision", async () => {
      const [revision] = await tx.select().from(contentExecutionRevisions)
        .where(and(eq(contentExecutionRevisions.id, request.command.revisionId), eq(contentExecutionRevisions.artistId, request.artistId)))
        .limit(1);
      if (!revision) throw new ContentExecutionPersistenceError("EXECUTION_REVISION_NOT_FOUND");
      if (revision.status !== "DRAFT") throw new ContentExecutionPersistenceError("EXECUTION_REVISION_NOT_REVIEWABLE");

      const [rejected] = await tx.update(contentExecutionRevisions).set({
        status: "REJECTED",
        decisionReason: request.command.reason,
        ...(request.evidence.actorId ? { decidedByActorId: request.evidence.actorId } : {}),
        decidedAt: request.evidence.occurredAt
      }).where(eq(contentExecutionRevisions.id, revision.id)).returning();
      if (!rejected) throw new Error("CONTENT_EXECUTION_REVISION_NOT_REJECTED");

      await writeContentFactoryEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "ContentExecutionRevision",
        aggregateId: rejected.id,
        aggregateVersion: rejected.revisionNumber,
        eventType: "ContentExecutionRevisionRejected",
        payload: { contentUnitId: rejected.contentUnitId, revisionNumber: rejected.revisionNumber, reason: request.command.reason },
        auditAction: "CONTENT_EXECUTION_REVISION_REJECTED",
        entityType: "ContentExecutionRevision",
        entityId: rejected.id,
        evidence: request.evidence
      });
      return resultFrom(rejected);
    }));
  }
}
