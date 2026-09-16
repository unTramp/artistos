import { and, desc, eq, sql } from "drizzle-orm";
import {
  ContentFactoryPersistenceError,
  type ContentAngleResult,
  type ContentFactoryWritePort,
  type ContentUnitResult,
  type ContentUnitStatus
} from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { artistIdentityVersions, artists, eraIdentities, songs } from "./schema";
import { contentAngles, contentUnits, contentUnitStatusHistory } from "./content-factory-schema";
import {
  appendContentAngleRevision,
  ensureContentFactorySong,
  resolveCurrentIdentityContext,
  runContentFactoryIdempotent,
  writeContentFactoryEvidence
} from "./content-factory-persistence";

const angleResult = (angle: typeof contentAngles.$inferSelect): ContentAngleResult => ({
  angleId: angle.id,
  status: angle.status as ContentAngleResult["status"],
  version: angle.version,
  identityVersionId: angle.identityVersionId,
  eraIdentityId: angle.eraIdentityId
});

const reviewable = (status: string) => status === "DRAFT" || status === "DEFERRED";
const slug = (value: string) => value.normalize("NFKD").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toUpperCase().slice(0, 24);

const canonicalNext: Partial<Record<ContentUnitStatus, ContentUnitStatus[]>> = {
  IDEA: ["APPROVED", "REJECTED", "BLOCKED", "PAUSED"],
  APPROVED: ["SCRIPT_READY", "REJECTED", "BLOCKED", "PAUSED", "ARCHIVED"],
  SCRIPT_READY: ["TO_SHOOT", "BLOCKED", "PAUSED", "ARCHIVED"],
  TO_SHOOT: ["SHOT", "BLOCKED", "PAUSED"],
  SHOT: ["EDITING", "BLOCKED", "PAUSED"],
  EDITING: ["REVIEW", "BLOCKED", "PAUSED"],
  REVIEW: ["READY", "EDITING", "REJECTED", "BLOCKED", "PAUSED"],
  READY: ["SCHEDULED", "BLOCKED", "PAUSED", "ARCHIVED"],
  SCHEDULED: ["PUBLISHED", "READY", "BLOCKED", "PAUSED"],
  PUBLISHED: ["MEASURING"],
  MEASURING: ["ANALYZED"],
  ANALYZED: ["ARCHIVED"]
};

export class PgContentFactoryWriter implements ContentFactoryWritePort {
  constructor(private readonly db: Stage0Database) {}

  async createAngle(request: Parameters<ContentFactoryWritePort["createAngle"]>[0]): Promise<ContentAngleResult> {
    return this.db.transaction(async (tx) => runContentFactoryIdempotent(tx, request.artistId, request.evidence, "CreateContentAngle", async () => {
      await ensureContentFactorySong(tx, request.artistId, request.command.songId);
      const identity = await resolveCurrentIdentityContext(tx, request.artistId);
      const [angle] = await tx.insert(contentAngles).values({
        id: request.angleId,
        artistId: request.artistId,
        ...(request.command.songId ? { songId: request.command.songId } : {}),
        ...(request.command.campaignId ? { campaignId: request.command.campaignId } : {}),
        ...(identity.identityVersionId ? { identityVersionId: identity.identityVersionId } : {}),
        ...(identity.eraIdentityId ? { eraIdentityId: identity.eraIdentityId } : {}),
        title: request.command.title,
        idea: request.command.idea,
        pillar: request.command.pillar,
        mode: request.command.mode,
        goal: request.command.goal,
        audience: request.command.audience,
        platformTargets: request.command.platformTargets,
        requiredAssets: request.command.requiredAssets,
        learningValue: request.command.learningValue,
        why: request.command.why,
        identityFitRationale: request.command.identityFitRationale,
        productionEffort: request.command.productionEffort,
        sourceType: "MANUAL",
        sourceProvenance: { commandId: request.evidence.commandId },
        originalSnapshot: { ...request.command, ...identity, sourceType: "MANUAL", status: "DRAFT", version: 1 },
        status: "DRAFT",
        version: 1,
        ...(request.evidence.actorId ? { createdByActorId: request.evidence.actorId } : {}),
        createdAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      }).returning();
      if (!angle) throw new Error("CONTENT_ANGLE_NOT_CREATED");
      await appendContentAngleRevision(tx, angle, "CREATE", request.evidence);
      await writeContentFactoryEvidence(tx, {
        artistId: request.artistId,
        aggregateType: "ContentAngle",
        aggregateId: angle.id,
        aggregateVersion: angle.version,
        eventType: "ContentAngleCreated",
        payload: { songId: angle.songId, pillar: angle.pillar, mode: angle.mode },
        auditAction: "CONTENT_ANGLE_CREATED",
        entityType: "ContentAngle",
        entityId: angle.id,
        evidence: request.evidence
      });
      return angleResult(angle);
    }));
  }

