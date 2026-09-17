import { and, eq, lte, gte, sql } from "drizzle-orm";
import {
  PlanningObjectivePersistenceError,
  type PlanningObjectiveResult,
  type PlanningObjectiveStatus,
  type PlanningObjectiveWritePort
} from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { planningObjectives } from "./planning-objective-schema";
import { runPlanningObjectiveIdempotent, writePlanningObjectiveEvidence } from "./planning-objective-persistence";

const resultFrom = (row: typeof planningObjectives.$inferSelect): PlanningObjectiveResult => ({
  objectiveId: row.id,
  status: row.status as PlanningObjectiveStatus,
  version: row.version,
  completedAt: row.completedAt
});

const allowedTransitions: Record<PlanningObjectiveStatus, PlanningObjectiveStatus[]> = {
  DRAFT: ["ACTIVE", "CANCELLED", "ARCHIVED"],
  ACTIVE: ["COMPLETED", "CANCELLED", "ARCHIVED"],
  COMPLETED: ["ARCHIVED"],
  CANCELLED: ["ARCHIVED"],
  ARCHIVED: []
};

export class PgPlanningObjectiveWriter implements PlanningObjectiveWritePort {
  constructor(private readonly db: Stage0Database) {}

  private async ensureNoPrimaryOverlap(
    tx: Parameters<Parameters<Stage0Database["transaction"]>[0]>[0],
    artistId: string,
    periodStart: string,
    periodEnd: string,
    excludeObjectiveId?: string
  ) {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`PlanningObjective:PRIMARY:${artistId}`}))`);
    const filters = [
      eq(planningObjectives.artistId, artistId),
      eq(planningObjectives.priority, "PRIMARY"),
      eq(planningObjectives.status, "ACTIVE"),
      lte(planningObjectives.periodStart, periodEnd),
      gte(planningObjectives.periodEnd, periodStart)
    ];
    if (excludeObjectiveId) filters.push(sql`${planningObjectives.id} <> ${excludeObjectiveId}::uuid`);
    const [overlap] = await tx.select({ id: planningObjectives.id }).from(planningObjectives).where(and(...filters)).limit(1);
    if (overlap) throw new PlanningObjectivePersistenceError("PLANNING_OBJECTIVE_PRIMARY_OVERLAP");
  }

  async createObjective(request: Parameters<PlanningObjectiveWritePort["createObjective"]>[0]): Promise<PlanningObjectiveResult> {
    return this.db.transaction(async (tx) => runPlanningObjectiveIdempotent(tx, request.artistId, request.evidence, "CreatePlanningObjective", async () => {
      if (request.command.priority === "PRIMARY" && request.command.status === "ACTIVE") {
        await this.ensureNoPrimaryOverlap(tx, request.artistId, request.command.periodStart, request.command.periodEnd);
      }

      const [created] = await tx.insert(planningObjectives).values({
        id: request.objectiveId,
        artistId: request.artistId,
        title: request.command.title,
        statement: request.command.statement,
        periodStart: request.command.periodStart,
        periodEnd: request.command.periodEnd,
        scope: request.command.scope,
        ...(request.command.campaignId ? { campaignId: request.command.campaignId } : {}),
        ...(request.command.releaseId ? { releaseId: request.command.releaseId } : {}),
        priority: request.command.priority,
        status: request.command.status,
        successCriteria: request.command.successCriteria,
        version: 1,
        ...(request.evidence.actorId ? { createdByActorId: request.evidence.actorId, updatedByActorId: request.evidence.actorId } : {}),
        createdAt: request.evidence.occurredAt,
        updatedAt: request.evidence.occurredAt
      }).returning();
      if (!created) throw new Error("PLANNING_OBJECTIVE_NOT_CREATED");

      await writePlanningObjectiveEvidence(tx, {
        artistId: request.artistId,
        objectiveId: created.id,
        aggregateVersion: created.version,
        eventType: "PlanningObjectiveCreated",
        payload: {
          title: created.title,
          periodStart: created.periodStart,
          periodEnd: created.periodEnd,
          scope: created.scope,
          priority: created.priority,
          status: created.status,
          successCriteria: created.successCriteria,
          campaignId: created.campaignId,
          releaseId: created.releaseId
        },
        auditAction: "PLANNING_OBJECTIVE_CREATED",
        evidence: request.evidence
      });
      return resultFrom(created);
    }));
  }

  async transitionObjective(request: Parameters<PlanningObjectiveWritePort["transitionObjective"]>[0]): Promise<PlanningObjectiveResult> {
    return this.db.transaction(async (tx) => runPlanningObjectiveIdempotent(tx, request.artistId, request.evidence, `TransitionPlanningObjective:${request.toStatus}`, async () => {
      const [current] = await tx.select().from(planningObjectives).where(and(
        eq(planningObjectives.id, request.objectiveId),
        eq(planningObjectives.artistId, request.artistId)
      )).limit(1);
      if (!current) throw new PlanningObjectivePersistenceError("PLANNING_OBJECTIVE_NOT_FOUND");
      if (request.expectedVersion !== undefined && current.version !== request.expectedVersion) throw new PlanningObjectivePersistenceError("PLANNING_OBJECTIVE_VERSION_CONFLICT");

      const currentStatus = current.status as PlanningObjectiveStatus;
      if (!allowedTransitions[currentStatus].includes(request.toStatus)) {
        throw new PlanningObjectivePersistenceError("PLANNING_OBJECTIVE_INVALID_TRANSITION");
      }

      if (request.toStatus === "ACTIVE" && current.priority === "PRIMARY") {
        await this.ensureNoPrimaryOverlap(tx, request.artistId, current.periodStart, current.periodEnd, current.id);
      }

      const completedAt = request.toStatus === "COMPLETED" ? request.evidence.occurredAt : current.completedAt;
      const [updated] = await tx.update(planningObjectives).set({
        status: request.toStatus,
        completedAt,
        version: current.version + 1,
        ...(request.evidence.actorId ? { updatedByActorId: request.evidence.actorId } : {}),
        updatedAt: request.evidence.occurredAt
      }).where(and(
        eq(planningObjectives.id, request.objectiveId),
        eq(planningObjectives.artistId, request.artistId),
        eq(planningObjectives.version, current.version),
        eq(planningObjectives.status, current.status)
      )).returning();
      if (!updated) throw new PlanningObjectivePersistenceError("PLANNING_OBJECTIVE_VERSION_CONFLICT");

      await writePlanningObjectiveEvidence(tx, {
        artistId: request.artistId,
        objectiveId: updated.id,
        aggregateVersion: updated.version,
        eventType: `PlanningObjective${request.toStatus.charAt(0)}${request.toStatus.slice(1).toLowerCase()}`,
        payload: {
          fromStatus: currentStatus,
          toStatus: request.toStatus,
          completedAt: updated.completedAt?.toISOString() ?? null
        },
        auditAction: `PLANNING_OBJECTIVE_${request.toStatus}`,
        evidence: request.evidence
      });
      return resultFrom(updated);
    }));
  }
}
