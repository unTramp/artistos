import { and, eq, isNull, lte, gte, sql } from "drizzle-orm";
import {
  PlanningObjectivePersistenceError,
  type PlanningObjectiveResult,
  type PlanningObjectiveWritePort
} from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { planningObjectives } from "./planning-objective-schema";
import { runPlanningObjectiveIdempotent, writePlanningObjectiveEvidence } from "./planning-objective-persistence";

const resultFrom = (row: typeof planningObjectives.$inferSelect): PlanningObjectiveResult => ({
  objectiveId: row.id,
  version: row.version,
  completedAt: row.completedAt
});

export class PgPlanningObjectiveWriter implements PlanningObjectiveWritePort {
  constructor(private readonly db: Stage0Database) {}

  async createObjective(request: Parameters<PlanningObjectiveWritePort["createObjective"]>[0]): Promise<PlanningObjectiveResult> {
    return this.db.transaction(async (tx) => runPlanningObjectiveIdempotent(tx, request.artistId, request.evidence, "CreatePlanningObjective", async () => {
      if (request.command.priority === "PRIMARY") {
        await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`PlanningObjective:PRIMARY:${request.artistId}`}))`);
        const [overlap] = await tx.select({ id: planningObjectives.id }).from(planningObjectives).where(and(
          eq(planningObjectives.artistId, request.artistId),
          eq(planningObjectives.priority, "PRIMARY"),
          isNull(planningObjectives.completedAt),
          lte(planningObjectives.periodStart, request.command.periodEnd),
          gte(planningObjectives.periodEnd, request.command.periodStart)
        )).limit(1);
        if (overlap) throw new PlanningObjectivePersistenceError("PLANNING_OBJECTIVE_PRIMARY_OVERLAP");
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
          campaignId: created.campaignId,
          releaseId: created.releaseId
        },
        auditAction: "PLANNING_OBJECTIVE_CREATED",
        evidence: request.evidence
      });
      return resultFrom(created);
    }));
  }

  async completeObjective(request: Parameters<PlanningObjectiveWritePort["completeObjective"]>[0]): Promise<PlanningObjectiveResult> {
    return this.db.transaction(async (tx) => runPlanningObjectiveIdempotent(tx, request.artistId, request.evidence, "CompletePlanningObjective", async () => {
      const [current] = await tx.select().from(planningObjectives).where(and(
        eq(planningObjectives.id, request.objectiveId),
        eq(planningObjectives.artistId, request.artistId)
      )).limit(1);
      if (!current) throw new PlanningObjectivePersistenceError("PLANNING_OBJECTIVE_NOT_FOUND");
      if (current.completedAt) throw new PlanningObjectivePersistenceError("PLANNING_OBJECTIVE_ALREADY_COMPLETED");
      if (request.expectedVersion !== undefined && current.version !== request.expectedVersion) throw new PlanningObjectivePersistenceError("PLANNING_OBJECTIVE_VERSION_CONFLICT");

      const [updated] = await tx.update(planningObjectives).set({
        completedAt: request.evidence.occurredAt,
        version: current.version + 1,
        ...(request.evidence.actorId ? { updatedByActorId: request.evidence.actorId } : {}),
        updatedAt: request.evidence.occurredAt
      }).where(and(
        eq(planningObjectives.id, request.objectiveId),
        eq(planningObjectives.artistId, request.artistId),
        eq(planningObjectives.version, current.version),
        isNull(planningObjectives.completedAt)
      )).returning();
      if (!updated) throw new PlanningObjectivePersistenceError("PLANNING_OBJECTIVE_VERSION_CONFLICT");

      await writePlanningObjectiveEvidence(tx, {
        artistId: request.artistId,
        objectiveId: updated.id,
        aggregateVersion: updated.version,
        eventType: "PlanningObjectiveCompleted",
        payload: { completedAt: request.evidence.occurredAt.toISOString() },
        auditAction: "PLANNING_OBJECTIVE_COMPLETED",
        evidence: request.evidence
      });
      return resultFrom(updated);
    }));
  }
}
