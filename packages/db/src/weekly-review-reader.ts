import { and, desc, eq } from "drizzle-orm";
import type { WeeklyReviewSectionInput } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { weeklyReviews } from "./weekly-review-schema";

export interface WeeklyReviewView {
  id: string;
  artistId: string;
  periodStart: Date;
  periodEnd: Date;
  generatedAt: Date;
  configurationVersion: string;
  sourceSnapshotIds: string[];
  insightIds: string[];
  sections: WeeklyReviewSectionInput[];
  version: number;
  createdAt: Date;
}

const viewFrom = (row: typeof weeklyReviews.$inferSelect): WeeklyReviewView => ({
  id: row.id,
  artistId: row.artistId,
  periodStart: row.periodStart,
  periodEnd: row.periodEnd,
  generatedAt: row.generatedAt,
  configurationVersion: row.configurationVersion,
  sourceSnapshotIds: row.sourceSnapshotIds,
  insightIds: row.insightIds,
  sections: row.sections,
  version: row.version,
  createdAt: row.createdAt
});

export const listWeeklyReviews = async (db: Stage0Database, artistId: string, limit = 24): Promise<WeeklyReviewView[]> => {
  const rows = await db.select().from(weeklyReviews)
    .where(eq(weeklyReviews.artistId, artistId))
    .orderBy(desc(weeklyReviews.generatedAt))
    .limit(limit);
  return rows.map(viewFrom);
};

export const getWeeklyReview = async (db: Stage0Database, artistId: string, weeklyReviewId: string): Promise<WeeklyReviewView | null> => {
  const [row] = await db.select().from(weeklyReviews)
    .where(and(eq(weeklyReviews.artistId, artistId), eq(weeklyReviews.id, weeklyReviewId)))
    .limit(1);
  return row ? viewFrom(row) : null;
};
