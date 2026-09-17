import { getWeeklyReview } from "@artist-os/db";
import { resolveAuthenticatedActorContext } from "@/lib/actor-context";
import { apiErrorResponse, getTraceId, successResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

export async function GET(request: Request, context: { params: Promise<{ weeklyReviewId: string }> }) {
  const traceId = getTraceId(request.headers);
  const actorContext = await resolveAuthenticatedActorContext(request.headers);
  if (!actorContext) return apiErrorResponse({ code: "AUTH_REQUIRED", message: "Authentication is required." }, traceId, 401);
  if (!actorContext.artistId) return apiErrorResponse({ code: "WORKSPACE_REQUIRED", message: "Artist workspace is required." }, traceId, 409);
  const { weeklyReviewId } = await context.params;
  const review = await getWeeklyReview(getDatabaseRuntime().db, actorContext.artistId, weeklyReviewId);
  if (!review) return apiErrorResponse({ code: "WEEKLY_REVIEW_NOT_FOUND", message: "Weekly Review was not found." }, traceId, 404);
  return successResponse({ review }, traceId);
}
