import { and, asc, eq, inArray, sql } from "drizzle-orm";
import type { OperationalActionPriority, OperationalActionStatus } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { operationalActions } from "./operational-action-schema";

export interface OperationalActionView {
  id: string;
  sourceDomain: string;
  sourceEntityType: string;
  sourceEntityId: string;
  platform: string | null;
  title: string;
  description: string | null;
  actionType: string;
  status: OperationalActionStatus;
  priority: OperationalActionPriority;
  dueAt: Date | null;
  notBefore: Date | null;
  executionMode: string;
  externalUrl: string | null;
  evidenceRef: string | null;
  stateReason: string | null;
  version: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const priorityOrder = sql<number>`case ${operationalActions.priority}
  when 'URGENT' then 0
  when 'HIGH' then 1
  when 'NORMAL' then 2
  else 3 end`;

export class PgOperationalActionReader {
  constructor(private readonly db: Stage0Database) {}

  async listActions(artistId: string, options: { statuses?: OperationalActionStatus[]; limit?: number } = {}): Promise<OperationalActionView[]> {
    const limit = Math.min(Math.max(options.limit ?? 100, 1), 100);
    const filters = [eq(operationalActions.artistId, artistId)];
    if (options.statuses?.length) filters.push(inArray(operationalActions.status, options.statuses));
    const rows = await this.db.select().from(operationalActions)
      .where(and(...filters))
      .orderBy(priorityOrder, asc(operationalActions.dueAt), asc(operationalActions.createdAt))
      .limit(limit);
    return rows.map((row) => ({
      id: row.id,
      sourceDomain: row.sourceDomain,
      sourceEntityType: row.sourceEntityType,
      sourceEntityId: row.sourceEntityId,
      platform: row.platform,
      title: row.title,
      description: row.description,
      actionType: row.actionType,
      status: row.status as OperationalActionStatus,
      priority: row.priority as OperationalActionPriority,
      dueAt: row.dueAt,
      notBefore: row.notBefore,
      executionMode: row.executionMode,
      externalUrl: row.externalUrl,
      evidenceRef: row.evidenceRef,
      stateReason: row.stateReason,
      version: row.version,
      completedAt: row.completedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
  }

  async getAction(artistId: string, actionId: string): Promise<OperationalActionView | null> {
    const rows = await this.db.select().from(operationalActions)
      .where(and(eq(operationalActions.artistId, artistId), eq(operationalActions.id, actionId))).limit(1);
    const row = rows[0];
    if (!row) return null;
    return {
      id: row.id, sourceDomain: row.sourceDomain, sourceEntityType: row.sourceEntityType, sourceEntityId: row.sourceEntityId,
      platform: row.platform, title: row.title, description: row.description, actionType: row.actionType,
      status: row.status as OperationalActionStatus, priority: row.priority as OperationalActionPriority,
      dueAt: row.dueAt, notBefore: row.notBefore, executionMode: row.executionMode, externalUrl: row.externalUrl,
      evidenceRef: row.evidenceRef, stateReason: row.stateReason, version: row.version, completedAt: row.completedAt,
      createdAt: row.createdAt, updatedAt: row.updatedAt
    };
  }
}
