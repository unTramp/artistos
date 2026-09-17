import { and, asc, desc, eq, inArray, lte } from "drizzle-orm";
import type { LearningConfidence, LearningReferenceInput, LearningScope, LearningStatus } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { learnings, learningStateHistory } from "./learning-schema";

export interface LearningView {
  id: string;
  artistId: string;
  statement: string;
  scope: LearningScope;
  confidence: LearningConfidence;
  confidenceRationale: string;
  references: LearningReferenceInput[];
  freshUntil: Date | null;
  status: LearningStatus;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningHistoryView {
  id: string;
  learningId: string;
  fromStatus: LearningStatus | null;
  toStatus: LearningStatus;
  rationale: string | null;
  actorType: string;
  actorId: string | null;
  traceId: string;
  changedAt: Date;
}

const viewFrom = (row: typeof learnings.$inferSelect): LearningView => ({
  id: row.id,
  artistId: row.artistId,
  statement: row.statement,
  scope: row.scope as LearningScope,
  confidence: row.confidence as LearningConfidence,
  confidenceRationale: row.confidenceRationale,
  references: row.references,
  freshUntil: row.freshUntil,
  status: row.status as LearningStatus,
  version: row.version,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt
});

export const listLearnings = async (db: Stage0Database, artistId: string, filters?: { statuses?: LearningStatus[]; scope?: LearningScope; staleBefore?: Date; limit?: number }) => {
  const conditions = [eq(learnings.artistId, artistId)];
  if (filters?.statuses?.length) conditions.push(inArray(learnings.status, filters.statuses));
  if (filters?.scope) conditions.push(eq(learnings.scope, filters.scope));
  if (filters?.staleBefore) conditions.push(lte(learnings.freshUntil, filters.staleBefore));
  const rows = await db.select().from(learnings).where(and(...conditions)).orderBy(desc(learnings.updatedAt)).limit(filters?.limit ?? 100);
  return rows.map(viewFrom);
};

export const getLearning = async (db: Stage0Database, artistId: string, learningId: string) => {
  const [row] = await db.select().from(learnings).where(and(eq(learnings.artistId, artistId), eq(learnings.id, learningId))).limit(1);
  return row ? viewFrom(row) : null;
};

export const listLearningHistory = async (db: Stage0Database, artistId: string, learningId: string): Promise<LearningHistoryView[]> => {
  const rows = await db.select().from(learningStateHistory).where(and(eq(learningStateHistory.artistId, artistId), eq(learningStateHistory.learningId, learningId))).orderBy(asc(learningStateHistory.changedAt));
  return rows.map((row) => ({
    id: row.id,
    learningId: row.learningId,
    fromStatus: row.fromStatus as LearningStatus | null,
    toStatus: row.toStatus as LearningStatus,
    rationale: row.rationale,
    actorType: row.actorType,
    actorId: row.actorId,
    traceId: row.traceId,
    changedAt: row.changedAt
  }));
};