  async editAngle(request: Parameters<ContentFactoryWritePort["editAngle"]>[0]): Promise<ContentAngleResult> {
    return this.db.transaction(async (tx) => runContentFactoryIdempotent(tx, request.artistId, request.evidence, "EditContentAngle", async () => {
      const [current] = await tx.select().from(contentAngles).where(and(eq(contentAngles.id, request.command.angleId), eq(contentAngles.artistId, request.artistId))).limit(1);
      if (!current) throw new ContentFactoryPersistenceError("ANGLE_NOT_FOUND");
      if (!reviewable(current.status)) throw new ContentFactoryPersistenceError("ANGLE_NOT_EDITABLE");
      const [updated] = await tx.update(contentAngles).set({
        ...(request.command.title !== undefined ? { title: request.command.title } : {}),
        ...(request.command.idea !== undefined ? { idea: request.command.idea } : {}),
        ...(request.command.pillar !== undefined ? { pillar: request.command.pillar } : {}),
        ...(request.command.mode !== undefined ? { mode: request.command.mode } : {}),
        ...(request.command.goal !== undefined ? { goal: request.command.goal } : {}),
        ...(request.command.audience !== undefined ? { audience: request.command.audience } : {}),
        ...(request.command.platformTargets !== undefined ? { platformTargets: request.command.platformTargets } : {}),
        ...(request.command.requiredAssets !== undefined ? { requiredAssets: request.command.requiredAssets } : {}),
        ...(request.command.learningValue !== undefined ? { learningValue: request.command.learningValue } : {}),
        ...(request.command.why !== undefined ? { why: request.command.why } : {}),
        ...(request.command.identityFitRationale !== undefined ? { identityFitRationale: request.command.identityFitRationale } : {}),
        ...(request.command.productionEffort !== undefined ? { productionEffort: request.command.productionEffort } : {}),
        version: current.version + 1,
        updatedAt: request.evidence.occurredAt
      }).where(eq(contentAngles.id, current.id)).returning();
      if (!updated) throw new Error("CONTENT_ANGLE_NOT_UPDATED");
      await appendContentAngleRevision(tx, updated, "EDIT", request.evidence);
      await writeContentFactoryEvidence(tx, {
        artistId: request.artistId, aggregateType: "ContentAngle", aggregateId: updated.id, aggregateVersion: updated.version,
        eventType: "ContentAngleEdited", payload: { previousVersion: current.version }, auditAction: "CONTENT_ANGLE_EDITED",
        entityType: "ContentAngle", entityId: updated.id, evidence: request.evidence
      });
      return angleResult(updated);
    }));
  }

  async approveAngle(request: Parameters<ContentFactoryWritePort["approveAngle"]>[0]): Promise<ContentAngleResult> {
    return this.reviewAngle(request.artistId, request.command.angleId, request.evidence, "APPROVED");
  }

