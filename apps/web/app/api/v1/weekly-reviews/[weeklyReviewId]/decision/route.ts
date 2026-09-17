import { CreateDecisionService } from "@artist-os/core";
import { PgDecisionWriter, getWeeklyReview } from "@artist-os/db";
import { commandResultResponse, readJson } from "@/lib/artist-foundation-command";
import { resolveDecisionMutationContext } from "@/lib/decision-command";
import { apiErrorResponse } from "@/lib/http";
import { getDatabaseRuntime } from "@/lib/runtime";

interface CreateReviewDecisionBody {
  title: string;
  decision: string;
  reason: string;
  scope: string;
  reviewAt?: string;
  sectionKind?: "DECISIONS_TO_MAKE" | "RECOMMENDED_NEXT_FOCUS";
  itemIndex?: number;
}

export async function POST(request: Request, context: { params: Promise<{ weeklyReviewId: string }> }) {
  const resolution = await resolveDecisionMutationContext(request);
  if (resolution instanceof Response) return resolution;
  const body = await readJson<CreateReviewDecisionBody>(request, resolution.traceId);
  if (body instanceof Response) return body;
  const { weeklyReviewId } = await context.params;

  const runtime = getDatabaseRuntime();
  const review = await getWeeklyReview(runtime.db, resolution.commandContext.artistId, weeklyReviewId);
  if (!review) return apiErrorResponse({ code: "WEEKLY_REVIEW_NOT_FOUND", message: "Weekly Review was not found." }, resolution.traceId, 404);

  if (body.sectionKind) {
    const targetSection = review.sections.find((section) => section.kind === body.sectionKind);
    if (!targetSection) return apiErrorResponse({ code: "WEEKLY_REVIEW_SECTION_NOT_FOUND", message: "Requested Weekly Review section does not exist." }, resolution.traceId, 400);
    if (body.itemIndex !== undefined && !targetSection.items[body.itemIndex]) {
      return apiErrorResponse({ code: "WEEKLY_REVIEW_ITEM_NOT_FOUND", message: "Requested Weekly Review item does not exist." }, resolution.traceId, 400);
    }
  }

  const result = await new CreateDecisionService(new PgDecisionWriter(runtime.db)).execute({
    title: body.title,
    decision: body.decision,
    reason: body.reason,
    scope: body.scope,
    ...(body.reviewAt ? { reviewAt: body.reviewAt } : {}),
    references: [{ refType: "WeeklyReview", refId: weeklyReviewId, relation: "BASED_ON" }]
  }, resolution.commandContext);

  return commandResultResponse(result, resolution.traceId, 201);
}
