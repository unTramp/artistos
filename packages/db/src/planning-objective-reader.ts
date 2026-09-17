import { and, asc, desc, eq, gte, inArray, lte } from "drizzle-orm";
import type { PlanningObjectivePriority, PlanningObjectiveScope, PlanningObjectiveStatus } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { planningObjectives } from "./planning-objective-schema";

export interface PlanningObjectiveView {
  id: string;
  artistId: string;
  title: string;
  statement: string;
  periodStart: string;
  periodEnd: string;
  scope: PlanningObjectiveScope;
  campaignId: string | null;
  releaseId: string | null;
  priority: PlanningObjectivePriority;
  status: PlanningObjectiveStatus;
  successCriteria: string[];
  version: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const mapRow = (row: typeof planningObjectives.$inferSelect): PlanningObjectiveView => ({
  id: row.id,
  artistId: row.artistId,
  title: row.title,
  statement: row.statement,
  periodStart: row.periodStart,
  periodEnd: row.periodEnd,
  scope: row.scope as PlanningObjectiveScope,
  campaignId: row.campaignId,
  releaseId: row.releaseId,
  priority: row.priority as PlanningObjectivePriority,
  status: row.status as PlanningObjectiveStatus,
  successCriteria: row.successCriteria,
  version: row.version,
  completedAt: row.completedAt,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt
});

export class PgPlanningObjectiveReader {
  constructor(private readonly db: Stage0Database) {}

  async getCurrentPrimary(artistId: string, onDate: string): Promise<PlanningObjectiveView | null> {
    const [row] = await this.db.select().from(planningObjectives).where(and(
      eq(planningObjectives.artistId, artistId),
      eq(planningObjectives.priority, "PRIMARY"),
      eq(planningObjectives.status, "ACTIVE"),
      lte(planningObjectives.periodStart, onDate),
      gte(planningObjectives.periodEnd, onDate)
    )).orderBy(desc(planningObjectives.updatedAt)).limit(1);
    return row ? mapRow(row) : null;
  }

  async listObjectives(artistId: string, options: { includeCompleted?: boolean; limit?: number } = {}): Promise<PlanningObjectiveView[]> {
    const filters = [eq(planningObjectives.artistId, artistId)];
    if (!options.includeCompleted) filters.push(inArray(planningObjectives.status, ["DRAFT", "ACTIVE"]));
    const rows = await this.db.select().from(planningObjectives)
      .where(and(...filters))
      .orderBy(asc(planningObjectives.status), desc(planningObjectives.periodStart), desc(planningObjectives.createdAt))
      .limit(Math.min(Math.max(options.limit ?? 50, 1), 100));
    return rows.map(mapRow);
  }

  async getObjective(artistId: string, objectiveId: string): Promise<PlanningObjectiveView | null> {
    const [row] = await this.db.select().from(planningObjectives).where(and(
      eq(planningObjectives.artistId, artistId),
      eq(planningObjectives.id, objectiveId)
    )).limit(1);
    return row ? mapRow(row) : null;
  }
}