  async rejectAngle(request: Parameters<ContentFactoryWritePort["rejectAngle"]>[0]): Promise<ContentAngleResult> {
    return this.db.transaction(async (tx) => runContentFactoryIdempotent(tx, request.artistId, request.evidence, "RejectContentAngle", async () => {
      const [current] = await tx.select().from(contentAngles).where(and(eq(contentAngles.id, request.command.angleId), eq(contentAngles.artistId, request.artistId))).limit(1);
      if (!current) throw new ContentFactoryPersistenceError("ANGLE_NOT_FOUND");
      if (!reviewable(current.status)) throw new ContentFactoryPersistenceError("ANGLE_NOT_REVIEWABLE");
      const [updated] = await tx.update(contentAngles).set({
        status: "REJECTED",
        version: current.version + 1,
        rejectionReason: request.command.reason,
        decisionNote: request.command.note ?? null,
        ...(request.evidence.actorId ? { decidedByActorId: request.evidence.actorId } : {}),
        decidedAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      }).where(eq(contentAngles.id, current.id)).returning();
      if (!updated) throw new Error("CONTENT_ANGLE_NOT_REJECTED");
      await appendContentAngleRevision(tx, updated, "REJECT", request.evidence);
      await writeContentFactoryEvidence(tx, {
        artistId: request.artistId, aggregateType: "ContentAngle", aggregateId: updated.id, aggregateVersion: updated.version,
        eventType: "ContentAngleRejected", payload: { reason: request.command.reason, note: request.command.note ?? null },
        auditAction: "CONTENT_ANGLE_REJECTED", entityType: "ContentAngle", entityId: updated.id, evidence: request.evidence
      });
      return angleResult(updated);
    }));
  }

  async deferAngle(request: Parameters<ContentFactoryWritePort["deferAngle"]>[0]): Promise<ContentAngleResult> {
    return this.db.transaction(async (tx) => runContentFactoryIdempotent(tx, request.artistId, request.evidence, "DeferContentAngle", async () => {
      const [current] = await tx.select().from(contentAngles).where(and(eq(contentAngles.id, request.command.angleId), eq(contentAngles.artistId, request.artistId))).limit(1);
      if (!current) throw new ContentFactoryPersistenceError("ANGLE_NOT_FOUND");
      if (current.status !== "DRAFT") throw new ContentFactoryPersistenceError("ANGLE_NOT_REVIEWABLE");
      const [updated] = await tx.update(contentAngles).set({
        status: "DEFERRED",
        version: current.version + 1,
        decisionNote: request.command.note ?? null,
        ...(request.evidence.actorId ? { decidedByActorId: request.evidence.actorId } : {}),
        decidedAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      }).where(eq(contentAngles.id, current.id)).returning();
      if (!updated) throw new Error("CONTENT_ANGLE_NOT_DEFERRED");
      await appendContentAngleRevision(tx, updated, "DEFER", request.evidence);
      await writeContentFactoryEvidence(tx, {
        artistId: request.artistId, aggregateType: "ContentAngle", aggregateId: updated.id, aggregateVersion: updated.version,
        eventType: "ContentAngleDeferred", payload: { note: request.command.note ?? null }, auditAction: "CONTENT_ANGLE_DEFERRED",
        entityType: "ContentAngle", entityId: updated.id, evidence: request.evidence
      });
      return angleResult(updated);
    }));
  }

