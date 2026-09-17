import { CreateWeeklyReviewService } from "@artist-os/core";
import { PgWeeklyReviewWriter } from "@artist-os/db";
import { commandResultResponse, resolveArtistMutationContext } from "@/lib/artist-foundation-command";
import { apiErrorResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";
import { buildDeterministicWeeklyReview } from "@/lib/weekly-review-generator";

export async function POST(request: Request) {
  const resolution = await resolveArtistMutationContext(request);
  if (resolution instanceof Response) return resolution;

  const body = await request.json().catch(() => ({})) as { periodStart?: string; periodEnd?: string };
  const periodStart = body.periodStart ? new Date(body.periodStart) : null;
  const periodEnd = body.periodEnd ? new Date(body.periodEnd) : null;
  if (!periodStart || Number.isNaN(periodStart.getTime()) || !periodEnd || Number.isNaN(periodEnd.getTime())) {
    return apiErrorResponse({ code: "WEEKLY_REVIEW_PERIOD_INVALID", message: "periodStart and periodEnd must be valid ISO date/time values." }, resolution.traceId, 400);
  }

  const runtime = getDatabaseRuntime();
  const generatedAt = resolution.commandContext.requestedAt;
  const command = await buildDeterministicWeeklyReview(runtime.db, resolution.commandContext.artistId, { periodStart, periodEnd, generatedAt });
  const result = await new CreateWeeklyReviewService(new PgWeeklyReviewWriter(runtime.db)).execute(command, resolution.commandContext);
  return commandResultResponse(result, resolution.traceId, 201);
}
