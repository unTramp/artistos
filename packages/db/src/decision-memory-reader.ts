import { and, asc, desc, eq, inArray, lte } from "drizzle-orm";
import type { DecisionStatus } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { decisions, decisionStateHistory } from "./decision-memory-schema";

export interface DecisionView {
  id: string;
  artistId: string;
  title: string;
  decision: string;
  reason: string;
  evidenceIds: string[];
  experimentIds: string[];
  scope: string;
  reviewAt: Date | null;
  status: DecisionStatus;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DecisionHistoryView {
  id: string;
  fromStatus: DecisionStatus | null;
  toStatus: DecisionStatus;
  rationale: string | null;
  actorType: string;
  actorId: string | null;
  traceId: string;
  changedAt: Date;
}

const mapDecision = (row: typeof decisions.$inferSelect): DecisionView => ({
  id: row.id,
  artistId: row.artistId,
  title: row.title,
  decision: row.decision,
  reason: row.reason,
  evidenceIds: row.evidenceIds,
  experimentIds: row.experimentIds,
  scope: row.scope,
  reviewAt: row.reviewAt,
  status: row.status as DecisionStatus,
  version: row.version,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt
});

export class PgDecisionReader {
  constructor(private readonly db: Stage0Database) {}

  async listDecisions(artistId: string, options: {
    statuses?: DecisionStatus[];
    scope?: string;
    reviewDueBefore?: Date;
    limit?: number;
  } = {}): Promise<DecisionView[]> {
    const filters = [eq(decisions.artistId, artistId)];
    if (options.statuses?.length) filters.push(inArray(decisions.status, options.statuses));
    if (options.scope) filters.push(eq(decisions.scope, options.scope));
    if (options.reviewDueBefore) filters.push(lte(decisions.reviewAt, options.reviewDueBefore));
    const rows = await this.db.select().from(decisions)
      .where(and(...filters))
      .orderBy(desc(decisions.createdAt))
      .limit(Math.min(Math.max(options.limit ?? 100, 1), 100));
    return rows.map(mapDecision);
  }

  async getDecision(artistId: string, decisionId: string): Promise<DecisionView | null> {
    const [row] = await this.db.select().from(decisions)
      .where(and(eq(decisions.artistId, artistId), eq(decisions.id, decisionId)))
      .limit(1);
    return row ? mapDecision(row) : null;
  }

  async listHistory(artistId: string, decisionId: string): Promise<DecisionHistoryView[]> {
    const rows = await this.db.select().from(decisionStateHistory)
      .where(and(eq(decisionStateHistory.artistId, artistId), eq(decisionStateHistory.decisionId, decisionId)))
      .orderBy(asc(decisionStateHistory.changedAt));
    return rows.map((row) => ({
      id: row.id,
      fromStatus: row.fromStatus as DecisionStatus | null,
      toStatus: row.toStatus as DecisionStatus,
      rationale: row.rationale,
      actorType: row.actorType,
      actorId: row.actorId,
      traceId: row.traceId,
      changedAt: row.changedAt
    }));
  }
}