  async createContentUnitFromAngle(request: Parameters<ContentFactoryWritePort["createContentUnitFromAngle"]>[0]): Promise<ContentUnitResult> {
    return this.db.transaction(async (tx) => runContentFactoryIdempotent(tx, request.artistId, request.evidence, "CreateContentUnitFromAngle", async () => {
      const [angle] = await tx.select().from(contentAngles).where(and(eq(contentAngles.id, request.command.angleId), eq(contentAngles.artistId, request.artistId))).limit(1);
      if (!angle) throw new ContentFactoryPersistenceError("ANGLE_NOT_FOUND");
      if (angle.status !== "APPROVED") throw new ContentFactoryPersistenceError("ANGLE_NOT_APPROVED");
      if (!angle.identityVersionId) throw new ContentFactoryPersistenceError("ANGLE_IDENTITY_CONTEXT_REQUIRED");
      const [identity] = await tx.select({ id: artistIdentityVersions.id }).from(artistIdentityVersions)
        .where(and(eq(artistIdentityVersions.id, angle.identityVersionId), eq(artistIdentityVersions.artistId, request.artistId))).limit(1);
      if (!identity) throw new ContentFactoryPersistenceError("ANGLE_IDENTITY_NOT_FOUND");
      if (angle.eraIdentityId) {
        const [era] = await tx.select({ identityVersionId: eraIdentities.identityVersionId }).from(eraIdentities)
          .where(and(eq(eraIdentities.id, angle.eraIdentityId), eq(eraIdentities.artistId, request.artistId))).limit(1);
        if (!era || era.identityVersionId !== angle.identityVersionId) throw new ContentFactoryPersistenceError("ANGLE_ERA_MISMATCH");
      }
      let songTitle: string | null = null;
      if (angle.songId) {
        const [song] = await tx.select({ title: songs.title }).from(songs).where(and(eq(songs.id, angle.songId), eq(songs.artistId, request.artistId))).limit(1);
        if (!song) throw new ContentFactoryPersistenceError("ANGLE_SONG_NOT_FOUND");
        songTitle = song.title;
      }
      await tx.execute(sql`select id from ${artists} where ${artists.id} = ${request.artistId} for update`);
      const prefix = `${songTitle ? slug(songTitle) || "SONG" : "ARTIST"}-${angle.pillar}`;
      const existing = await tx.select({ unitCode: contentUnits.unitCode }).from(contentUnits)
        .where(and(eq(contentUnits.artistId, request.artistId), sql`${contentUnits.unitCode} LIKE ${`${prefix}-%`}`)).orderBy(desc(contentUnits.unitCode));
      const max = existing.reduce((value, row) => Math.max(value, Number(row.unitCode.match(/-(\d+)$/)?.[1] ?? 0)), 0);
      const unitCode = `${prefix}-${String(max + 1).padStart(3, "0")}`;
      const [unit] = await tx.insert(contentUnits).values({
        id: request.contentUnitId,
        artistId: request.artistId,
        unitCode,
        angleId: angle.id,
        ...(angle.songId ? { songId: angle.songId } : {}),
        ...(angle.campaignId ? { campaignId: angle.campaignId } : {}),
        identityVersionId: angle.identityVersionId,
        ...(angle.eraIdentityId ? { eraIdentityId: angle.eraIdentityId } : {}),
        title: angle.title,
        idea: angle.idea,
        pillar: angle.pillar,
        platformTargets: angle.platformTargets,
        ...(request.command.priority ? { priority: request.command.priority } : {}),
        status: "APPROVED",
        version: 1,
        ...(request.evidence.actorId ? { createdByActorId: request.evidence.actorId } : {}),
        createdAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      }).returning();
      if (!unit) throw new Error("CONTENT_UNIT_NOT_CREATED");
      await tx.insert(contentUnitStatusHistory).values({
        id: crypto.randomUUID(), artistId: request.artistId, contentUnitId: unit.id, toStatus: "APPROVED",
        ...(request.evidence.actorId ? { actorId: request.evidence.actorId } : {}), commandId: request.evidence.commandId, changedAt: request.evidence.occurredAt
      });
      await writeContentFactoryEvidence(tx, {
        artistId: request.artistId, aggregateType: "ContentUnit", aggregateId: unit.id, aggregateVersion: unit.version,
        eventType: "ContentUnitCreated", payload: { angleId: angle.id, unitCode, identityVersionId: unit.identityVersionId, eraIdentityId: unit.eraIdentityId },
        auditAction: "CONTENT_UNIT_CREATED", entityType: "ContentUnit", entityId: unit.id, evidence: request.evidence
      });
      return { contentUnitId: unit.id, angleId: unit.angleId, status: unit.status as ContentUnitStatus, identityVersionId: unit.identityVersionId, eraIdentityId: unit.eraIdentityId };
    }));
  }

