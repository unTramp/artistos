import type { WeeklyReviewResult, WeeklyReviewWritePort } from "@artist-os/core";
import type { Stage0Database } from "./runtime";
import { weeklyReviews } from "./weekly-review-schema";
import { runWeeklyReviewIdempotent, writeWeeklyReviewEvidence } from "./weekly-review-persistence";

const resultFrom = (row: typeof weeklyReviews.$inferSelect): WeeklyReviewResult => ({
  weeklyReviewId: row.id,
  version: row.version,
  generatedAt: row.generatedAt.toISOString()
});

export class PgWeeklyReviewWriter implements WeeklyReviewWritePort {
  constructor(private readonly db: Stage0Database) {}

  async createWeeklyReview(request: Parameters<WeeklyReviewWritePort["createWeeklyReview"]>[0]): Promise<WeeklyReviewResult> {
    return this.db.transaction(async (tx) => runWeeklyReviewIdempotent(tx, request.artistId, request.evidence, async () => {
      const [created] = await tx.insert(weeklyReviews).values({
        id: request.weeklyReviewId,
        artistId: request.artistId,
        periodStart: new Date(request.command.periodStart),
        periodEnd: new Date(request.command.periodEnd),
        generatedAt: new Date(request.command.generatedAt),
        configurationVersion: request.command.configurationVersion,
        sourceSnapshotIds: request.command.sourceSnapshotIds ?? [],
        insightIds: request.command.insightIds ?? [],
        sections: request.command.sections,
        version: 1,
        ...(request.evidence.actorId ? { createdByActorId: request.evidence.actorId } : {}),
        createdAt: request.evidence.occurredAt
      }).returning();

      if (!created) throw new Error("WEEKLY_REVIEW_NOT_CREATED");

      await writeWeeklyReviewEvidence(tx, {
        artistId: request.artistId,
        weeklyReviewId: created.id,
        aggregateVersion: created.version,
        payload: {
          periodStart: created.periodStart.toISOString(),
          periodEnd: created.periodEnd.toISOString(),
          generatedAt: created.generatedAt.toISOString(),
          configurationVersion: created.configurationVersion,
          sourceSnapshotIds: created.sourceSnapshotIds,
          insightIds: created.insightIds
        },
        evidence: request.evidence
      });

      return resultFrom(created);
    }));
  }
}
