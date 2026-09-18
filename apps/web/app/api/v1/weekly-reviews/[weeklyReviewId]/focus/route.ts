import { CreatePlanningObjectiveService } from "@artist-os/core";
import { getWeeklyReview, PgPlanningObjectiveWriter } from "@artist-os/db";
import { commandResultResponse, readJson } from "@/lib/artist-foundation-command";
import { apiErrorResponse } from "@/lib/http";
import { resolvePlanningObjectiveMutationContext } from "@/lib/planning-objective-command";
import { getDatabaseRuntime } from "@/lib/runtime";

type CreateFocusBody = {
  itemIndex: number;
  title: string;
  statement?: string;
  periodStart: string;
  periodEnd: string;
  successCriteria?: string[];
};

export async function POST(request: Request, context: { params: Promise<{ weeklyReviewId: string }> }) {
  const resolution = await resolvePlanningObjectiveMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<CreateFocusBody>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const { weeklyReviewId } = await context.params;

  if (!Number.isInteger(body.itemIndex) || body.itemIndex < 0) {
    return apiErrorResponse({ code: "WEEKLY_REVIEW_FOCUS_ITEM_INVALID", message: "A valid recommended-focus item is required." }, resolution.traceId, 400);
  }

  const review = await getWeeklyReview(getDatabaseRuntime().db, resolution.commandContext.artistId, weeklyReviewId);
  if (!review) return apiErrorResponse({ code: "WEEKLY_REVIEW_NOT_FOUND", message: "Weekly Review was not found." }, resolution.traceId, 404);

  const section = review.sections.find((candidate) => candidate.kind === "RECOMMENDED_NEXT_FOCUS");
  const item = section?.items[body.itemIndex];
  if (!item) return apiErrorResponse({ code: "WEEKLY_REVIEW_FOCUS_ITEM_NOT_FOUND", message: "Recommended focus item was not found in this immutable review." }, resolution.traceId, 404);

  const result = await new CreatePlanningObjectiveService(new PgPlanningObjectiveWriter(getDatabaseRuntime().db)).execute({
    title: body.title,
    statement: body.statement?.trim() || item.text,
    periodStart: body.periodStart,
    periodEnd: body.periodEnd,
    scope: "ARTIST",
    priority: "PRIMARY",
    status: "ACTIVE",
    successCriteria: body.successCriteria ?? [],
    relatedRefs: item.references ?? []
  }, resolution.commandContext);

  return commandResultResponse(result, resolution.traceId, 201);
}