  async changeContentUnitStatus(request: Parameters<ContentFactoryWritePort["changeContentUnitStatus"]>[0]): Promise<ContentUnitResult> {
    return this.db.transaction(async (tx) => runContentFactoryIdempotent(tx, request.artistId, request.evidence, "ChangeContentUnitStatus", async () => {
      const [unit] = await tx.select().from(contentUnits).where(and(eq(contentUnits.id, request.command.contentUnitId), eq(contentUnits.artistId, request.artistId))).limit(1);
      if (!unit) throw new ContentFactoryPersistenceError("CONTENT_UNIT_NOT_FOUND");
      const from = unit.status as ContentUnitStatus;
      if (!(canonicalNext[from] ?? []).includes(request.command.status)) throw new ContentFactoryPersistenceError("CONTENT_UNIT_INVALID_TRANSITION");
      const [updated] = await tx.update(contentUnits).set({
        status: request.command.status,
        version: unit.version + 1,
        ...(request.command.status === "ARCHIVED" ? { archivedAt: request.evidence.occurredAt } : {}),
        updatedAt: request.evidence.occurredAt
      }).where(eq(contentUnits.id, unit.id)).returning();
      if (!updated) throw new Error("CONTENT_UNIT_STATUS_NOT_CHANGED");
      await tx.insert(contentUnitStatusHistory).values({
        id: crypto.randomUUID(), artistId: request.artistId, contentUnitId: unit.id, fromStatus: from, toStatus: request.command.status,
        ...(request.command.reason ? { reason: request.command.reason } : {}), ...(request.evidence.actorId ? { actorId: request.evidence.actorId } : {}),
        commandId: request.evidence.commandId, changedAt: request.evidence.occurredAt
      });
      await writeContentFactoryEvidence(tx, {
        artistId: request.artistId, aggregateType: "ContentUnit", aggregateId: updated.id, aggregateVersion: updated.version,
        eventType: "ContentUnitStatusChanged", payload: { from, to: request.command.status, reason: request.command.reason ?? null },
        auditAction: "CONTENT_UNIT_STATUS_CHANGED", entityType: "ContentUnit", entityId: updated.id, evidence: request.evidence
      });
      return { contentUnitId: updated.id, angleId: updated.angleId, status: updated.status as ContentUnitStatus, identityVersionId: updated.identityVersionId, eraIdentityId: updated.eraIdentityId };
    }));
  }

  private async reviewAngle(
    artistId: string,
    angleId: string,
    evidence: Parameters<ContentFactoryWritePort["approveAngle"]>[0]["evidence"],
    status: "APPROVED"
  ): Promise<ContentAngleResult> {
    return this.db.transaction(async (tx) => runContentFactoryIdempotent(tx, artistId, evidence, "ApproveContentAngle", async () => {
      const [current] = await tx.select().from(contentAngles).where(and(eq(contentAngles.id, angleId), eq(contentAngles.artistId, artistId))).limit(1);
      if (!current) throw new ContentFactoryPersistenceError("ANGLE_NOT_FOUND");
      if (!reviewable(current.status)) throw new ContentFactoryPersistenceError("ANGLE_NOT_REVIEWABLE");
      const identity = current.identityVersionId ? { identityVersionId: current.identityVersionId, eraIdentityId: current.eraIdentityId } : await resolveCurrentIdentityContext(tx, artistId);
      const [updated] = await tx.update(contentAngles).set({
        status,
        version: current.version + 1,
        ...(identity.identityVersionId ? { identityVersionId: identity.identityVersionId } : {}),
        ...(identity.eraIdentityId ? { eraIdentityId: identity.eraIdentityId } : {}),
        rejectionReason: null,
        decisionNote: null,
        ...(evidence.actorId ? { decidedByActorId: evidence.actorId } : {}),
        decidedAt: evidence.occurredAt,
        updatedAt: evidence.occurredAt
      }).where(eq(contentAngles.id, current.id)).returning();
      if (!updated) throw new Error("CONTENT_ANGLE_NOT_APPROVED");
      await appendContentAngleRevision(tx, updated, "APPROVE", evidence);
      await writeContentFactoryEvidence(tx, {
        artistId, aggregateType: "ContentAngle", aggregateId: updated.id, aggregateVersion: updated.version,
        eventType: "ContentAngleApproved", payload: { identityVersionId: updated.identityVersionId, eraIdentityId: updated.eraIdentityId },
        auditAction: "CONTENT_ANGLE_APPROVED", entityType: "ContentAngle", entityId: updated.id, evidence
      });
      return angleResult(updated);
    }));
  }
}
